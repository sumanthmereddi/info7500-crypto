Project : Bitcoin Explorer
Course : INFO 7500
Collaborators : Sumanth Mereddi, Kshama Aditi Lethakula

Step 2: Ingestion Program in Rust

2.1 Install Rust

To install Rust, use the rustup installer:

macOS:

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Windows:

Download and run the installer from Rust's official website.

2.2 Create a New Rust Project

1) Create a new Rust project:

cargo new bitcoin_ingestion
cd bitcoin_ingestion

2) Add dependencies to your Cargo.toml file:

[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
tokio-postgres = "0.7"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

2.3 Write the Ingestion Code

1) Open src/main.rs and add the following code:

use reqwest;

use serde_json::Value;

use tokio::time::{sleep, Duration};

use tokio_postgres::NoTls;
 
#[tokio::main]

async fn main() -> Result<(), Box<dyn std::error::Error>> {

    // Database connection

    let (client, connection) =

        tokio_postgres::connect("host=db user=bit password=bit dbname=bitcoin_explorer", NoTls).await?;
 
    // The connection object performs the actual communication with the database, so spawn it off to run on its own.

    tokio::spawn(async move {

        if let Err(e) = connection.await {

            eprintln!("connection error: {}", e);

        }

    });
 
    loop {

        // Ingest data from the Bitcoin client

        let resp = reqwest::get("https://blockchain.info/latestblock").await?;

        let json: Value = resp.json().await?;
 
        // Extract block height

        let block_height = json["height"].as_i64().unwrap();
 
        // Insert block height into the database

        client.execute(

            "INSERT INTO blocks (block_height) VALUES ($1)",

            &[&block_height],

        ).await?;
 
        // Wait for 60 seconds before the next iteration

        sleep(Duration::from_secs(60)).await;

    }

}


2) Save and close main.rs.

2.4 Run the Ingestion Program

Build and run the program:

cargo run

Step 3: Verify Data Ingestion

1) Connect to the PostgreSQL database:

psql -U user -d bitcoin_explorer -h localhost -W


2) Verify the data in the blocks table:

SELECT * FROM blocks;


Step 4: Dockerizing the Application

1) Create a Dockerfile with the following content:

# Use the official Rust image as a parent image
FROM rust:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Copy the source code
COPY src ./src

# Build the application
RUN cargo build --release

# Run the application
CMD ["cargo", "run", "--release"]

2) Build the Docker image:

docker build -t bitcoin_ingestion .

3) Run the Docker container:

docker run -d bitcoin_ingestion

