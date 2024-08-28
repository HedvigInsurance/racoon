import { lazy } from 'react'
import { GraphQLError, GraphQLFormattedError } from 'graphql'

const LazyReactJson = lazy(() => import('react-json-view'))

export const PrettyPrintJSON = ({
  obj,
  name,
  collapsed,
}: {
  obj:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | GraphQLFormattedError[]
    | GraphQLError[]
    | GraphQLFormattedError[]
    | Error[]
  name: string
  collapsed: boolean | number
}) => {
  return (
    <pre
      style={{
        width: '100%',
        height: '100%',
        padding: '10px 20px',
        overflow: 'scroll',
        margin: 0,
      }}
    >
      <LazyReactJson src={obj} collapsed={collapsed} name={name} />
    </pre>
  )
}
