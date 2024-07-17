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

To send an email, utilize the sendMail method provided by the service. This method allows for a flexible email composition, accommodating various elements such as recipients, subject, and body of the message. Additionally, it supports sending an HTML file as the email body, enabling rich text formatting and embedded images. Below is a detailed guide on how to structure your email content using the provided classes.

#### Required Data

- **Subject** (`subject`): The subject line of the email.
- **To** (`to`): The primary recipient(s) of the email. Multiple recipients can be separated by commas.
- **Message Body** (`message`): The main content of the email. This can be either plain text (text) or an HTML file (file).

##### Optional Data

- **From** (`from`): The email address of the sender. If not specified, a default address will be used.
- **CC** (`cc`): Carbon copy recipients. Multiple recipients can be separated by commas.
- **BCC** (`bcc`): Blind carbon copy recipients. Multiple recipients can be separated by commas.

##### Message Composition

The `EmailBodyMessage` class allows for specifying the content of your email's body. You have the option to include either plain text or an HTML file:

- Text (text): Use this property to send a plain text message.

#### Example

To send an email with both text and HTML options available, construct your message as follows:

```json
{
  "from": {
    "email": "from@example.com",
    "name": "John Doe"
  },
  "emailBody": {
    "subject": "Your Subject Here",
    "to": "recipient@example.com",
    "cc": "cc@example.com",
    "bcc": "bcc@example.com",
    "message": {
      "text": "This is a plain text message for email clients that do not support HTML."
    }
  }
}
```

#### Subscribing Applications

To subscribe a new application and obtain a clientId and secretKey, use the subscribeApplication method. These credentials will allow the application to authenticate and use the provided services.

## Steps to Use the Application

1. **Access to Queue Broker:**

   - The application that wishes to use the messaging services must have access to the queue broker.
   - To obtain access, please contact technical support.

2. **Integration and Registration with CLARISA:**

   - Once you have access to the broker, the application must request integration and registration with the CLARISA database.
   - This should also be done by contacting technical support.

3.1 **Registering the Application with the Microservice:**

- With the application identification provided by CLARISA (consisting of an `acronym: string` and an `environment: string`), register your application with the microservice using the following endpoint:
  - **Endpoint:** `/api/email/subscribe-application`
  - **Method:** `POST`
  - **Request Body:**
    ```json
    {
      "acronym": "string",
      "environment": "string"
    }
    ```
- This registration will return the credentials needed to use the microservice.

  3.2 **Alternative Registration via Queue Broker:**

- If HTTP requests are not enabled on the server, registration can be done via the broker in the `messages_queue` queue and the `subscribe-application` pattern.
- The request body will be the same as the HTTP request.

  3.3 This registration will return a `secret` and a `client_id`, which will be required to use the messaging service.

4. **HTTP Requests:**
   - HTTP requests must include an `auth` header with `username` and `password`:
     ```json
     {
       "auth": {
         "username": "string",
         "password": "string"
       }
     }
     ```

4.2 **Broker Requests:**

- When using the broker, the message must consist of `data` and `auth`. The `data` depends on the service being used, and the `auth` should have the same format as the HTTP header:
  ```json
  {
    "data": {
      // service-specific data
    },
    "auth": {
      "username": "string",
      "password": "string"
    }
  }
  ```

#### Development

This microservice is developed in TypeScript, using Node.js. Standard TypeScript development practices are recommended for contributing to the project.
