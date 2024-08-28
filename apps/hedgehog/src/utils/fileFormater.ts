import {
  PaymentMethod,
  PaymentRecipientType,
  PaymentSender,
} from '@hope/features/config/constants'
import { format } from 'date-fns'
import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { addBusinessDays } from 'date-fns/fp'
import { isSwedishHoliday } from './dateUtil'

enum PostType {
  PI00 = 'PI00',
  BA00 = 'BA00',
  BA01 = 'BA01',
  BA02 = 'BA02',
  BA03 = 'BA03',
  BE01 = 'BE01',
  BE02 = 'BE02',
  BE03 = 'BE03',
  BM99 = 'BM99',
  CNDB = 'CNDB',
  CNKR = 'CNKR',
  MH00 = 'MH00',
  MH10 = 'MH10',
  MT00 = 'MT00',
}

enum PaymentType {
  PLUSGIRO = '00',
  BANKGIRO = '05',
  ACCOUNT_DEPOSIT = '09',
}

type AdditionalData = {
  clearingNumber?: string
  noteToRecipient?: string // TODO: implement
  bookkeepingDate?: Date | string
  ocr?: string
}

interface IPO3RecordBuilder {
  appendRecord(postType: PostType, value: string): IPO3RecordBuilder
  build(
    sender: PaymentSender,
    payments: PaymentOrderInformationFragment[],
  ): string
}

class PO3RecordBuilder implements IPO3RecordBuilder {
  private records: string[] = []

  public appendRecord(value: string): IPO3RecordBuilder {
    this.records.push(value)
    return this
  }

  public build(
    sender: PaymentSender,
    payments: PaymentOrderInformationFragment[],
  ): string {
    if (!sender) throw new Error('Sender was not specified')
    // Ensuring the file always starts with the header and ends with the trailer.
    const header = this.createHeader(sender)
    const trailer = this.createTrailer(payments)

    return [header, ...this.records, trailer].join('\n')
  }

  createHeader({
    type: accountType,
    orgNumber,
    account,
  }: PaymentSender): string {
    let header = (
      accountType === PaymentMethod.IBAN ? PostType.MH10 : PostType.MH00
    ).toString()
    header = header.padEnd(12, ' ')
    header += cleanNumberString(orgNumber)

    if (accountType === PaymentMethod.IBAN) {
      header = header.padEnd(25, ' ')
      header += 'SEK'
      header = header.padEnd(34, ' ')
      header = addAndPad(header, account, ' ', 69, true)
      header += 'SEK'
      header = header.padEnd(80, ' ')
    } else if (
      accountType === PaymentMethod.BANKGIRO ||
      accountType === PaymentMethod.PLUSGIRO
    ) {
      header = header.padEnd(34, ' ')
      header = addAndPad(header, account, ' ', 44, true)
      header += 'SEK'
      header = header.padEnd(53, ' ')
      header += 'SEK'
      header = header.padEnd(80, ' ')
    }
    return header
  }

  createTrailer(payments: PaymentOrderInformationFragment[]): string {
    let trailer = PostType.MT00.toString()
    trailer = trailer.padEnd(29, ' ')
    const numPayments = payments?.length.toString().padStart(7, '0')
    const sum = payments.reduce((sum, payment) => {
      return sum + payment.amount.amount
    }, 0)
    const amount = Math.round(sum * 100)
      .toString()
      .padStart(15, '0')
    trailer += numPayments
    trailer += amount
    trailer = trailer.padEnd(80)
    return trailer
  }

  createPI00(
    accountType: PaymentMethod,
    payment: PaymentOrderInformationFragment,
    additionalData?: AdditionalData,
  ): string {
    let post = PostType.PI00.toString()
    if (
      accountType === PaymentMethod.BANKGIRO ||
      accountType === PaymentMethod.PLUSGIRO
    ) {
      post +=
        accountType === PaymentMethod.PLUSGIRO
          ? PaymentType.PLUSGIRO
          : PaymentType.BANKGIRO
      post = post.padEnd(11, ' ')
      post = addAndPad(post, payment.number!, ' ', 24, true)
      if (additionalData?.bookkeepingDate) {
        post += format(new Date(additionalData.bookkeepingDate), 'yyyyMMdd')
      } else if (accountType === PaymentMethod.BANKGIRO) {
        post += format(getBookkeepingDate(), 'yyyyMMdd')
      }
      post = post.padEnd(32, ' ')
      post += (payment.amount.amount * 100).toString().padStart(13, '0')
      if (additionalData?.ocr) {
        post = addAndPad(post, additionalData.ocr, ' ', 70)
      } else if (payment.reference) {
        post = addAndPad(post, payment.reference, ' ', 70)
      }
      post = post.padEnd(80, ' ')
    } else if (accountType === PaymentMethod.BANKACCOUNT) {
      post += PaymentType.ACCOUNT_DEPOSIT
      const clearingNumber =
        payment.recipientType === PaymentRecipientType.INDIVIDUAL
          ? '3300'
          : additionalData!.clearingNumber!
      post += clearingNumber.padEnd(5, ' ')
      post = addAndPad(post, payment.number!, ' ', 24, true)
      if (additionalData?.bookkeepingDate) {
        post += format(new Date(additionalData.bookkeepingDate), 'yyyyMMdd')
      }
      post = post.padEnd(32, ' ')
      post += (payment.amount.amount * 100).toString().padStart(13, '0')
      post = post.padEnd(65) // message would go here, 20 characters to Nordea, 12 to others.
      post = post.padEnd(80)
    } else if (accountType === PaymentMethod.IBAN) {
      throw new Error(
        `Recipients with IBAN numbers are not supported (for now): Claim ${payment.claimId}`,
      )
    } else {
      throw new Error(
        `Unsupported Account Type (Needs to be Bankgiro, Plusgiro or Account deposit): Claim ${payment.claimId}`,
      )
    }
    return post
  }

