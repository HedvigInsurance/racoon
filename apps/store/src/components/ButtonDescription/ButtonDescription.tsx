import { Text } from 'ui'

export type ButtonDescriptionProps = {
  descriptionList: string[]
}

export const ButtonDescription = ({ descriptionList }: ButtonDescriptionProps) => {
  return (
    <Text color="textSecondary" as="p">
      {descriptionList.join('·')}
    </Text>
  )
}
