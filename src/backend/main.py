"""Compatibility startup entrypoint.

The HTTP application is assembled in app.api.http. This module remains the
stable Python startup and import entrypoint.
"""

from app.api.http import (
    CONFIG,
    SAVED_PROJECTS_DIR,
    USER_SAVES_DIR,
    app,
    compile_cmodel_api,
    create_app,
)

__all__ = [
    "CONFIG",
    "SAVED_PROJECTS_DIR",
    "USER_SAVES_DIR",
    "app",
    "compile_cmodel_api",
    "create_app",
]


if __name__ == "__main__":
    import argparse
    import os
    import uvicorn

    parser = argparse.ArgumentParser(description="AMR Studio V4 backend")
    parser.add_argument("--host", default=os.getenv("HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.getenv("PORT", "8002")))
    args = parser.parse_args()
    uvicorn.run(app, host=args.host, port=args.port)
