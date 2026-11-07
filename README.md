# Gather — Meal Map

**Find a meal, make a plan, and cook with confidence.**

🔗 Live demo: https://deekshith1327.github.io/meal-map/

## Features

- Browse a generated catalog of 100,000 recipe variations across world cuisines
- Filter by vegetarian, non-vegetarian, vegan, accurately tagged high-protein, quick, one-pan, and cuisine choices
- Get pantry-based meal suggestions from the built-in local kitchen assistant
- Save recipes and combine ingredients into a shopping list
- Scale ingredients, check them off, use cooking timers, and follow cook-along steps
- Plant-based recipes use locally stored photos of vegetarian dishes
- Search recognizes common ingredient names, regional variants, and native-script queries—including Malayalam words such as മീൻ, മീൻകറി, ചോറ്, കോഴി, and പരിപ്പ്—alongside common terms in other languages
- Keep saved recipes and cooking progress in browser storage

## Run locally

Requires Node.js 18 or later.

```sh
npm start
```

Then open [http://localhost:3000](http://localhost:3000). The local Node server provides the recipe and pantry endpoints. GitHub Pages runs the front end with browser-local storage and rule-based pantry ideas. The catalog is generated from recipe templates for browsing inspiration; individual recipes may need review before cooking.
