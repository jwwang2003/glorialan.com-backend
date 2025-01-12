import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import session from "express-session";

import { mongoConnect, mongoCheck, redisConenct, redisCheck, getRedisClient } from '@/config/db';
import { RedisStore } from "connect-redis";
import { s3CheckConenction } from "@/utils/aws";

import schedule from "node-schedule";
import { getSuperKey, updateSuperKey } from '@/superKey';

import { HealthCheck } from '@/health';

import router from '@/routes';
import corsConfig from '@/config/cors';

if (process.env.NODE_ENV) {
  console.log(`CURRENT ENV MODE: ${process.env.NODE_ENV}`);
}

const app = express();
app.use(cors(corsConfig));          // Cross-Origin Resource Sharing policy
app.use(express.json());            // JSON body

////////////////////////////////////////////////////////////////////////////////
//////////                          AWS S3                            //////////
////////////////////////////////////////////////////////////////////////////////
s3CheckConenction().then(res => {
  if(res) console.log("AWS S3 OK");
  else console.log("AWS S3 NOT OK");
});

////////////////////////////////////////////////////////////////////////////////
//////////                           MONGO                            //////////
////////////////////////////////////////////////////////////////////////////////
mongoConnect().then(res => {
  if (res.connection.readyState) {
    console.log("MongoDB OK");
  } else {
    console.log("MongoDB NOT OK");
  }
});

////////////////////////////////////////////////////////////////////////////////
//////////                           REDIS                            //////////
////////////////////////////////////////////////////////////////////////////////
const redisClient = getRedisClient();
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      prefix: "gl:",
    }),
    resave: false,              // required: force lightweight session keep alive (touch)
    saveUninitialized: true,    // recommended: only save session when data exists
    secret: String(process.env.SESSION_SECRET),
  })
);

redisConenct().then((redisClient) => {
  if (redisClient.isReady && redisClient.isOpen) {
    console.log("REDIS OK");
  } else {
    console.log("REDIS NOT OK");
  }
});

////////////////////////////////////////////////////////////////////////////////
//////////                          ROUTES                            //////////
////////////////////////////////////////////////////////////////////////////////
app.use(router);

////////////////////////////////////////////////////////////////////////////////
//////////                         SUPERKEY                           //////////
////////////////////////////////////////////////////////////////////////////////

// First initialize the superkey and print it, then set a schduled job to update it (keep it rolling)

/**
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
 */
schedule.scheduleJob('*/5 * * * *', function() {
  updateSuperKey();
  console.log(getSuperKey());
});

////////////////////////////////////////////////////////////////////////////////
//////////                           MAIN                             //////////
////////////////////////////////////////////////////////////////////////////////

app.get("/", async (req: express.Request, res: express.Response) => {
  res.status(200).json({
    msg: "Hello, world!" 
  })
});

app.get("/health", async (req, res) => {
  // Health check
  const s3Status = await s3CheckConenction();
  const mongoStatus = await mongoCheck(); 
  const redisStatus = await redisCheck();

  const healthCheck: HealthCheck = {
    uptime: process.uptime(),
    awsS3: s3Status,
    mongoDB: mongoStatus,
    redis: redisStatus
  };

  res.status(200).json(healthCheck);
});

// Grab the port and start the server
const port = Number(process.env.API_PORT) || 8000;
app.listen(process.env.API_PORT, () => {
  console.log(`SERVER IS RUNNING ON ${port}`)
});