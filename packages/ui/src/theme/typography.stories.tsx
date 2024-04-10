import { Heading } from '../components/Heading/Heading'
import { theme } from './theme'

const config = {
  title: 'Theme / Typography',
}
export default config

const Template = () => {
  // TODO: use Heading for headers
  return (
    <div>
      <Heading as="h1" variant="standard.48">
        h1. Page header
      </Heading>
      <Heading as="h2" variant="serif.32">
        h2. Section header (serif)
      </Heading>
      <Heading as="h3" variant="standard.24">
        h3. Small header
      </Heading>
      <p>Some regular text</p>
      <p style={{ color: theme.colors.gray500 }}>Some secondary text</p>
    </div>
  )
}

export const Default = {
  render: Template,
}