  createBA00(payment: PaymentOrderInformationFragment): string {
    let post = PostType.BA00.toString()
    post = post.padEnd(32, ' ')
    post = addAndPad(post, payment.member.memberId, ' ', 80, true)
    return post
  }
}

export type AdditionalPaymentData = Record<
  string,
  {
    clearingNumber?: string // TODO: implement
    noteToRecipient?: string // TODO: implement
    bookkeepingDate?: Date
  }
>

export interface TransformerArgs extends NonNullable<unknown> {
  senders: Record<string, PaymentSender>
  payments: PaymentOrderInformationFragment[]
  additionalData?: AdditionalPaymentData
}
export function generatePO3File({
  senders,
  payments,
  additionalData,
}: TransformerArgs): { blob: Blob; content: string } {
  const ordersByCarrier = payments.reduce(
    (acc, p) => {
      if (!acc?.[`${p?.carrier}`]) {
        acc[`${p.carrier}`] = [] as PaymentOrderInformationFragment[]
      }
      if (p?.carrier) acc[`${p.carrier}`].push(p)
      return acc
    },
    {} as Record<string, PaymentOrderInformationFragment[]>,
  )

  const result: string[] = []
  Object.keys(ordersByCarrier).forEach((carrier, i, arr) => {
    const builder = new PO3RecordBuilder()
    ordersByCarrier[carrier].forEach((p) => {
      validateOrder(
        p,
        ordersByCarrier[carrier][0]?.amount?.currency,
        additionalData?.[`${p.id}`],
      )
      const paymentInstruction = builder.createPI00(
        p.method as PaymentMethod,
        p,
        additionalData?.[`${p.id}`],
      )
      builder.appendRecord(paymentInstruction)
      const senderNotes = builder.createBA00(p)
      if (senderNotes) {
        builder.appendRecord(senderNotes)
      }
    })
    const res = builder.build(senders?.[`${carrier}`], ordersByCarrier[carrier])
    result.push(res)
    if (i !== arr.length - 1) {
      result.push('\n')
    }
  })

  return { blob: new Blob(result), content: result.join('\n') }
}

function cleanNumberString(s: string): string {
  if (s.match(/[a-zA-Z]/)) {
    throw new Error(`String ${s} contains letters`)
  }
  return s.replaceAll(/[^\d]/g, '')
}

function addAndPad(
  s1: string,
  s2: string,
  pad: string,
  length: number,
  clean?: boolean,
): string {
  const s = s1 + (clean ? cleanNumberString(s2) : s2)
  if (s.length > length)
    throw new Error(`String ${s} can't exceed length ${length}`)
  return s.padEnd(length, pad)
}

function validateOrder(
  order: PaymentOrderInformationFragment,
  currency: string,
  opt?: AdditionalData,
): void {
  if (
    !(
      order.method === PaymentMethod.BANKACCOUNT ||
      order.method === PaymentMethod.PLUSGIRO ||
      order.method === PaymentMethod.BANKGIRO
    )
  ) {
    throw new Error(
      'Unsupported payment method, only Bankgiro, Plusgiro and Bank account are supported',
    )
  }
  if (
    order.recipientType !== PaymentRecipientType.INDIVIDUAL &&
    order.method === PaymentMethod.BANKACCOUNT &&
    !opt?.clearingNumber
  ) {
    throw new Error(
      `Failed to provide Clearing number for claim: ${order.claimId}`,
    )
  }
  if (!order.number) throw new Error('Order number is missing')
  if (!order.method) throw new Error('Method is missing')
  if (!order.carrier) throw new Error('Carrier is missing')
  if (!order.amount) throw new Error('Amount is missing')
  if (order.amount.amount < 0) throw new Error('Negative amount is not allowed')
  if (order.amount.currency !== currency) {
    throw new Error('Currency mismatch')
  }
}

export function getBookkeepingDate(today?: Date): Date {
  let date = today || new Date()
  let counter = 0

  do {
    date = addBusinessDays(1)(date)
    counter++
  } while (isSwedishHoliday(date) && counter <= 7)

  return date
}
