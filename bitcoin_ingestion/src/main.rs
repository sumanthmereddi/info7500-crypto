use tokio;
use reqwest;
use serde_json;
use tokio_postgres::NoTls;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut retries = 5;
    let mut client = None;
    
    while retries > 0 {
        match tokio_postgres::connect("host=db user=user password=bit dbname=bitcoin_explorer", NoTls).await {
            Ok((new_client, connection)) => {
                tokio::spawn(async move {
                    if let Err(e) = connection.await {
                        eprintln!("connection error: {}", e);
                    }
                });
                client = Some(new_client);
                break;
            }
            Err(e) => {
                eprintln!("Failed to connect to the database. Retrying in 5 seconds... Error: {}", e);
                retries -= 1;
                tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
            }
        }
    }

    let client = match client {
        Some(client) => client,
        None => panic!("Failed to connect to the database after multiple attempts."),
    };

    loop {
        // Fetch the latest block height from a blockchain API
        let response = reqwest::get("https://blockchain.info/latestblock")
            .await?
            .json::<serde_json::Value>()
            .await?;
        let block_height = response["height"].as_i64().ok_or("Invalid block height")?;

        // Convert i64 to i32
        let block_height_i32 = block_height as i32;

        // Insert the block height into the database
        client
            .execute("INSERT INTO blocks (block_height) VALUES ($1)", &[&block_height_i32])
            .await?;

        // Wait for 60 seconds before the next iteration
        tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
    }
}
