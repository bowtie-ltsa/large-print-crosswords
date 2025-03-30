#!/bin/bash
set -xue

if [[ $# -lt 1 ]]; then
    echo "usage: $0 <puzzle> <date> [<nyt_user>] [<nyt_pass>]"
    echo "  puzzle: list of puzzles to fetch, separated by spaces (e.g. \"uni nyt\")"
    echo "  date: list of dates to fetch, separated by spaces (e.g. \"2025-02-14 2025-02-15 2025-02-16\")"
    echo "  nyt_user: New York Times username (optional)"
    echo "  nyt_pass: New York Times password (optional)"
    exit 1
fi
if [[ $# -gt 4 ]]; then
    echo "too many arguments"
    exit 1
fi

# replace NYT_USER and NYT_PASS with the values passed as arguments, if they are present
if [[ -n "${3:-}" ]]; then
    NYT_USER=${3:-}
fi
if [[ -n "${4:-}" ]]; then
    NYT_PASS=${4:-}
fi

image_name="large-print-crosswords"
image_tag="latest"

echo "building..."
docker build . -f dockerfile -t "$image_name:$image_tag"

echo ""
echo "running..."
docker run --rm --name lpc \
    -v "/$PWD/src":/src-live \
    -v "/$PWD/data":/data-live \
    -e "NYT_USER=${NYT_USER:-}" \
    -e "NYT_PASS=${NYT_PASS:-}" \
    "$image_name:$image_tag" \
    //bin/bash -c "\/src-live/lpc-process.sh \"$1\" \"$2\""

echo ""
echo "run completed successfully."
echo "check the data directory for the output."
