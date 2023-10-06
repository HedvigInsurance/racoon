import { InsuranceDetailsPage } from '@/features/memberArea/pages/InsuranceDetailsPage'
import { protectedPageServerSideProps } from '@/features/memberArea/pages/protectedPageServerSideProps'

export const getServerSideProps = protectedPageServerSideProps
export default InsuranceDetailsPage
