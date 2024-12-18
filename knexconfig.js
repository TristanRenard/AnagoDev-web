const knexConfig = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD_DEVELOPMENT,
      database: process.env.DB_NAME_DEVELOPMENT,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: "./src/db/migrations"
    },
    seeds: {
      directory: "./src/db/seeds"
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  staging: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD_STAGING,
      database: process.env.DB_NAME_STAGING,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: "./src/db/migrations"
    },
    seeds: {
      directory: "./src/db/seeds"
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD_PRODUCTION,
      database: process.env.DB_NAME_PRODUCTION,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: "./src/db/migrations"
    },
    seeds: {
      directory: "./src/db/seeds"
    },
    pool: {
      min: 2,
      max: 10
    }
  }
}

export default knexConfig
