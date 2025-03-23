#!/bin/bash
set -xue

NYT_USER=${NYT_USER:-${1:-}}
NYT_PASS=${NYT_PASS:-${2:-}}

image_name="large-print-crosswords"
image_tag="latest"

echo "building..."
docker build . -f dockerfile -t "$image_name:$image_tag"

echo ""
echo "running..."
args=$(printf "'%s' " "$@")
docker run --rm --name lpc \
    -v "/$PWD/src":/src-live \
    -v "/$PWD/data":/data-live \
    -e NYT_USER=$NYT_USER \
    -e NYT_PASS=$NYT_PASS \
    "$image_name:$image_tag" \
    //bin/bash -c "\/src-live/lpc-process.sh $args"

echo ""
echo "run completed successfully."
echo "check the data directory for the output."
