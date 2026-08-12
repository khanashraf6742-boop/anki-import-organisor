# Anki Import Organisor (Lossless TXT → Anki)

This tool converts a `.txt` file into a **strict Anki import file** without changing any content.

## Your supported format (configured)
- **New card starts when** a line starts with `🏥` **OR** a line ends with `?`
- **Back starts at** the first line that contains `✅ Answer:`
- **Front** = everything before `✅ Answer:`
- **Back** = from `✅ Answer:` until the next card start
- **Lossless**: no trimming, no formatting changes, all characters preserved

## Run
Just open `index.html` in a browser.

## Import to Anki
1. In Anki: **File → Import**
2. Select the downloaded `anki_import.txt`
3. The header defines separator + columns automatically
4. Import

## Notes on escaping
- Fields containing newlines or quotes are wrapped in quotes
- `"` inside fields becomes `""` (CSV-style escaping Anki accepts)

## Claude Code agent library

This repo also bundles a small library of Claude Code subagents, organized by category:

- `engineering/` — Frontend Developer, Backend Developer, DevOps Engineer, Mobile Developer, QA Engineer, Security Engineer
- `product/` — Product Manager, UX Researcher
- `design/` — UI Designer
- `marketing/` — Content Strategist, SEO Specialist
- `data/` — Data Scientist, Data Engineer

### Install all agents to your Claude Code directory

```
./scripts/install.sh --tool claude-code
```

### Install a single category

```
./scripts/install.sh --tool claude-code --category engineering
```

Or copy it manually:

```
cp engineering/*.md ~/.claude/agents/
```

### Use an agent

Once installed, activate any agent by name in a Claude Code session:

```
Hey Claude, activate Frontend Developer mode and help me build a React component
```  
