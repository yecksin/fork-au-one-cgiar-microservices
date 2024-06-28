# Email Management Microservice

This microservice provides a robust and flexible solution for managing and sending emails, allowing subscribed applications to effectively communicate with their users through personalized messages.

## Key Features

- **Email Sending**: Supports sending personalized emails, including CC and BCC capabilities.
- **Application Subscription**: Applications can subscribe to obtain a `clientId` and `secretKey`, necessary for authentication and service usage.
- **HTML Message Support**: Enables sending emails in HTML format for richer and more personalized presentations.

## Getting Started

### Prerequisites

- Node.js installed on your system.
- Access to an SMTP server or an email service provider.

### Installation

Clone this repository and navigate to the project directory. Run the following command to install all necessary dependencies:

```bash
npm install
```

### Configuration

Configure the necessary environment variables for the microservice to operate, including email server credentials and specific environment variables (e.g., `EMAIL_ROOT`, etc.).

Running
To start the microservice, execute:

```bash
npm run start:dev
```

### Usage

#### Sending Emails

To send an email, use the sendMail method provided by the service, specifying the recipients, subject, and body of the message.

#### Subscribing Applications

To subscribe a new application and obtain a clientId and secretKey, use the subscribeApplication method. These credentials will allow the application to authenticate and use the provided services.

#### Development

This microservice is developed in TypeScript, using Node.js. Standard TypeScript development practices are recommended for contributing to the project.

#### Security

Credentials (`clientId` and `secretKey`) should be treated as sensitive information. Ensure they are securely stored and not publicly exposed.
