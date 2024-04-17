#!/bin/bash

# Define the YAML file
yaml_file="$1"
yaml_temp="$yaml_file.tmp"
cp "$yaml_file" "$yaml_temp"
# Replace kubebench variables with actual values
sed -i 's/\$apiserverconf/\/etc\/kubernetes\/manifests\/kube-apiserver.yaml/g' "$yaml_temp"
sed -i 's/\$schedulerconf/\/etc\/kubernetes\/manifests\/kube-scheduler.yaml/g' "$yaml_temp"
sed -i 's/\$controllermanagerconf/\/etc\/kubernetes\/manifests\/kube-controller-manager.yaml/g' "$yaml_temp"
sed -i 's/\$controllermanagerkubeconfig/\/var\/lib\/rancher\/k3s\/server\/cred\/controller.kubeconfig/g' "$yaml_temp"
sed -i 's/\$apiserverbin/containerd/g' "$yaml_temp"
sed -i 's/\$etcdbin/containerd/g' "$yaml_temp"
sed -i 's/\$kubeletbin/containerd/g' "$yaml_temp"
sed -i 's/\$controllermanagerbin/containerd/g' "$yaml_temp"

# Read all checks entries, ignore high-level groups
yq e '.groups[].checks | flatten' -o=json "$yaml_temp" | jq -c '.[]' | while read -r check; do
    # Extract fields from each check
    id=$(echo "$check" | jq -r '.id')
    text=$(echo "$check" | jq -r '.text')
    type=$(echo "$check" | jq -r '.type')
    audit=$(echo "$check" | jq -r '.audit')
    scored=$(echo "$check" | jq -r '.scored')
    remediation=$(echo "$check" | jq -r '.remediation')

    # Print the ID as a Markdown header
    echo "### $id $text"
    echo

     # Encase lines starting with "chown" in backticks
    remediation=$(echo "$remediation" | sed '/^\s*\(chmod\|chown\)/s/.*/`&`/')

    # Check if remediation is "Not Applicable."
    if [[ "$remediation" == *"Not Applicable."* ]]; then
        # Remove "Not Applicable." from the remediation text
        remediation=$(echo "$remediation" | sed '/Not Applicable./d')
        
        echo "**Result:** Not Applicable"
        echo
    fi

    # if scored is true and type doesn't exist, print "Result: Passed"
    if [ "$scored" == "true" ] && [ "$type" == "null" ]; then
        test=$(echo "$check" | jq -r '.tests.test_items')
        
        echo "**Result:** Passed"
        echo
        echo "**Audit:**"
        echo "\`\`\`bash"
        echo "$audit"
        echo "\`\`\`"
        echo

        # Only print info on simple tests
        if [ $(echo "$test" | jq -r 'length') -eq 1 ]; then
            #if flag is permissions, print the permissions
            flag=$(echo "$test" | jq -r '.[0].flag')
            if [ "$flag" == "permissions" ]; then
                expected=$(echo "$test" | jq -r '.[0].compare.value')
                echo "**Expected:** file permissions are \`$expected\`"
                echo
            elif [ "$flag" == "root:root" ]; then
                echo "**Expected:** file owners are \`root:root\`"
                echo
            elif [ "$(echo "$test" | jq -r '.[0].compare')" != "null" ]; then
                op=$(echo "$test" | jq -r '.[0].compare.op')
                value=$(echo "$test" | jq -r '.[0].compare.value')
                case $op in 
                    eq) op="equals" ;;
                    nothave) op="does not have" ;;
                    gte) op="greater than" ;;
                    null) op="" ;;
                esac
                case $value in 
                    null) value="" ;;
                esac
                echo "**Expected:** $flag $op $value"
            elif [ "$(echo "$test" | jq -r '.[0].set')" != "null" ]; then
                set=$(echo "$test" | jq -r '.[0].set')
                if [ "$set" == "true" ]; then
                    echo "**Expected:** $flag is set"
                elif [ "$set" == "false" ]; then
                    echo "**Expected:** $flag is not set"
                fi
            fi
            echo
        fi
    fi

    # Print remediation if not empty
    if [ -n "$remediation" ]; then
        echo "**Remediation:**"
        echo "$remediation"
        echo
    fi
done

rm "$yaml_temp"