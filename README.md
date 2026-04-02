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
