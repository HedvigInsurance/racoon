// TODO: Continue when solution or workaround is available for https://github.com/storybookjs/storybook/issues/19711

// import localFont from '@next/font/local'
// const hedvigFonts = {
//   standard: localFont({ src: '../../fonts/HedvigLetters-Standard.woff2' }),
// }
//
// console.log(hedvigFonts)

const config = {
  title: 'Theme / Typography',
}
export default config

const Template = () => {
  // TODO: use Heading for headers
  return (
    <div>
      <h1>h1. Page header</h1>
      <h2>h2. Section header</h2>
      <h3>h3. Small header</h3>
      <p>Some regular text</p>
      <div>Some secondary text</div>
    </div>
  )
}

export const Default = Template.bind({})
