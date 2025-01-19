# hotel-# Hotel Booking

## Project Description
Hotel Booking is a web application built with React and Node.js that allows users to book hotel rooms online. The application provides features such as user authentication, room availability checking, and booking management.

## Features
- **User Authentication**: Users can register and log in to their accounts.
- **Browse Available Rooms**: Users can view available hotel rooms and their details.
- **Book and Manage Reservations**: Users can book rooms and manage their reservations.
- **View Booking History**: Users can view their past bookings.

## Technologies Used
- **Frontend**: React, Vite, Bootstrap, Axios
- **Backend**: Node.js, Express, MongoDB, JWT for authentication, GraphQL with Apollo Server
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

## Prerequisites
- Docker

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/mystry123/hotel-booking.git
    cd hotel-booking
    ```

2. **Install server dependencies**:
    ```sh
    cd server
    npm install
    ```

3. **Install client dependencies**:
    ```sh
    cd ../client
    npm install
    ```

## Configuration

1. **Create a `.env` file in the `server` directory** and add the following environment variables:
    ```env
    PORT=4000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

## Running the Application

1. **Start the application using Docker Compose**:
    ```sh
    docker-compose up --build
    ```

2. **Open your browser and navigate to** `http://localhost:3001` to view the application.

## Running Tests

1. **To run server tests using Docker Compose**:
    ```sh
    docker-compose up --build backend-tests
    ```

2. **To run server tests locally**:
    ```sh
    cd server
    npm test
    ```

3. **To run client tests**:
    ```sh
    cd ../client
    npm test
    ```

## Code Coverage

To generate code coverage reports, run the following command in the `server` directory:
```sh
npm run coverage