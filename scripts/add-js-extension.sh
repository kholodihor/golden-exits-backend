#!/bin/bash

# First, revert any extensions
find src api -name "*.ts" -type f | while read -r file; do
  sed -i 's/\.js"/.ts"/g' "$file"
  sed -i "s/\.js'/.ts'/g" "$file"
done

# Then add .js extension to imports that don't have it
find src api -name "*.ts" -type f | while read -r file; do
  # Replace .ts with .js in imports
  sed -i 's/\.ts"/.js"/g' "$file"
  sed -i "s/\.ts'/.js'/g" "$file"
  
  # Add .js to imports without extensions
  sed -i 's/from "\([\.\/]\+[^"]*\)\([^."]*\)"/from "\1\2.js"/g' "$file"
  sed -i "s/from '\([\.\/]\+[^']*\)\([^.']*\)'/from '\1\2.js'/g" "$file"
done
