import { MikroORM } from "@mikro-orm/core"
import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config'

const main = async() => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();
    await orm.getMigrator().up();
    try {
        const post = em.create(Post, {
        title: 'my first post',
        createdAt: "",
        updatedAt: ""
    })

    await em.persistAndFlush(post)
    // console.log('Post created sucessfully')

    }catch (error) {
        // console.log('Error creating Post', error)
    }
    
}


main().catch(err => {
    console.log(err)
})