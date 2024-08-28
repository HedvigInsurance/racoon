import {
  Bold,
  Capitalized,
  ErrorText,
  FourthLevelHeadline,
  Input,
  MainHeadline,
  Paragraph,
  Placeholder,
  SecondLevelHeadline,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import * as React from 'react'

export default {
  title: 'Typography',
}

export const Headlines: React.FC = () => (
  <>
    <MainHeadline>Main headline</MainHeadline>
    <SecondLevelHeadline>Second level headline</SecondLevelHeadline>
    <ThirdLevelHeadline>Third level headline</ThirdLevelHeadline>
    <FourthLevelHeadline>Fourth level headline</FourthLevelHeadline>
    <Paragraph>Paragraph</Paragraph>
    <Bold>Bold</Bold>
  </>
)

export const Utilities: React.FC = () => {
  const [text, setText] = React.useState('CaPiTaLiZeD')
  return (
    <>
      <Input value={text} onChange={(e) => setText(e.currentTarget.value)} />
      <Spacing top="small" />
      <Capitalized>{text}</Capitalized>
      <Spacing top="medium" />
      <Placeholder>This is a placeholder</Placeholder>
      <Spacing top="small" />
      <ErrorText>This is an error</ErrorText>
    </>
  )
}
