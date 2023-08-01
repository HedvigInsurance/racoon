import { createHttpLink } from '@apollo/client'
import ApolloLinkTimeout from 'apollo-link-timeout'

const TIMEOUT_50_SECONDS = 50 * 1000
const timeoutLink = new ApolloLinkTimeout(TIMEOUT_50_SECONDS)
const baseHttpLink = createHttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT })

export const httpLink = timeoutLink.concat(baseHttpLink)
