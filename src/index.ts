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
import { __prod__ } from "./constants";
// import {
//  ApolloServerPluginLandingPageProductionDefault,
//  ApolloServerPluginLandingPageLocalDefault
// }  from 'apollo-server-core';


const main = async() => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();    
    const app = express();    
    
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
      disableTouch: true,
    //   disableTTL: true
    });

    // const cors = {
    // credentials: true,
    // origin: 'https://studio.apollographql.com'
    // }

    app.set("Access-Control-Allow-Origin", "studio.apollographql.com", );
    app.set("Access-Control-Allow-Credentials", true);
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em.fork(), req, res }),
        // plugins: [
        //     process.env.NODE_ENV === "production"
        //     ? ApolloServerPluginLandingPageProductionDefault({
        //         embed: true,
        //         graphRef: "plaid-gufzoj@current"
        //         })
        //     : ApolloServerPluginLandingPageLocalDefault()
        // ]
    })

    await apolloServer.start();    
    apolloServer.applyMiddleware({
        app,
        cors: { credentials: true, origin: "https://studio.apollographql.com" }
    })


    app.use(
        session({
            name: "myapp",
            store: redisStore,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
                httpOnly: true,
                sameSite: 'none',
                secure: true
            },
            secret: "keyboard cat",
            resave: false,
            saveUninitialized: false
        })
    )
    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })      
        // Middleware to log request and response headers
    app.use((_, res, next) => {
    res.on("finish", () => {
        console.log("Response Headers:", res.getHeaders());
    });
    next();
    });

    // app.use()


    // Your route handling logic here
    // res.send('Hello World');
    // });
}

main().catch(err => {
    console.log(err)
})