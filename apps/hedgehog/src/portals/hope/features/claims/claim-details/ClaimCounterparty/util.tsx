import { RecoveryInvoice } from 'types/generated/graphql'
import { convertEnumToTitle, lightTheme } from '@hedvig-ui'

export const invoiceContentMarkup = (invoice: RecoveryInvoice) => `
        <div>
          <p style="margin:0">Invoice Number:
              <span style="color:${lightTheme.accent}">${
                invoice.invoiceNumber
              }</span>
          </p>
          <p style="margin:0">Our reference: 
              <span style="color:${lightTheme.accent}">${
                invoice.memberReference
              }</span>
          </p>
          <p style="margin:0">Your reference: 
              <span style="color:${lightTheme.accent}">${
                invoice.counterparty.reference
              }</span>
          </p>
        </div>
        
        <div style="margin-top:1rem">
          <p style="margin:0">Claim case happened on 
            <span style="color:${lightTheme.accent}">${
              invoice.dateOfOccurrence
            }</span>
          </p>
          <p style="margin:0">Paying party: 
            <span style="color:${lightTheme.accent}">${
              invoice.counterparty.insuranceProvider?.displayName
            }</span>
          </p>
        </div>
        
        <div style="margin-top:1rem">
          <p style="margin:0">We ask you to process our claim of 
            <span style="color:${lightTheme.accent}">${
              invoice.amount.amount
            } ${invoice.amount.currency}
  </span> regarding our expenses in the incident.
          </p>
        </div>

        <div style="margin-top:1rem">
          ${invoice.recoveryData
            .map(
              (data) => `
            <p style="margin: 0;">${convertEnumToTitle(
              data.claimType,
            )}:<span style="color:${lightTheme.accent}"> ${
              data.amount.amount
            } ${data.amount.currency}</span></p>`,
            )
            .join('')}
        </div>

        <div style="margin-top:1rem">
          <p style="margin:0">Total: 
            <span style="color:${lightTheme.accent}">
                ${invoice.recoveryData.reduce(
                  (acc, data) => acc + data.amount.amount,
                  0,
                )} ${invoice.amount.currency}
            </span>
          </p>
        </div>

        <div style="margin-top:1rem">
          <p style="margin:0">
            The amount can be deposited in our:
          </p>
          <p style="margin:0">Bank Giro: 
            <span style="color:${lightTheme.accent}">${
              invoice.bankgiroNumber
            }</span></p>
            <p>Bank Account: 
            <span style="color:${lightTheme.accent}">${
              invoice.bankAccountNumber
            }</span></p>
          <p style="margin:0"> Enter invoice number 
            <span style="color:${lightTheme.accent}">${
              invoice.invoiceNumber
            }</span> 
            as a reference for the payment.
          </p>
          <p style="margin:0">
            Payment must be received by us no later than 
            <span style="color:${lightTheme.accent}">${
              invoice.paymentDueDate
            }</span>.
          </p>
        </div>`
