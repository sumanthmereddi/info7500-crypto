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
