import { ClaimPage } from '@/features/memberArea/pages/ClaimPage'
import { protectedPageServerSideProps } from '@/features/memberArea/pages/protectedPageServerSideProps'

export const getServerSideProps = protectedPageServerSideProps
export default ClaimPage
