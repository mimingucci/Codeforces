# Use Ubuntu 24.04 as the base image
FROM ubuntu:24.04 AS builder

ARG TARGETARCH
ARG TARGETVARIANT

WORKDIR /app

# Set environment variables to prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    apt-get install -y libtool make cmake libseccomp-dev gcc python3 python3-venv

# Copy the FastAPI app files into the container
COPY . /app/

# Build the project
RUN bash -c "set -ex && \
    mkdir /app/build && \
    cmake -S . -B build && \
    cmake --build build --parallel $(nproc)"

# Build Python bindings
RUN bash -c "set -ex && \
    cd bindings/Python && \
    python3 -m venv .venv && \
    .venv/bin/pip install build && \
    .venv/bin/python3 -m build -w"

# Final stage
FROM ubuntu:24.04

ARG TARGETARCH
ARG TARGETVARIANT

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Install all dependencies in one RUN statement
RUN apt-get update && \
    apt-get install -y ca-certificates software-properties-common gnupg wget file libseccomp-dev && \
    # Add deadsnakes PPA for Python 3.12
    add-apt-repository ppa:deadsnakes/ppa && \
    # Add NodeSource repository for Node.js 20
    wget -qO- https://deb.nodesource.com/setup_20.x | bash - && \
    # Install Go 1.22
    wget -q https://go.dev/dl/go1.22.0.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz && \
    ln -s /usr/local/go/bin/go /usr/bin/go && \
    # Install all packages
    apt-get update && \
    apt-get install -y \
        python3.12 \
        python3.12-venv \
        python3.12-dev \
        openjdk-21-jdk \
        gcc-13 \
        g++-13 \
        nodejs \
        php8.3 \
        strace \
        lsof \
        procps && \
    # Set up alternatives for Python
    update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-13 13 && \
    update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-13 13 && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1 && \
    # Clean up
    rm -f go1.22.0.linux-amd64.tar.gz && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /usr/lib/judger /app/bindings/Python/api /judger /submission

# Copy built files from the builder stage with correct permissions
COPY --from=builder --chmod=755 /app/output/libjudger.so /usr/lib/judger/libjudger.so
COPY --from=builder /app/bindings/ /app/bindings/
COPY --from=builder /app/bindings/Python/dist/ /app/

# Ensure proper permissions on the judger library and directories
RUN chmod 755 /usr/lib/judger/libjudger.so && \
    chmod -R 755 /app/bindings && \
    chmod -R 777 /judger && \
    chmod -R 777 /submission

# Install Python dependencies
RUN python3 -m venv .venv && \
    .venv/bin/pip install --no-cache-dir fastapi uvicorn pydantic idna psutil requests && \
    .venv/bin/pip install *.whl && \
    # Create empty __init__.py files
    touch /app/bindings/__init__.py && \
    touch /app/bindings/Python/__init__.py && \
    touch /app/bindings/Python/api/__init__.py

RUN <<EOS
    set -ex
    useradd -u 901 -r -s /sbin/nologin -M compiler
    useradd -u 902 -r -s /sbin/nologin -M runner
EOS

# Expose port 8000
EXPOSE 8000

# Command to run FastAPI app with root privileges
CMD [".venv/bin/uvicorn", "bindings.Python.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]