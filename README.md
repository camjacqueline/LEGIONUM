# LEGIONUM

# Calculateur d'UFC

Simple web-based calculator for UFC (Unités Formant Colonies) used in the interpretation of Legionella culture results.

This tool implements decision logic commonly applied in laboratory practice, including:
- Direct concentration
- Filtration on 10 ml and 100 ml
- Handling of interfering flora (*envahie flore*)
- Determination of warning scenarios
- Guidance on colonies requiring confirmation

## Installation

No installation required.
Open index.html in a modern web browser.

## Technologies 
- HTML5
- JavaScript (Vanilla)
- Bootstrap 4

This project is intentionally lightweight:
- No backend
- No build system
- No external dependencies beyond Bootstrap
- Logic implemented directly in JavaScript

The objective is to provide a **transparent and readable implementation** of UFC interpretation rules that can be:
- Reviewed
- Discussed
- Adapted to local laboratory practices

The code prioritizes explicit decision branches over abstraction.

## File Structure

- index.html – UI and layout
- UFC_V2.2.js – calculation logic
- style.css – optional custom styling

## Usage

Laboratory or training use for microbiological colony counting.
Not intended for clinical decision-making without validation.

1. Open index.html in a modern web browser.
2. Enter colony counts by type (A–E).
3. Use the Envahie flore checkboxes to disable affected methods.
4. Select one of the calculation modes:
  - Colonies per type
  - Total colonies
  - Colonies to confirm

Results are displayed directly below the buttons.

## Important notes

This tool does not perform input validation beyond numeric coercion.
Disabled inputs are internally treated as analytically unavailable.
Warning messages reflect improbable or borderline scenarios and are intended to prompt expert review.
Numerical outputs are rounded using scientific notation logic implemented in the code.

## Limitations

This tool is not a diagnostic system.
Results must be interpreted by qualified personnel.
The logic reflects one possible implementation of laboratory rules and may not cover all edge cases or national guidelines.


```bash
git clone https://github.com/camjacqueline/ufc-calculator.git
cd ufc-calculator
