#!/bin/bash

source_dir="./src/ui"  
target_dir="./dist/ui"

# Copy PNG files
for file in "$source_dir"/*.png
do
  cp "$file" "$target_dir"
done

# Copy JSX files (JavaScript implementations)
for file in "$source_dir"/*.jsx
do
  if [ -f "$file" ]; then
    cp "$file" "$target_dir"
  fi
done