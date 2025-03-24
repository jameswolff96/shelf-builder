# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-03-23
### Changed
- Enhance controls layout and button styles for better usability

---

## [1.0.3] - 2025-03-23
### Changed
- Hide Spot Width Selector when printing
- Update title in head section
- Make editability of Spot Item more obvious in edit mode

### Fixed
- Update state when Aisle, Bin, and Shelf identifiers are changed
- Update state when spot item is changed

---

## [1.0.2] - 2025-03-23
### Fixed
- Issues with state persistence between reloads and app runs

---

## [1.0.1] - 2025-03-23
### Fixed
- Shelf width not resetting when the reset button in the settings modal is pressed

---

## [1.0.0] - 2025-03-23
### Added
- Dynamic creation and deletion of shelves and spots
- Per-spot item text editing and width selection
- Spot size configuration UI with color picker and validation
- Shelf width input (displayed under bin)
- Drag-and-drop spot reordering across shelves
- Auto-updated spot numbering
- Tooltips for spot sizes
- Spot size legend panel with swatches
- Light and dark mode toggle with persistent setting
- Print-friendly layout with color-preserving mode and hidden UI
- JSON import/export support with full state serialization
- LocalStorage auto-save and auto-restore
- Full reset function to restore defaults
- Electron-ready configuration with build script support
- Docker-compatible build pipeline for generating Windows .exe
- Icon support using generated warehouse shelf graphic

### Changed
- Moved CSS and JS into standalone files for modularity
- Enforced uppercase validation for Aisle and Shelf inputs
- Added versioning to JSON export for forward compatibility

### Fixed
- Print layout forcing color output and light theme
- Button and modal color consistency in dark mode
- Insert shelf and file input buttons themed appropriately
- Spot color application on first render

---

