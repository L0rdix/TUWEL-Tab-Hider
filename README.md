# TUWEL-Tab-Hider

A Violentmonkey userscript for TU Wien's TUWEL that lets you hide/show course sections (tabs) per course, with persistent storage and one-click controls. Perfect for focusing on relevant materials during your studies at TU Wien.

## Features
- Hide individual sections with a single click
- Global "Show All" button to reset visibility
- Automatic saving/loading of hidden tabs per course ID
- Removes distracting "Alles aufklappen" buttons

## Installation
1. Install [Violentmonkey](https://violentmonkey.github.io/) browser extension
2. Click the Violentmonkey icon → "Create a new script"
3. Replace contents with code from `main.js`
4. Save (Ctrl+S) - auto-installs on TUWEL course pages

## Usage
- 🕶️ button on section header = hide tab
- 👁️ global button next to course title = show everything
- Hidden state persists across sessions for each course

## Compatibility
- TU Wien TUWEL (`tuwel.tuwien.ac.at/course/view.php*`)
- Violentmonkey/Tampermonkey (GM APIs)
- Tested March 2026

Fork, improve, or contribute! Made by Amir Salman for TU Wien students.
