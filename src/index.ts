import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core"
// import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config'
import express from 'express';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
// import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
// import { buildSchema } from 'type-graphql'
// import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { typeDefs } from "./typeDefs/typeDefs";
import RedisStore from "connect-redis";
import session from "express-session";
import Redis from "ioredis"; // Import Redis from ioredis
import { __prod__ } from "./constants";

interface MyContext {
    token?: String;
}


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
    });


    app.set("Access-Control-Allow-Origin", "studio.apollographql.com", );
    app.set("Access-Control-Allow-Credentials", true);

    let plugins: any = [];
    if (process.env.NODE_ENV === "production") {
    plugins = [
      ApolloServerPluginLandingPageProductionDefault({
        embed: true,
        graphRef: "myGraph@prod",
        includeCookies: true,
      }),
    ];
    } else {
        plugins = [
        ApolloServerPluginLandingPageLocalDefault({
            embed: true,
            includeCookies: true, // very important
        }),
        ];
    } 
    
    const apolloServer = new ApolloServer<MyContext>({
        resolvers: { PostResolver, UserResolver },
        typeDefs,
        plugins
    });
    await apolloServer.start();    
  
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => ({ em: orm.em.fork(), req, res })

        })
    )


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
    // app.get('/', (req, res) => {
    // // Log the session object to the console
    // // req.session.userId = 5
    // console.log(req);

    // // Your route handling logic here
    // res.send('Hello World');
    // });
}

main().catch(err => {
    console.log(err)
})