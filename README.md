# Milly Hairdressing backend

This project is the backend of a system to allow a hairdressing to manages its reservations.

## Guidelines

* Source code is located in `src/`.
* Configuration files (like .env) are located in `etc/`.
* Indentation are spaces of 2.
* Code style is cammelCase.
* EditorConfig file already has the coding styles configured, use it in the source-code editor or IDE.

## Documentation

The documentation is in `/docs` directory. To read the REST API documentation, [click here](/docs/rest_api.md).

## Installation

In `/etc` directory, create a `.env` file, place the next environment variables and fill the remaining data:

```
PORT=3000
MARIADB_USER=[MariaDB user to be used]
MARIADB_PASS=[MariaDB user's password]
MARIADB_HOST=localhost
MARIADB_DATABASE=milly_hairdressing
IANA_TIMEZONE=America/Cancun
MARIADB_PORT=3306
```

Run the sql [database schema](/src/scripts/database_schema.sql) in your local DB system.

Install dependencies with `npm ci`.

Start the development server with the command `npm run dev`, or start the production server with `npm start`.

