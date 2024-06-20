# Use the official Rust image as a parent image
FROM rust:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Copy the source code
COPY src ./src

# Copy the wait-for-it.sh script
COPY wait-for-it.sh ./

# Ensure wait-for-it.sh is executable
RUN chmod +x wait-for-it.sh

# Build the application
RUN cargo build --release

# Run the application with wait-for-it
CMD ["./wait-for-it.sh", "db:5432", "--", "./target/release/bitcoin_ingestion"]
