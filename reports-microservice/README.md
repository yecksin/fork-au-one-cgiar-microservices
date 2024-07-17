# Reports Microservice

## Description

This microservice is designed to generate reports for all CGIAR platforms. It provides a centralized solution for report generation, allowing various applications within the CGIAR ecosystem to utilize its capabilities.

## Features

- PDF generation
- RabbitMQ integration for asynchronous processing
- RESTful API endpoints
- Swagger documentation
- CORS enabled
- JWT authentication middleware

## Technologies

- NestJS
- RabbitMQ
- Swagger
- Express

## Prerequisites

- Node.js
- npm or yarn
- RabbitMQ server

## Installation

1. Clone the repository:

   ```
   git clone [repository-url]
   cd reports-microservice
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
    PORT=3000
    RABBITMQ_URL=''
    CLARISA_HOST=''
    CLARISA_MIS=''
    CLARISA_MIS_ENV=''
    CLARISA_LOGIN=''
    CLARISA_PASSWORD=''
    IS_PRODUCTION=boolean
    SEE_ALL_LOGS=boolean
    QUEUE_NAME=''
   ```

## Running the application

### Development mode

```
npm run start:dev
```

### Production mode

```
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## Endpoints

### Generate PDF (HTTP)

- **POST** `/generate`
- Generates a PDF report based on the provided data
- Requires authentication

### Subscribe Application

- **POST** `/subscribe-application`
- Subscribes a new application to use the report generation service

## RabbitMQ Integration

This microservice also listens to RabbitMQ messages for asynchronous report generation:

- **Queue**: `{QUEUE_NAME}reports_queue`
- **Message Pattern**: `generate`

## Authentication

JWT authentication is required for the `/api/reports/pdf/generate` endpoint. Ensure you include a valid JWT token in the Authorization header of your requests.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the [LICENSE NAME] - see the [LICENSE.md](LICENSE.md) file for details.
