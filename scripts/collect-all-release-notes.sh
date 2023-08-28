#!/usr/bin/env bash
function gen_md_link()
{
    release_link=$(echo $1 | tr '[:upper:]' '[:lower:]' | sed -e 's/ /-/g' -e 's/\.//g' -e 's/+//g')
    echo "${release_link}"
}

MINORS="v1.24 v1.25 v1.26 v1.27"

for minor in $MINORS; do
    product=k3s
    k3s_table=$(mktemp)
    previous=""
    file=docs/release-notes/${minor}.X.md
    for patch in $(gh release list -R "k3s-io/${product}" --exclude-drafts --exclude-pre-releases --limit=1000 | awk -F '\t' '{ print $3 }' | grep ^"${minor}"); do
        publish_date=$(gh release view "${patch}" -R "k3s-io/${product}" --json publishedAt -q '.publishedAt' | awk -F'T' '{ print $1 }')
        echo "# Release ${patch}" >> "${file}"
        gh release view "${patch}" -R "k3s-io/${product}" --json body -q '.body' >> "${file}"
        echo "-----" >> "${file}"
        body=$(gh release view "${patch}" -R "k3s-io/${product}" --json body -q '.body')
        # Extract from each release notes the component table, building a single table with all the components
        if [ -z "${previous}" ]; then
            title="---\nhide_table_of_contents: true\n---\n\n# ${minor}.X\n"
            echo -e "${title}" >> $k3s_table
            upgrade_link="[Urgent Upgrade Notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-${minor:1}.md#urgent-upgrade-notes)"
            upgrade_warning=":::caution Upgrade Notice\nBefore upgrading from earlier releases, be sure to read the Kubernetes ${upgrade_link}.\n:::\n"
            echo -e "${upgrade_warning}" >> $k3s_table
            echo -n "| Version | Release date " >> $k3s_table
            echo "$body"  | grep "^|" | tail -n+3 | awk -F'|' '{ print $2 }' | while read column; do echo -n "| $column " >> $k3s_table; done
            echo " |" >> $k3s_table
            echo -n "| ----- | ----- " >> $k3s_table
            echo "$body"  | grep "^|" | tail -n+3 | awk -F'|' '{ print $2 }' | while read column; do echo -n "| ----- " >> $k3s_table; done
            echo " |" >> $k3s_table
        fi
        echo -n "| [${patch}](${minor}.X.md#release-$(gen_md_link $patch)) | $(date +"%b %d %Y" -d "${publish_date}")" >> $k3s_table
        echo "$body"  | grep "^|" | tail -n+3 | awk -F'|' '{ print $3 }' | while read column; do echo -n "| $column " >> $k3s_table; done
        echo " |" >> $k3s_table
        previous=$patch
        # Remove the component table from each individual release notes
        perl -i -p0e 's/^## Embedded Component Versions.*?^-----/-----/gms' "${file}"
        # Add extra levels for Docusaurus Sidebar
        sed -i 's/^# Release/## Release/' "${file}"
        sed -i 's/^## Changes since/### Changes since/' "${file}"
    done
    echo -e "\n<br />\n" >> $k3s_table
    # Append the global component and version table
    k3stmp=$(mktemp)
    cat $k3s_table "${file}" > $k3stmp && mv $k3stmp "${file}"
    echo "Collected release notes for ${product} ${minor}"
done
