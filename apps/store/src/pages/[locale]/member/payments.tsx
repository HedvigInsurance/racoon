import { PaymentsPage } from '@/features/memberArea/pages/PaymentsPage'
import { protectedPageServerSideProps } from '@/features/memberArea/pages/protectedPageServerSideProps'

export const getServerSideProps = protectedPageServerSideProps
export default PaymentsPage
