FROM ubuntu:24.04 AS builder

# note: if `docker build` fails with "set: Illegal option -" (or similar weird errors) it probably just means
# that this file contains CRLF endings; run dos2unix on it.

ENV TZ=America/Los_Angeles
ARG DEBIAN_FRONTEND=noninteractive
RUN <<EOF
    set -xue
    apt-get update -y
    apt-get upgrade -y
    apt-get install -y --no-install-recommends python3-full less curl xxd
    which python3
    python3 --version
    python3 -m venv /venv
EOF

ENV PATH=/venv/bin:$PATH
RUN <<EOF
    set -xue
    which python3
    python3 --version

    which pip
    pip --version

    /venv/bin/pip install xword-dl
    which xword-dl
    xword-dl -v
EOF

COPY ./src/ /src-frozen

FROM builder
ENV PATH=/venv/bin:$PATH
RUN <<EOF
    set -xue
    which python3
    python3 --version

    which pip
    pip --version

    cd /src-frozen
    cd cursewords-modified-for-lpc
    pip install .
EOF
