#!/bin/bash

# Add .js extensions to TypeScript imports
find src api -name "*.ts" -type f | while read -r file; do
  # Add .js extension to relative imports without an extension
  sed -i -E 's/from "(\.\.?\/[^"]+)"/from "\1.js"/g' "$file"
  sed -i -E "s/from '(\.\.?\/[^']+)'/from '\1.js'/g" "$file"
done
