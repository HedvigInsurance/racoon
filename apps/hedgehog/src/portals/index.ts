import { App as SOSApp } from 'portals/sos/App'
import { App as HOPEApp } from 'portals/hope/App'

export const app = (portal: string) => {
  switch (portal.toUpperCase()) {
    case 'SOS':
      return SOSApp
    case 'HOPE':
      return HOPEApp
  }
}
