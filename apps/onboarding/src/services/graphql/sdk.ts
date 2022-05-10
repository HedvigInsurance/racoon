import { getSdk } from './generated'
import { requester } from './requester'

export const graphqlSdk = getSdk(requester)
