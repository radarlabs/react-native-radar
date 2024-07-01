#!/bin/bash

source_dir="./src/ui"  
target_dir="./dist/ui"

for file in "$source_dir"/*.png
do
  cp "$file" "$target_dir"
done