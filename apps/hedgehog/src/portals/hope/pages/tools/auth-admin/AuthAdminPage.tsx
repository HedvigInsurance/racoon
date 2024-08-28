import styled from '@emotion/styled'
import { Flex, MainHeadline, Tabs } from '@hedvig-ui'
import { AuthApplicationTable } from '@hope/pages/tools/auth-admin/components/AuthApplicationTable'
import { CreateAuthApplication } from '@hope/pages/tools/auth-admin/components/CreateAuthApplication'
import { ManageAuthGroups } from '@hope/pages/tools/auth-admin/components/ManageAuthGroups'
import { useState } from 'react'
import * as React from 'react'
import { AuthAdminProvider } from './hooks/use-auth-admin'

const Wrapper = styled.div`
  padding: 2rem;
`

const Applications = styled.div`
  width: fit-content;
`

enum Tab {
  Groups = 'Groups',
  Applications = 'Applications',
}

const AuthAdminPage: React.FC = () => {
  const [current, setCurrent] = useState<Tab>(Tab.Groups)
  return (
    <AuthAdminProvider>
      <Wrapper>
        <Tabs
          style={{ width: '20rem', marginBottom: '2rem' }}
          list={Object.values(Tab).map((tab) => ({
            title: tab,
            action: () => setCurrent(tab),
            active: current === tab,
          }))}
        />
        {current === 'Groups' && <ManageAuthGroups />}
        {current === 'Applications' && (
          <Applications>
            <Flex justify="space-between">
              <MainHeadline>Applications</MainHeadline>
              <CreateAuthApplication />
            </Flex>
            <AuthApplicationTable />
          </Applications>
        )}
      </Wrapper>
    </AuthAdminProvider>
  )
}

export default AuthAdminPage
