#!/bin/bash

# To generate the expected json report, run the following command:
# kube-bench --benchmark=k3s-cis-1.7 --json > k3s-cis-1.7.json

# Then pass the json file to this script:
# ./kubebench-to-markdown.sh k3s-cis-1.7.json


# Remove 3.X checks, as k3s doesn't do them
clean=$(jq 'del(.Controls[2])' "$1")

# Print section titles, needs to be moved by hand to the right place
sections=$(echo "$clean" | jq -c '.Controls[].tests[]')
echo "$sections" | while read -r section; do
    id=$(echo "$section" | jq -r '.section')
    description=$(echo "$section" | jq -r '.desc')
    echo "## $id $description"
    echo
done

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
    echo "### $id $title"
    echo

    case $status in 
        PASS | FAIL)
            echo "**Result:** $status"
            echo 
            echo "**Audit:**"
            echo "\`\`\`bash"
            echo "$audit"
            echo "\`\`\`"
            echo
            echo "**Expected Result:** $expected_result"
            echo
            echo "<details><summary><b>Returned Value:</b></summary>"
            echo
            echo "\`\`\`console"
            echo "$actual_value"
            echo "\`\`\`"
            echo "</details>"
            echo
            ;;
        WARN)
            echo "**Result:** $status"
            echo 
            echo "**Remediation:**"
            echo "$remediation"
            echo
            ;;
        INFO)
            echo "**Result:** Not Applicable"
            echo 
            echo "**Remediation:**"
            echo "$remediation"
            echo
            ;;
    esac
done