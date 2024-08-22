#  Product Management System Backend

## Description

This is a  backend for a Product management system built with Node.js. It supports the following functionalities:

- Retrieve products
- Add products
- Update products
- Delete products
- edit and delete users

The system implements role-based authentication to differentiate between Admin and User roles:
- **Admin**: Can perform all operations (get, add, update, delete) on any product.
- **User**: Can only perform operations on products they own.


## Technology Stack

- Node.js
- ExpressJs for structured codebase
- JWT for authentication
- Database: MongoDB 

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/task-management-system-backend.git
    cd task-management-system-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    JWT_SECRET=your_jwt_secret
    DATABASE_URL=your_database_url
    ```

4. Start the server:
    ```sh
    npm start
    ```

