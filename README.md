# Back-End Chat Application

## Overview

This project is a robust **Back-End Chat Application** designed to handle user authentication, messaging features, and data integration from multiple databases. Built with **Node.js**, the application is modular and scalable, ensuring clear architecture and ease of use.

---

## Key Features

### **1. User Authentication and Authorization**
- **User Authentication**: Verify user credentials to ensure secure access.
- **User Authorization**: Define user permissions and control allowed actions within the system.

### **2. Messaging Functionality**
- **Create Chat Groups**: Enable users to create and manage chat groups seamlessly.
- **Manage Group Members**:
  - Add or remove members from chat groups.
- **Send Messages**: Provide users with a smooth interface for exchanging messages within groups.

### **3. Data Integration**
- **MySQL Integration**: Connect to and fetch data from MySQL databases for structured storage.
- **MongoDB Integration**: Leverage MongoDB for flexible, NoSQL data storage and retrieval.

---

## Technology Stack

### Backend
- **Development Framework**: **Node.js**
- **Database Systems**:
  - **MySQL**: For structured relational data handling.
  - **MongoDB**: For managing unstructured, NoSQL data.

### Tools and Environments
- **Express.js**: For building robust APIs.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Sequelize**: ORM for efficient interaction with MySQL databases.
- **Mongoose**: ODM for MongoDB operations.

---

## How to Use

### Setup Instructions:
** 1. Clone the Repository**:
   ```bash
   git clone  https://github.com/levilee0342/BackEnd-Chat-Application
   cd chat-backend
   ```
** 2. Install Dependencies**:

```bash
npm install
```
** 3. Configure Databases**:

Update database connection strings in the .env file for both MySQL and MongoDB.
Run the Application:

```bash
npm start
```
### Features in Action:
- Authenticate with valid credentials.
- Create or manage chat groups directly from the API.
- Send and receive messages seamlessly.
- Fetch and manage data using the integrated MySQL and MongoDB functionalities.
### Example API Endpoints
#### User Authentication:
- POST /api/auth/login - Log in a user and return a JWT for authentication.
#### Messaging Features:
- POST /api/groups - Create a new chat group.
- POST /api/messages - Send a message to a specific chat group.
#### Data Collection:
- GET /api/mysql-data - Fetch data from MySQL.
- GET /api/mongo-data - Retrieve data from MongoDB.
### Contact
Thank you for reviewing my project!
For more information or inquiries, feel free to reach out at:
📧 leetuan0342@gmail.com  
