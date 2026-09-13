#!/usr/bin/env python3
"""Validate that every published WOBUZZ show has a local cover asset."""

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "data" / "shows.json"


def main() -> int:
    shows = json.loads(INDEX_PATH.read_text(encoding="utf-8")).get("shows", [])
    errors: list[str] = []

    for show in shows:
        show_id = show.get("id", "<unknown>")
        if show_id.startswith("test_show_") or show.get("title") == "Test Show":
            errors.append(f"placeholder test show is published: {show_id}")
            continue

        cover = show.get("cover")
        if not isinstance(cover, str) or not cover:
            errors.append(f"{show_id}: missing cover path")
            continue

        cover_path = ROOT / cover
        if not cover_path.is_file():
            errors.append(f"{show_id}: missing cover asset {cover}")

    if errors:
        print("Website validation failed:", *errors, sep="\n- ", file=sys.stderr)
        return 1

    print(f"Validated {len(shows)} published shows and their cover assets.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
