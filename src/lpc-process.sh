#!/bin/bash
set -xue
echo "parameters are:" "$@"

which xword-dl
which cursewords

xword-dl -v
cursewords --version

function main() {
    # these are the puzzles we can download by date. (see https://github.com/thisisparker/xword-dl/blob/main/README.md)
    local puz_codes_date="atl club db pop std tgam grdc grde grdp grdq grdu grds grdw lat mck nyt nytm tny nd pzm sdp sdpc sdpq uni usa vox wp"

    # we don't have logic in place yet, here, to recognize "latest" as a pseudo-date and switch to --latest for xword-dl
    local puz_codes_latest="uni atl club db pop std tgam grdc grde grdp grdq grdu grds lat tny nd pzm sdp sdpc sdpq usa vox wp"

    local puz_codes="${1:-uni}" # list of puzzles to fetch, separated by spaces (e.g. "uni nyt")
    local puz_dates="${2:-$(date +%Y-%m-%d)}" # list of dates to fetch, separated by spaces (e.g. "2025-02-14 2025-02-15 2025-02-16")

    local puz_dir="/data-live"

    if [[ -z "$puz_dates" ]]; then
        puz_dates="$(date +%Y-%m-%d)"
    fi

    local js_main_temp="/data-live/main-temp.js"
    {
        echo "<script>"
        echo "  main()"
        echo "</script>"
    } > "$js_main_temp"

    local html_template="/src-live/template.html"
    local all_puzzles_html="$puz_dir/all-puzzles-$(date +%Y-%m-%d--%H%M).html"
    cp "$html_template" "$all_puzzles_html" # initialize (we will append more later) (replace if it exists)
    
    local puz_count=0
    local puz_date puz_code
    for puz_date in $puz_dates; do
        for puz_code in $puz_codes; do
            local puz_prefix="$puz_code-$puz_date"
            local puz_file="$puz_dir/$puz_prefix.puz"
            local json_file="$puz_dir/$puz_prefix.json"

            convert_puz_to_json "$puz_date" "$puz_code" "$puz_file" "$json_file" || { echo "conversion failed with code $?"; return 2; }

            local js_file_temp="$puz_dir/$puz_prefix-temp.js"

            {
                echo "<script>"
                echo "  puz = $(cat $json_file)"
                echo "  puzList.push(puz)"
                echo "</script>"
            } >> "$js_file_temp"

            local one_puzzle_html="$puz_dir/$puz_prefix.html"
            cat "$html_template" "$js_file_temp" "$js_main_temp" > "$one_puzzle_html" # NB: replace

            cat "$js_file_temp" >> "$all_puzzles_html" # NB: append

            rm "$js_file_temp"
            puz_count=$((puz_count + 1))
        done
    done
    if [ "$puz_count" -le 1 ]; then
        rm "$all_puzzles_html"
    else
        cat "$js_main_temp" >> "$all_puzzles_html"
    fi
    rm "$js_main_temp"
}

function convert_puz_to_json {
    local puz_date="${1}"
    local puz_code="$2"
    local puz_file="$3"
    local json_file="$4"

    if [ -f "$puz_file" ]; then
        echo "removing $puz_file"
        rm "$puz_file"
    fi
    if [ -f "$json_file" ]; then
        echo "removing $json_file"
        rm "$json_file"
    fi

    auth=""
    if [[ $puz_code == "nyt" || $puz_code == "nytm" ]]; then
        if [[ -z "${NYT_USER:-}" ]] || [[ -z "${NYT_PASS:-}" ]]; then
            echo "NYT_USER and NYT_PASS must be set and non-empty"
            return 1
        fi
        auth="--username $NYT_USER --password $NYT_PASS"
    fi

    xword-dl "$puz_code" $auth -d "$puz_date" -o "$puz_file" --preserve-html \
        && echo "downloaded $puz_code to $puz_file" \
        || { echo "failed to download $puz_code to $puz_file"; }
    cursewords --print "$puz_file"
    cursewords --html "$puz_file" > "$json_file"
}

main "$@" && echo "success" || { echo "main failed with exit code $?"; exit 3; }

# for debugging
# bash # stick around in the container
