import { CasualList, CasualListItem } from '@hedvig-ui'

export const DefaultCasualList = () => {
  return (
    <CasualList>
      <CasualListItem>First item</CasualListItem>
      <CasualListItem>Second item</CasualListItem>
      <CasualListItem>Third item</CasualListItem>
    </CasualList>
  )
}

export default {
  title: 'CasualList',
  component: CasualList,
}
