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

import Redis from 'ioredis';
// import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis'

const RedisStore = connectRedis(session)
// const redisClient = redis.createClient()
const redisClient = new Redis();



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
            store: new RedisStore({ client: redisClient }),
            secret: "keyboard cat",
            resave: false
        })
    )
    app.listen(4000, () => {
        console.log('server started on local:host:4000')
    })    
}

main().catch(err => {
    console.log(err)
})