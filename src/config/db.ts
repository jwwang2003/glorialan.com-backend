import { HealthReport } from "@/health";
import mongoose, { ConnectionStates, Mongoose } from "mongoose";

import { createClient, RedisClientType } from "redis";

let _redisClient: RedisClientType;

export async function mongoConnect(): Promise<Mongoose> {
  const HOST = process.env.MONGO_HOST || "mongo";
  const PORT = process.env.MONGO_PORT || 27017;
  const URL = `mongodb://${HOST}:${PORT}`;

  try {
    const res = await mongoose.connect(URL, {
      user: process.env.MONGO_ROOT_USERNAME,
      pass: process.env.MONGO_ROOT_PASSWORD,
    });
    return res;
  } catch (e) {
    console.error(e);
  }

  return mongoose;
}

export function getRedisClient(): RedisClientType {
  // Iniialize Redis client
  const REDIS_HOST = process.env.REDIS_HOST || 'redis';
  const REDIS_PORT = process.env.REDIS_PORT || 6379;

  let redisClient: RedisClientType = createClient({
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD || undefined
  });
  _redisClient = redisClient;
  return redisClient;
  // try {
  //   await redisClient.connect();
  // } catch (e) {
  //   console.error(e);
  // }
  // _redisClient = redisClient;
  // return redisClient;
}

export async function redisConenct(): Promise<RedisClientType> {
  try {
    await _redisClient.connect();
  } catch (e) {
    console.error(e);
  }
  return _redisClient;
}

////////////////////////////////////////////////////////////////////////////////
//////////                     DB Health Checks                       //////////
////////////////////////////////////////////////////////////////////////////////

export async function mongoCheck(): Promise<HealthReport> {
  const state = mongoose.connection.readyState;
  /**
   * Connection ready state:
      0 = disconnected
      1 = connected
      2 = connecting
      3 = disconnecting
      99 = uninitialized
   */
  const health = {
    OK: state === ConnectionStates.connected,
    msg: ConnectionStates[state]
  };
  return health;
}

export async function redisCheck(): Promise<HealthReport> {
  return {
    OK: _redisClient.isOpen,
    msg: ""
  }
}