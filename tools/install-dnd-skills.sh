#!/usr/bin/env bash
# install-dnd-skills.sh
# Downloads the shortlisted Claude skills for the D&D Codex project.
# Usage:
#   bash install-dnd-skills.sh                  # installs to ~/.claude/skills (all projects)
#   bash install-dnd-skills.sh .claude/skills   # installs to the current project only
# Requires git 2.25 or newer. On Windows, run it in Git Bash or WSL.

set -euo pipefail

DEST="${1:-$HOME/.claude/skills}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$DEST"

# fetch <owner/repo> <path in repo> <skill folder name>
# Uses a shallow, sparse clone so only the needed folder is downloaded.
fetch() {
  local repo="$1" src="$2" name="$3"
  local dir="$TMP/${repo//\//_}"

  if [ ! -d "$dir" ]; then
    git clone --quiet --depth 1 --filter=blob:none --no-checkout \
      "https://github.com/$repo.git" "$dir"
    git -C "$dir" sparse-checkout set --no-cone "/$src" >/dev/null 2>&1
    git -C "$dir" checkout --quiet
  else
    git -C "$dir" sparse-checkout set --no-cone "/$src" >/dev/null 2>&1
  fi

  if [ -e "$dir/$src" ]; then
    rm -rf "${DEST:?}/$name"
    mkdir -p "$DEST/$name"
    if [ -d "$dir/$src" ]; then
      cp -r "$dir/$src/." "$DEST/$name/"
    else
      cp "$dir/$src" "$DEST/$name/SKILL.md"
    fi
    echo "  ok    $name"
  else
    echo "  MISS  $name  ($repo/$src not found, the repo may have moved it)"
    return 1
  fi
}

echo "Installing to: $DEST"

echo "Rules reference (SRD 5.2)"
# d20-rules expects the SRD 5.2 markdown in references/srd. In its home repo
# that folder is a symlink into a git submodule, so it is filled in here.
if fetch rjroy/adventure-engine-corvran plugins/d20-system/skills/d20-rules d20-rules; then
  rm -rf "$DEST/d20-rules/references/srd"
  mkdir -p "$DEST/d20-rules/references/srd"
  git clone --quiet --depth 1 https://github.com/springbov/dndsrd5.2_markdown.git "$TMP/srd52"
  cp -r "$TMP/srd52/src/." "$DEST/d20-rules/references/srd/"
  cp "$TMP/srd52/License.md" "$DEST/d20-rules/references/srd/License.md"
  echo "  ok    d20-rules SRD 5.2 reference files"
fi

echo "Dice (RANDSUM)"
fetch RANDSUM/randsum plugins/randsum/skills/dice-rolling       dice-rolling
fetch RANDSUM/randsum plugins/randsum/skills/dice-probability   dice-probability
fetch RANDSUM/randsum plugins/randsum/skills/game-spec-creator  game-spec-creator
fetch RANDSUM/randsum plugins/randsum/skills/randsum-library    randsum-library

echo "Character tool reference (2014 PHB based, reference only)"
fetch mattnigh/skills_collection \
  collection/mkelk__flirtyn__claude__skills__dnd-5e-character-manager__SKILL.md \
  dnd-5e-character-manager

echo "App-building workflow"
fetch anthropics/skills skills/webapp-testing           webapp-testing
fetch obra/superpowers  skills/test-driven-development  test-driven-development

echo "Audio and battle map (owner, 2026-11-19: skills for the audio and map tools)"
fetch PlayableIntelligence/game-creator          skills/game-audio                    game-audio       # Web Audio patterns: master gain, unlock, scheduling
fetch liammday/game-making-skills                skills/canvas-2d                     canvas-2d        # sharp, fast canvas drawing; layers and offscreen caches
fetch gamedev-skills/awesome-gamedev-agent-skills skills/disciplines/procedural-gen   procedural-gen   # seeded dungeon layouts, caves, connectivity checks

echo
echo "Done. Read each SKILL.md (and any scripts) in $DEST before using them."
echo "Restart Claude Code so it picks up the new skills."
