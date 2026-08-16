"""Builders for ability export payloads."""


def build_exported_abilities(abilities, attribute_mapper):
    if not abilities:
        return {"version": "V1.0", "componentAbility": [], "functionAbility": []}

    return {
        "version": abilities.get("version", "V1.0"),
        "componentAbility": abilities.get("componentAbility", []),
        "functionAbility": [
            build_function_ability(function_ability, attribute_mapper)
            for function_ability in abilities.get("functionAbility", [])
        ],
    }


def build_function_ability(function_ability, attribute_mapper):
    return {
        "type": function_ability.get("type", ""),
        "desc": function_ability.get("desc", ""),
        "tips": function_ability.get("tips", ""),
        "childFunction": [
            build_child_function(child_function, attribute_mapper)
            for child_function in function_ability.get("childFunction", [])
        ],
    }


def build_child_function(child_function, attribute_mapper):
    return {
        "type": child_function.get("type", child_function.get("key", "")),
        "desc": child_function.get("desc", ""),
        "tips": child_function.get("tips", ""),
        "key": child_function.get("key", ""),
        "attr": [attribute_mapper(attribute, True) for attribute in child_function.get("attr", [])],
        "cloneEnable": child_function.get("cloneEnable", False),
    }
