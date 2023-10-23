import { __prod__ } from "./constants"
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core"
import path from "path";
import { User } from "./entities/User";
import dotenv from 'dotenv';
dotenv.config();

export default {
        migrations: {
                path: path.join(__dirname, "./migrations"),
                pattern: /^[\w-]+\d+\.[tj]s$/
        },
        entities: [Post, User],
        dbName: 'lireddit',
        user: 'postgres',
        password: process.env.DATABASE_PASS,
        type: 'postgresql',
        debug: !__prod__,      
} as Parameters<typeof MikroORM.init>[0];