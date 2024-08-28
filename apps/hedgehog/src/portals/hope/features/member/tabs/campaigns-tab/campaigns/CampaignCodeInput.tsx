import {
  Button,
  Flex,
  Input,
  Label,
  Spacing,
  TextDatePicker,
  useConfirmDialog,
} from '@hedvig-ui'
import { useEffect } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  GetReferralInformationDocument,
  useManualRedeemCampaignMutation,
} from 'types/generated/graphql'
import { getTodayFormatDate } from '@hope/features/member/tabs/contracts-tab/agreement/helpers'
import { formatDate } from 'date-fns/format'

export const CampaignCodeInput: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [campaignCode, setCampaignCode] = React.useState('')
  const [activationDate, setActivationDate] = React.useState<string | null>(
    null,
  )
  const [manualRedeemCampaign, { loading }] = useManualRedeemCampaignMutation()
  const { confirm } = useConfirmDialog()

  useEffect(() => setDefaultActivationDate(), [])

  const setDefaultActivationDate = () => {
    const formattedDate = getTodayFormatDate()
    setActivationDate(formattedDate)
  }

  return (
    <>
      <Flex direction="row" justify="space-between">
        <div style={{ width: '100%' }}>
          <Label>Campaign code</Label>
          <Input
            value={campaignCode}
            onChange={({ target: { value } }) => {
              setCampaignCode(value)
            }}
          />
        </div>
        <div>
          <Spacing left="small" right="small">
            <Label>Activation date</Label>
            <TextDatePicker
              withCurrentTime
              onChange={(value) =>
                value &&
                setActivationDate(formatDate(new Date(value), 'yyyy-MM-dd'))
              }
              value={activationDate}
            />
          </Spacing>
        </div>
      </Flex>
      <Spacing top />
      <Flex>
        <Button
          disabled={campaignCode === '' || loading || !activationDate}
          onClick={() => {
            confirm(
              `Are you sure you want to redeem the campaign code ${campaignCode.toUpperCase()}?`,
            ).then(() =>
              toast.promise(
                manualRedeemCampaign({
                  variables: {
                    memberId,
                    request: { campaignCode, activationDate },
                  },
                  refetchQueries: [{ query: GetReferralInformationDocument }],
                }),
                {
                  loading: 'Redeeming campaign',
                  success: () => {
                    setCampaignCode('')
                    return 'Campaign redeemed'
                  },
                  error: (e) => {
                    console.error(e)
                    return 'Could not redeem campaign'
                  },
                },
              ),
            )
          }}
        >
          Redeem
        </Button>
      </Flex>
    </>
  )
}
