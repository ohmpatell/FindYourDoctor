# FindYourDoctor

This is Find Your Doctor application, the group project for Group 4. The repo contains both the client (Vite/React) and server (Node/Express) code.

> **Note:** For this assignment, the `.env` file is included in the repository. Although this is a security risk for production applications, it is acceptable for our basic school project.

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)

## Project Overview

The **FindYourDoctor** app is divided into two main parts:
- **Client:** A front-end application built using Vite and React.
- **Server:** A back-end API built with Node.js, Express, and MongoDB.

## Installation

### Cloning the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/ohmpatell/FindYourDoctor.git
cd FindYourDoctor
```

### Installing Dependencies

This project uses a root-level package for managing concurrent scripts, as well as separate dependencies for the client and server.

1. **At the root level:**

   ```bash
   npm install
   ```

2. **Client Dependencies:**

   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Server Dependencies:**

   ```bash
   cd server
   npm install
   cd ..
   ```

## Getting Started

After installing all dependencies, you can start working on the project locally.

### Environment Variables

The project uses an `.env` file located in the **server** folder. Ensure that this file is present. It contains the important variables like connection string. Change them if needed.

## Running the Project

### Running Client and Server Concurrently

A root-level script is provided to run both the client and server concurrently using `concurrently`.

From the root folder, run:

```bash
npm run dev
```

This command will start both (easier to run simultaneously):
- The **client** (Vite/React) at its default port (usually 3000).
- The **server** (Node/Express) on port 5000 (or the port defined in your `.env`).

### Running Individually

- **Client:**  
  From the `client` folder:
  ```bash
  npm run dev
  ```

- **Server:**  
  From the `server` folder:
  ```bash
  npm start
  ```

## Project Structure

```
FindYourDoctor/
├── README.md
├── .gitignore
├── package.json          # Root-level package.json for shared scripts
├── client/               # Frontend React application
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── utils/
└── server/               # Node/Express Backend
    ├── package.json
    ├── .env              
    └── src/
        ├── server.js
        ├── config/
        │   └── db.js
        ├── controllers/
        ├── models/
        ├── routes/
        ├── middlewares/
        └── utils/
```

---

This README provides a comprehensive overview and clear instructions to help everyone on the team set up and work with the **FindYourDoctor** project. Adjust any URLs or details as necessary for your specific repository and project needs.
