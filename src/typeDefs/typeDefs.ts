import gql from 'graphql-tag';

export const typeDefs = gql`
type UserType {
  id: ID!
  createdAt: String!
  updatedAt: String!
  username: String!
  password: String!
}

type PostType {
    id: ID!
    createdAt: String!
    updatedAt: String!
    title: String!
}
`