import styled from '@emotion/styled'
import { Button, Input } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui'
import { useState } from 'react'
import { CheckCircleFill, PencilFill, XCircleFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  MemberQuotesDocument,
  Quote,
  useOverrideQuotePriceMutation,
} from 'types/generated/graphql'

const PriceWrapper = styled.div`
  padding-bottom: 1rem;
`

const DisplayPrice = styled.div`
  line-height: 1.2;
  font-size: 2rem;
`

const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`
const PriceInput = styled.div`
  margin-right: 12px;
`

const SubmitButton = styled(CheckCircleFill)`
  color: ${({ theme }) => theme.success};
`
const CancelButton = styled(XCircleFill)`
  color: ${({ theme }) => theme.accent};
`

interface Props {
  quote: Quote
}

export const QuotePrice = ({ quote }: Props) => {
  const [editPrice, setEditPrice] = useState(false)
  const [newPrice, setNewPrice] = useState<number>(quote.price || 0)
  const [overrideQuotePrice] = useOverrideQuotePriceMutation()
  const { confirm } = useConfirmDialog()

  const onPriceChange = (value: number) => setNewPrice(value)
  const restorePrice = () => setNewPrice(quote.price || 0)

  const onCancel = () => {
    restorePrice()
    setEditPrice(false)
  }

  const formattedPrice = quote.price
    ? formatMoney({
        amount: quote.price,
        currency: quote.currency ?? 'SEK',
      })
    : '-'

  const updateQuotePrice = () => {
    toast.promise(
      overrideQuotePrice({
        variables: {
          input: {
            quoteId: quote.id,
            price: newPrice,
          },
        },
        refetchQueries: [
          {
            query: MemberQuotesDocument,
            variables: { memberId: quote.memberId },
          },
        ],
      }),
      {
        loading: 'Overriding quote price',
        success: 'Quote price overriden',
        error: () => {
          restorePrice()
          return 'Could not override quote price'
        },
      },
    )
  }

  const onSubmitNewPrice = () => {
    const confirmMessage = `Are you sure you want to change the price from ${
      quote.price
    } ${quote.currency ?? ''} to ${newPrice} ${quote.currency ?? ''}?`

    confirm(confirmMessage)
      .then(async () => updateQuotePrice())
      .catch(() => restorePrice())

    setEditPrice(false)
  }

  return (
    <PriceWrapper>
      {editPrice ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmitNewPrice()
          }}
        >
          <AlignCenter>
            <PriceInput>
              <Input
                autoFocus
                type="number"
                value={newPrice}
                onChange={(e) => {
                  const number = parseFloat(e.target.value)

                  if (isNaN(number)) {
                    return
                  }

                  onPriceChange(number)
                }}
              />
            </PriceInput>
            <Button variant="tertiary" type="submit">
              <SubmitButton size="1.6em" />
            </Button>
            <Button variant="tertiary" onClick={onCancel}>
              <CancelButton size="1.6em" />
            </Button>
          </AlignCenter>
        </form>
      ) : (
        <AlignCenter>
          <DisplayPrice>{formattedPrice}</DisplayPrice>
          <Button variant="tertiary" onClick={() => setEditPrice(true)}>
            <PencilFill />
          </Button>
        </AlignCenter>
      )}
    </PriceWrapper>
  )
}
