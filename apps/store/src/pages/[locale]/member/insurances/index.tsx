import { InsurancePage } from '@/features/memberArea/pages/InsurancePage'
import { protectedPageServerSideProps } from '@/features/memberArea/pages/protectedPageServerSideProps'

export const getServerSideProps = protectedPageServerSideProps
export default InsurancePage
