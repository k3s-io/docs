#!/bin/bash

# To generate the expected json report, run the following command:
# kube-bench --benchmark=k3s-cis-1.7 --json > k3s-cis-1.7.json

# Then pass the json file to this script:
# ./kubebench-to-markdown.sh k3s-cis-1.7.json


# Remove 3.X checks, as k3s doesn't do them
clean=$(jq 'del(.Controls[2])' "$1")

# Save section titles in array, match later
sections_raw=$(echo "$clean" | jq -c '.Controls[].tests[]')
declare -A sections
while read -r section; do
    id=$(echo "$section" | jq -r '.section')
    description=$(echo "$section" | jq -r '.desc')
    sections[$id]=$description
done < <(echo "$sections_raw")


# Read all result entries, ignore high-level groups
echo "$clean" | jq -c '.Controls[].tests[].results[]' | while read -r result; do
    
    # Output details in markdown format
    status=$(echo "$result" | jq -r '.status')
    id=$(echo "$result" | jq -r '.test_number')
    title=$(echo "$result" | jq -r '.test_desc')
    audit=$(echo "$result" | jq -r '.audit')
    expected_result=$(echo "$result" | jq -r '.expected_result')
    actual_value=$(echo "$result" | jq -r '.actual_value')
    remediation=$(echo "$result" | jq -r '.remediation')
    # check if section matches the start of id
    section_id_found=""
    for section_id in "${!sections[@]}"; do
        if [[ $id == $section_id* ]]; then
            section_id_found=$section_id
            echo "## $section_id ${sections[$section_id]}"
            echo
        fi
    done
    if [ -n "$section_id_found" ]; then
        unset sections["$section_id_found"]
    fi
    echo "### $id $title"
    echo

    case $status in 
        PASS | FAIL)
            # Remove curly braces from expected result, conflicts with html embedding
            expected_result=${expected_result//\{/}
            expected_result=${expected_result//\}/}
            echo "**Result:** $status"
            echo 
            echo "**Audit:**"
            echo "\`\`\`bash"
            echo "$audit"
            echo "\`\`\`"
            echo
            echo "**Expected Result:** $expected_result"
            echo
            echo "<details>"
            echo "<summary><b>Returned Value:</b></summary>"
            echo
            echo "\`\`\`console"
            echo "$actual_value"
            echo "\`\`\`"
            echo "</details>"
            echo
            ;;
        WARN)
            remediation=${remediation//</&lt;}
            remediation=${remediation//>/&gt;}
            echo "**Result:** $status"
            echo 
            echo "**Remediation:**"
            echo "$remediation"
            echo
            ;;
        INFO)
            remediation=${remediation//</&lt;}
            remediation=${remediation//>/&gt;}
            echo "**Result:** Not Applicable"
            echo 
            echo "**Remediation:**"
            echo "$remediation"
            echo
            ;;
    esac
done