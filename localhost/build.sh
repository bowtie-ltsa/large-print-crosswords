#!/bin/bash
set -xue
docker build . -f dockerfile -t lpc-server:latest
docker run --rm --name lpchost -p 3000:3000 -v "/$PWD/../src:/src-live" lpc-server:latest
