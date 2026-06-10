#!/usr/bin/env python
"""Point d'entrée Django : délègue au projet dans backend/."""
import os
import sys
from pathlib import Path


def main():
    backend_dir = Path(__file__).resolve().parent / "backend"
    sys.path.insert(0, str(backend_dir))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Activez le venv backend puis réessayez."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
