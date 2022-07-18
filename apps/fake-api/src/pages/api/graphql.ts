import { readFileSync } from 'fs'
import path from 'path'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { ApolloServer, gql } from 'apollo-server-nextjs'

const typeDefs = readFileSync(path.resolve('./public', 'schema.graphql'), 'utf8')

const resolvers = {
  Query: {
    _empty: () => 'Hello, there :)',
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs: gql(typeDefs),
    resolvers,
  }),
})

export default server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: '*',
      credentials: true,
    },
  },
})

// Disable Next.js body parsing so that Apollo Server can accees it entirely
export const config = {
  api: {
    bodyParser: false,
  },
}
