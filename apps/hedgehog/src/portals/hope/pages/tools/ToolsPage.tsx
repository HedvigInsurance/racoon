import * as React from 'react'
import styled from '@emotion/styled'
import { CardLink, FadeIn, MainHeadline, useTitle } from '@hedvig-ui'
import { HopeAuthGuard, hopeAuthPermissions } from 'auth'

const ToolsCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 0 4rem 4rem 0;
`

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

const Card = styled(CardLink)`
  width: 100%;
  position: relative;
  padding: 2rem;
  margin: 0;
`

const Wrapper = styled.div`
  padding: 2rem;
`

const stagingToolsAvailable = () => {
  return process.env.NEXT_PUBLIC_STAGING_TOOLS_ENABLED === 'true'
}

const StagingTools: React.FC = () => {
  return (
    <>
      <MainHeadline>Staging specific tools</MainHeadline>
      <ToolsCardsWrapper>
        <Card href="/tools/unsign-member">
          <Icon>✍️</Icon>
          Unsign member
        </Card>

        <Card href="/tools/impersonate-member">
          <Icon>🕵️</Icon>
          Impersonate member
        </Card>
      </ToolsCardsWrapper>
    </>
  )
}

const ToolsPage: React.FC = () => {
  useTitle('Tools')

  return (
    <FadeIn>
      <Wrapper>
        <ToolsCardsWrapper>
          <Card href="/tools/payment-orders">
            <Icon>🏦</Icon>
            Payment Orders
          </Card>
          <Card href="/tools/valuation-tables">
            <Icon>💸</Icon>
            Item Valuation Tables
          </Card>
          <Card href="/tools/switching">
            <Icon>🏡</Icon>
            Switching
          </Card>
          <Card href="/tools/perils-editor">
            <Icon>📝</Icon>
            Perils Editor
          </Card>
          <Card href="/tools/campaign-codes">
            <Icon>💵</Icon>
            Campaign Codes
          </Card>
          <Card href="/tools/claim-types">
            <Icon>🧠</Icon>
            Claim Types
          </Card>
          <Card href="/tools/template-messages">
            <Icon>📋</Icon>
            Template Messages
          </Card>
          <Card href="/tools/auth-admin">
            <Icon>🔐</Icon>
            Auth Admin
          </Card>
          <Card href="/tools/gsr-case-officers">
            <Icon>👮</Icon>
            GSR Case Officers
          </Card>
          <Card href="/tools/create-lead">
            <Icon>💼</Icon>
            Create lead
          </Card>
          <Card href="/tools/item-models">
            <Icon>📱</Icon>
            Item models
          </Card>
          <Card href="/tools/batch-upload-payment-orders">
            <Icon>⤴️</Icon>
            Batch upload payment orders
          </Card>
          <Card href="/tools/create-manypets-offer-links">
            <Icon>🐈</Icon>ManyPets
          </Card>
          <Card href="/tools/manual-sas-payout">
            <Icon>✈️</Icon>Manual SAS payout
          </Card>
          <Card href="/tools/shop-session">
            <Icon>🛒</Icon>Shop Session
          </Card>
          <HopeAuthGuard
            requires={hopeAuthPermissions['back-office']['users:manage']}
            noAccessContent={null}
          >
            <Card href="/tools/user-panel">
              <Icon>👩‍💼👨‍💼</Icon>User Panel
            </Card>
          </HopeAuthGuard>
        </ToolsCardsWrapper>

        {stagingToolsAvailable() && <StagingTools />}
      </Wrapper>
    </FadeIn>
  )
}

export default ToolsPage
