@app.post("/api/v1/models/init-sandbox")
def init_sandbox_api(payload: dict = Body(...)):
    """Initializes a project sandbox from a full frontend configuration (Start from scratch)"""
    project_id = payload.get("projectId")
    config = payload.get("config")
    if not project_id or not config:
        raise HTTPException(status_code=400, detail="Missing projectId or config")

    # [FIX F-001] Strip LibraryGroup before saving to sandbox blueprint
    def strip_ui_wrappers(node):
        if isinstance(node, dict):
            # If this node has moreModuleInfo, filter it
            if "moreModuleInfo" in node:
                new_subs = []
                for sub in node["moreModuleInfo"]:
                    if sub.get("moduleGroupName") == "LibraryGroup":
                        # Promote children directly
                        new_subs.extend(strip_ui_wrappers(sub).get("moreModuleInfo", []))
                    else:
                        new_subs.append(strip_ui_wrappers(sub))
                node["moreModuleInfo"] = new_subs
            return {k: strip_ui_wrappers(v) for k, v in node.items()}
        elif isinstance(node, list):
            return [strip_ui_wrappers(i) for i in node]
        return node

    from core.resource_adapter import frontend_to_comp_desc
    full_json = frontend_to_comp_desc(config)
    # Apply stripping to the full tree to ensure standard tool compatibility
    sanitized_json = strip_ui_wrappers(full_json)

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        full_json_path = tmp_path / "CompDesc.json"
        with open(full_json_path, "w", encoding="utf-8") as f:
            json.dump(sanitized_json, f, ensure_ascii=False, indent=2)
        
        split_out = tmp_path / "split"
        split_out.mkdir()
        split_comp_desc(str(full_json_path), str(split_out))
        
        blueprint_path = split_out / "blueprint_CompDesc.json"
        with open(blueprint_path, "r", encoding="utf-8") as f:
            blueprint = json.load(f)
            
        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), tmp_path)
        
        abi_path = data_manager.get_project_dir(project_id) / "AbiSet.json"
        if config.get("abilities"):
            from core.resource_adapter import export_abilities
            abi_data = export_abilities(config["abilities"])
            with open(abi_path, "w", encoding="utf-8") as f:
                json.dump(abi_data, f, ensure_ascii=False, indent=2)

    return {"status": "success", "project_id": project_id}
