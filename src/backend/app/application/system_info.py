from app.config import BackendConfig


def get_system_version(config: BackendConfig) -> dict:
    return {
        "backendVersion": config.backend_version,
        "buildDate": config.build_date,
        "commitHash": config.commit_hash,
        "serviceStartTime": config.service_start_time.isoformat(),
    }
