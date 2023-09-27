import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core"
// import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config'
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from 'type-graphql'
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import RedisStore from "connect-redis";
import session from "express-session";
import Redis from "ioredis"; // Import Redis from ioredis

const redisClient = new Redis({
  // Redis client options here (if needed)
  // For example, specifying the host and port:
  // host: "localhost",
  // port: 6379,
});

// Handle any connection errors
redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "", // Add your prefix here if needed
});

// Now you can use redisStore with express-session





const main = async() => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();    
    const app = express();    
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: () => ({ em: orm.em.fork() })
    })

    await apolloServer.start();    
    apolloServer.applyMiddleware({app})

    app.use(
        session({
            store: redisStore,
            secret: "keyboard cat",
            resave: false,
            saveUninitialized: false
        })
    )
    app.listen(4000, () => {
        console.log('server started on local:host:4000')
    })    
}

main().catch(err => {
    console.log(err)
})