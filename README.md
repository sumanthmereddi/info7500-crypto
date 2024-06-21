# INFO 7500 Bitcoin Explorer Project

This project is a Bitcoin Explorer application that displays the latest block data from a Bitcoin node. The application is composed of a frontend, backend, database, and a Rust-based ingestion service. The services are containerized using Docker.

## Project Structure

- **bitcoin-explorer**: The frontend React application.
- **backend**: The Node.js backend service.
- **bitcoin_ingestion**: The Rust-based service for data ingestion.
- **docker-compose.yml**: The Docker Compose file to orchestrate the services.

## Setup Instructions

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/bitcoin-explorer.git
    cd bitcoin-explorer
    ```

2. **Run Docker Compose**:
    ```bash
    docker-compose up --build
    ```

3. **Access the application**:
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:5000`

## Services Overview

### Frontend (bitcoin-explorer)

The frontend is a React application that provides a user interface to display the latest block data from the Bitcoin network.

### Backend (backend)

The backend is a Node.js service that serves as an API for the frontend, handling requests and interfacing with the database and ingestion service.

### Data Ingestion (bitcoin_ingestion)

This is a Rust-based service responsible for ingesting and processing block data from the Bitcoin network, then storing it in the database.

### Docker Compose

The `docker-compose.yml` file orchestrates the different services, ensuring they are properly configured and can communicate with each other.

## Collaborators

- **Sumanth Mereddi**
- **Kshama Aditi Lethakula**



