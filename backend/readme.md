Project : Bitcoin Explorer
Course : INFO 7500
Collaborators : Sumanth Mereddi, Kshama Aditi Lethakula

Step 1: Database Setup 

1.1 Install PostgreSQL
To install PostgreSQL on mac machine: we used the following command: 

brew update
brew install postgresql

Windows:
Download the installer from the PostgreSQL website and follow the installation instructions.

1.2 Start PostgreSQL Service

Ensure PostgreSQL service is running:

brew services start postgresql

Windows:
Start the PostgreSQL service from the Services control panel.

1.3 Create Database and User

1) Switch to the postgres user and open the PostgreSQL prompt:

sudo -i -u postgres
psql

2) Create a new database and user:

CREATE DATABASE bitcoin_explorer;
CREATE USER user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE bitcoin_explorer TO user;

3. Exit the PostgreSQL prompt:

\q

1.4 Create Table Schema

1.Connect to the database:

psql -U user -d bitcoin_explorer -h localhost -W

2.Create a table to store block height:

CREATE TABLE blocks (
    id BIGSERIAL PRIMARY KEY,
    block_height INTEGER NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);




