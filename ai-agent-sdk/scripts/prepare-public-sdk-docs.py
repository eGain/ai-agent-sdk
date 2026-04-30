#!/usr/bin/env python3
"""
Rewrite private SDK identifiers to public ones for docs synced to eGain/ai-agent-sdk.

Modes:
  (default)  Rewrite package metadata, docs-src, and src before `npm run docs`.
  --sanitize-built <dir>  After VitePress build, rewrite text assets under <dir>
            (needed because TypeDoc regenerates api-generated and restores private git URLs).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# VitePress output: HTML, JS chunks (incl. local search), JSON, etc.
_BUILT_TEXT_SUFFIXES = frozenset(
    {
        ".html",
        ".js",
        ".mjs",
        ".cjs",
        ".json",
        ".css",
        ".map",
        ".txt",
        ".xml",
        ".svg",
        ".md",
    }
)


def replacements_from_env() -> list[tuple[str, str]]:
    private_package = os.environ.get("PRIVATE_SDK_PACKAGE", "@eGainDev/ai-agent-sdk")
    public_package = os.environ.get("PUBLIC_SDK_PACKAGE", "@eGain/ai-agent-sdk")
    private_scope = os.environ.get("PRIVATE_SDK_SCOPE", "@eGainDev")
    public_scope = os.environ.get("PUBLIC_SDK_SCOPE", "@eGain")
    private_repo = os.environ.get("PRIVATE_SDK_REPO", "https://github.com/eGainDev/ai-agent")
    public_repo = os.environ.get("PUBLIC_SDK_REPO", "https://github.com/eGain/ai-agent-sdk")

    # Longest keys first so repo URL matches before any shorter accidental overlap.
    return [
        (private_package, public_package),
        (private_repo + ".git", public_repo + ".git"),
        (private_repo, public_repo),
        (private_scope, public_scope),
    ]


def apply_to_files(paths: list[Path], replacements: list[tuple[str, str]]) -> int:
    seen: set[Path] = set()
    changed = 0
    for file in paths:
        if not file.is_file() or file in seen:
            continue
        seen.add(file)
        try:
            text = file.read_text(encoding="utf-8")
        except OSError as e:
            print(f"skip read {file}: {e}", file=sys.stderr)
            continue
        updated = text
        for old, new in replacements:
            if old != new:
                updated = updated.replace(old, new)
        if updated != text:
            file.write_text(updated, encoding="utf-8")
            changed += 1
    return changed


def sanitize_built_dir(root: Path, replacements: list[tuple[str, str]]) -> int:
    if not root.is_dir():
        print(f"sanitize-built: missing directory {root}", file=sys.stderr)
        return 0
    changed = 0
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in _BUILT_TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as e:
            print(f"skip read {path}: {e}", file=sys.stderr)
            continue
        updated = text
        for old, new in replacements:
            if old != new:
                updated = updated.replace(old, new)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    return changed


def prepare_sources(replacements: list[tuple[str, str]]) -> int:
    explicit = [
        ROOT / "package.json",
        ROOT / "package-lock.json",
        ROOT / "typedoc.json",
        ROOT / "README.md",
        ROOT / "docs-src" / ".vitepress" / "config.ts",
    ]

    paths: list[Path] = []
    for p in explicit:
        if p.is_file():
            paths.append(p)

    docs_src = ROOT / "docs-src"
    if docs_src.is_dir():
        for pattern in ("*.md", "*.json", "*.ts"):
            paths.extend(docs_src.rglob(pattern))

    # TypeDoc embeds JSDoc from source; rewrite only in CI workspace so API pages stay public.
    src_dir = ROOT / "src"
    if src_dir.is_dir():
        paths.extend(src_dir.rglob("*.ts"))

    changed = apply_to_files(paths, replacements)
    print(f"prepare-public-sdk-docs: updated {changed} file(s)")
    return 0


def main() -> int:
    replacements = replacements_from_env()

    if len(sys.argv) >= 3 and sys.argv[1] == "--sanitize-built":
        out = Path(sys.argv[2])
        n = sanitize_built_dir(out, replacements)
        print(f"prepare-public-sdk-docs --sanitize-built: updated {n} file(s) under {out}")
        return 0

    return prepare_sources(replacements)


if __name__ == "__main__":
    raise SystemExit(main())
