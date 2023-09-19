import { Resolver, Query } from "type-graphql";
import { Post } from "src/entities/Post";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts() {
        return "post"
    }
};