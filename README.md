# Kafka Web Manager

Web interface to manage Kafka Connect configurations

Connector configurations get persisted to a local database with unique ids to preserve history, bust cache, and return appropriate connector status regardless of kafka's state

## Project setup and Contribution

#### Start MongoDB

    docker-compose -f mongo/docker-compose.yml up -d

#### Start API

    docker-compose -f api/docker-compose.yml up -d

#### Install NPM Dependencies from web/

    npm install

#### Start Website from web/

    npm run serve
