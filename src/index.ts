import { MikroORM } from "@mikro-orm/core"
// import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config'
import express from 'express';

const main = async() => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();
    await orm.getMigrator().up();
    
    const app = express();
    app.listen(4000, () => {
        console.log('server started on local:host:4000')
    })
    
}


main().catch(err => {
    console.log(err)
})