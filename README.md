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
   git clone https://github.com/your-username/api-base.git
   cd api-base
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

## Project Structure

```
api-base/
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

## Best Practices

- Always validate and sanitize user input.
- Never store sensitive information directly in the code.
- Regularly update your dependencies.
- Add your own routes, models, and services as needed.

## Contributing

Contributions are welcome! Feel free to open an issue or a pull request to suggest improvements, fix bugs, or add new features.

## License

This project is open-source under the MIT license.