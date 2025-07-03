#!/bin/bash

# This linter script checks for standardize formatting and syntax in Markdown files.

set -e
error=0

DOCS_DIR="./docs"


for file in $(find "$DOCS_DIR" -type f -name '*.md'); do
    # Skip ADRs
    if [[ "$file" == *"/adrs/"* ]]; then
        continue
    fi
    # Files need a title attribute
    if ! grep -q '^title: ' "$file"; then
        echo "ERROR: Missing title in $file"
        error=1
    fi

    # Title attribute should not be quoted
    if grep -q '^title: *".*"' "$file"; then
        echo "ERROR: Quoted title in $file"
        error=1
    fi

    # Check for spaces around groupId=
    if grep -Eq '<Tabs\s+groupId\s+=' "$file" || grep -Eq '<Tabs\s+groupId[\s+]?=\s+\"' "$file"; then
        echo "ERROR: Space(s) around groupId= in <Tabs> in $file"
        error=1
    fi

    # Check for spaces in groupId value
    if grep -Eo 'groupId=\".*?\"' "$file" | grep -Eq '\s'; then
        echo "ERROR: Space(s) in groupId value in <Tabs> in $file"
        error=1
    fi

    # Check for sidebar_label
    if grep -q '^sidebar_label: ' "$file"; then
        echo "ERROR: sidebar_label found in $file, use label field in sidebar.js instead"
        error=1
    fi

    # Check for blank line at the end of the file
    if [ -n "$(tail -c 1 "$file")" ]; then
        echo "ERROR: Missing blank line at the end of $file"
        error=1
    fi
done

if [ "$error" -ne 0 ]; then
echo "One or more markdown lint checks failed."
exit 1
fi