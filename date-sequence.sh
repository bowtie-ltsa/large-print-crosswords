#!/bin/bash
# this script emits a sequence of dates, given a starting date and a number of days wanted
start_date="${1:-$(date +%Y-%m-%d)}" # default to today
num_days=${2:-1} # default to 1 day
for i in $(seq 0 $((num_days-1))); do
    date -d "$start_date + $i days" +"%Y-%m-%d"
done
