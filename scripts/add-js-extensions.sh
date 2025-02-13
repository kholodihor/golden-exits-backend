#!/bin/bash

# Process each JavaScript file
find dist -name "*.js" -type f | while read -r file; do
  # First remove any .js extensions from imports
  sed -i -E 's/from "([^"]+)\.js"/from "\1"/g' "$file"
  sed -i -E "s/from '([^']+)\.js'/from '\1'/g" "$file"

  # Then add .js extension to relative imports
  sed -i -E 's/from "(\.\.\/[^"]+)"/from "\1.js"/g' "$file"
  sed -i -E 's/from "(\.\/[^"]+)"/from "\1.js"/g' "$file"
  sed -i -E "s/from '(\.\.\/[^']+)'/from '\1.js'/g" "$file"
  sed -i -E "s/from '(\.\/[^']+)'/from '\1.js'/g" "$file"
done
