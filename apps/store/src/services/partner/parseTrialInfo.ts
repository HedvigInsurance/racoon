import {
  PartnerWidgetInitMutation,
  ShopSessionCustomerUpdateInput,
} from '@/services/apollo/generated'

type PartnerWidgetData = NonNullable<
  PartnerWidgetInitMutation['partnerWidgetInit']['partnerWidgetData']
>
type TrialInfo = NonNullable<PartnerWidgetData['trialInfo']>

type Data = {
  customerData: Omit<ShopSessionCustomerUpdateInput, 'shopSessionId'>
  priceIntentData: Record<string, unknown>
}

export const parseTrialInfo = (trialInfo: TrialInfo): Data => {
  return {
    customerData: {
      ...(trialInfo.ssn && { ssn: trialInfo.ssn }),
      ...(trialInfo.firstName && { firstName: trialInfo.firstName }),
      ...(trialInfo.lastName && { lastName: trialInfo.lastName }),
      ...(trialInfo.email && { email: trialInfo.email }),
    },
    priceIntentData: trialInfo.insuranceData,
  }
}
