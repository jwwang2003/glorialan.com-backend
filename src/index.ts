import pg from 'pg'
import path from 'path'
import fs from 'fs'

import express from 'express'

import 'dotenv/config'

// SQL Statements
import {
  CREATE_ARTWORKS,
  CREATE_ARTWORK_TAGS,
  CREATE_LOCATIONS,
  CREATE_TAGS,
} from './sql'

// Helper functions
import { reTryCatch } from './helpers'

// Postgres
const { Client } = pg
const client = new Client({ 
  host: "localhost",
  database: process.env.PG_NAME, 
  port: Number(process.env.DB_PORT), 
  user: process.env.PG_USERNAME, 
  password: process.env.PG_PASSWORD
});

// Connect to Postgre DB
(async () => {
  await reTryCatch(
    async () => { await client.connect() },
    (error) => { console.log(error) },
    3
  )
}
)();

// Check SQL database
(async () => {
  try {
    // Ensure that all the required tables exists in the database
    await client.query("".concat(
      CREATE_LOCATIONS, 
      CREATE_ARTWORKS, 
      CREATE_TAGS, 
      CREATE_ARTWORK_TAGS
    ));
    console.log('Tables created and data inserted successfully.');
  } catch (error) {
    console.error('An error occured while creating tables', error);
  }
}
)();

// Connect to MongoDB

// Connect to Cache server

// Test connection to Amazon S3


// Express server

const App = express()

App.listen(process.env.API_PORT, () => {
  console.log(`SERVER IS RUNNING ON ${process.env.API_PORT}`)
})