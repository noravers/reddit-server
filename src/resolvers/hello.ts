import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver {
    @Query(() => String)
    hello() {
        return "hey"
    }
};

// export const resolvers = {
//     Query: {
//         hello: () => {
//             return "hey"
//         }
//     }
// }