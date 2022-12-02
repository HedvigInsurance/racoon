import styled from '@emotion/styled'

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  height: '200px',
  width: '168px',
  backdropFilter: 'blur(20px)',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
}))

const Icon = styled.div(({ theme }) => ({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  width: '76px',
  height: '76px',
  color: theme.colors.gray900,
  backgroundColor: '#D8EFB6', // Swap with token when available
  borderRadius: theme.radius.md,
}))

const SubjectText = styled.div(({ theme }) => ({
  color: theme.colors.gray900,
  textAlign: 'center',
}))

const DetailText = styled.div(({ theme }) => ({
  color: theme.colors.gray600,
  textAlign: 'center',
}))

type Props = {
  icon: string
  subject: string
  details: string
}
export const ContactCard = ({ details, icon, subject }: Props) => {
  return (
    <Card>
      <Icon>{icon}</Icon>
      <div>
        <SubjectText>{subject}</SubjectText>
        <DetailText>{details}</DetailText>
      </div>
    </Card>
  )
}
