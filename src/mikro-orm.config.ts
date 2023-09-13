import { __prod__ } from "./constants"
import { Post } from "./entities/Post";

export default {
        entities: [Post],
        dbName: 'lireddit',
        user: 'postgres',
        password: 'georgie4$$',
        type: 'postgresql',
        debug: !__prod__,      
} as const;