import * as React from 'react'
import { SOSPageRoutes } from 'portals/sos/pages/SOSPageRoutes'
import { MeFragment } from 'types/generated/graphql'

export const App: React.FC<{ me: MeFragment }> = () => {
  return <SOSPageRoutes />
}
