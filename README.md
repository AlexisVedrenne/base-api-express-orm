# API Base – Express.js Starter for REST APIs

This repository provides a base REST API built with Node.js, Express.js, and Sequelize, designed to serve as a solid foundation for quickly creating new, secure, and maintainable APIs.

## Main Features

- Modular and scalable project structure (routes, controllers, services, middlewares, models, etc.)
- Ready-to-use JWT authentication
- Enhanced security (Helmet, CORS, rate limiting, error handling)
- Sequelize ORM with migrations and seeders management
- Access and error logging
- Examples for user, role, and UUID management
- Email sending support (via Mailjet/Nodemailer)
- Deployment-ready (scripts, configuration, example .env)

## Prerequisites

- Node.js >= 16
- PostgreSQL (or any Sequelize-compatible DBMS)
- npm

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AlexisVedrenne/base-api-express-orm.git
   cd base-api-express-orm
   ```

2. Install dependencies (choose one):

   With **npm**:
   ```bash
   npm install
   ```

   Or with **yarn**:
   ```bash
   yarn install
   ```

3. Configure your environment variables:
   - Copy the file `src/config/.exemple.env` to `.env` and adapt it to your environment.

4. Initialize the database:
   With **npm**:
   ```bash
   npm run db:create
   npm run migrate
   npm run seed:gen:all
   ```
   Or with **yarn**:
   ```bash
   yarn db:create
   yarn migrate
   yarn seed:gen:all
   ```

5. Start the development server:
   With **npm**:
   ```bash
   npm run dev
   ```
   Or with **yarn**:
   ```bash
   yarn dev
   ```

## Packaging with `pkg` (Linux & Windows)

This project is configured to use [`pkg`](https://github.com/vercel/pkg) to generate standalone executables for both Linux and Windows platforms.

### How to build

1. Install `pkg` globally if you haven't already:
   ```bash
   npm install -g pkg
   ```

2. Build the executable:
   ```bash
   npm run build
   ```
   or directly with:
   ```bash
   pkg .
   ```

3. The executables will be generated in the `dist` folder for:
   - **Windows** (`node16-win-x64`)
   - **Linux** (`node16-linux-x64`)

### Notes

- The packaging configuration is defined in the `package.json` under the `pkg` field.
- All necessary assets and scripts are included for the build.
- You can adjust the targets in `package.json` if you need other platforms.

## Project Structure

```
base-api-express-orm/
├── src/
│   ├── assets/         # Images, email templates, etc.
│   ├── bin/            # Application entry point
│   ├── boot/           # Initialization (e.g., mailer, axios)
│   ├── config/         # Configurations (auth, DB, mailer, etc.)
│   ├── controllers/    # Endpoint logic
│   ├── middleware/     # Custom middlewares
│   ├── models/         # Sequelize models
│   ├── routes/         # Route definitions
│   └── services/       # Reusable business logic
├── migrations/         # Sequelize migrations
├── seeders/            # Example data
├── config/             # Global config (e.g., config.json)
├── app.js              # Main Express configuration
├── package.json
└── README.md
```

## Sequelize Configuration (`config/config.json`)

The `config/config.json` file contains the database connection settings used by Sequelize CLI for migrations and seeders. It defines different environments (development, test, production) and their respective database credentials.

### Example structure

```json
{
  "development": {
    "username": "your_db_user",
    "password": "your_db_password",
    "database": "your_db_name",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "your_db_user",
    "password": "your_db_password",
    "database": "your_test_db_name",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "your_db_user",
    "password": "your_db_password",
    "database": "your_prod_db_name",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

### How it works

- **Sequelize CLI** uses this file to know how to connect to your database when running commands like `db:migrate` or `db:seed:all`.
- You can set different credentials for each environment (development, test, production).
- Make sure to keep your credentials secure and never commit sensitive information in a public repository.

### Tips

- You can use environment variables in this file for better security. For example, with `process.env.DB_USER` (see Sequelize documentation for dynamic config).
- If you change your database settings, update this file accordingly.

## Best Practices

- Always validate and sanitize user input.
- Never store sensitive information directly in the code.
- Regularly update your dependencies.
- Add your own routes, models, and services as needed.

## Contributing

Contributions are welcome! Feel free to open an issue or a pull request to suggest improvements, fix bugs, or add new features.

## License

This project is open-source under the MIT license.