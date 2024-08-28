import { Button, Input, MainHeadline, Spacing, useTitle } from '@hedvig-ui'
import { useState } from 'react'
import * as React from 'react'
import QRCode from 'react-qr-code'
import { useCreateMemberAuthorizationCodeMutation } from 'types/generated/graphql'
import copy from 'copy-to-clipboard'
import { toast } from 'react-hot-toast'
import styled from '@emotion/styled'
import {
  grantWithAuthorizationCode,
  grantWithRefreshToken,
} from 'auth/auth.api'

const Wrapper = styled.div`
  padding: 2rem;
`

const HoverSpan = styled.span`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const ImpersonateMemberPage: React.FC = () => {
  useTitle('Impersonate Member')
  const [memberId, setMemberId] = useState('')
  const [
    createAuthorizationCode,
    { loading: authorizationCodeLoading, data: authorizationCodeData },
  ] = useCreateMemberAuthorizationCodeMutation()
  const authorizationCode =
    authorizationCodeData?.auth_createMemberAuthorizationCode?.authorizationCode
  const deepLinkCode = `hedvigengineering://impersonate?authorizationCode=${authorizationCode}`
  const [authorizationToken, setAuthorizationToken] = useState<string | null>(
    null,
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  return (
    <Wrapper>
      <MainHeadline>Impersonate member</MainHeadline>
      <Input
        value={memberId}
        onChange={({ target: { value } }) => {
          setMemberId(value)
        }}
        placeholder="Member ID"
        style={{ width: '300 px' }}
      />

      <Spacing top="small" />

      <div>
        <Button
          variant="primary"
          disabled={authorizationCodeLoading || !memberId}
          onClick={() => {
            createAuthorizationCode({
              variables: {
                memberId,
              },
            })
          }}
        >
          Impersonate
        </Button>
      </div>
      {!!authorizationCode && (
        <>
          {!authorizationToken ? (
            <>
              <Spacing top="small" />
              Impersonation successful - scan the following QR-Code to
              impersonate:
              <Spacing top="small" />
              <QRCode value={deepLinkCode} />
              <Spacing top="small" />
              <HoverSpan
                onClick={() => {
                  copy(deepLinkCode)
                  toast.success(`Code copied to clipboard: ${deepLinkCode}`)
                }}
              >
                Android: {deepLinkCode}
              </HoverSpan>
              <Spacing top="small" />
              <HoverSpan
                onClick={() => {
                  copy(authorizationCode)
                  toast.success('Code copied to clipboard')
                }}
              >
                iOS: {authorizationCode}
              </HoverSpan>
              <div>
                Insomnia/GraphiQL/Apollo Explorer/curl:
                <Button
                  style={{ margin: '2rem 0 0 2rem' }}
                  onClick={() =>
                    toast.promise(
                      grantWithAuthorizationCode(authorizationCode),
                      {
                        loading: 'Generating token',
                        success: ({ access_token, refresh_token }) => {
                          setAuthorizationToken(access_token)
                          setRefreshToken(refresh_token)
                          copy(access_token)
                          return 'Generated token copied to clipboard'
                        },
                        error: 'Could not generate token',
                      },
                    )
                  }
                >
                  Generate token
                </Button>
              </div>
            </>
          ) : (
            <div>
              <Button
                variant="secondary"
                style={{ marginTop: '2rem' }}
                onClick={() => {
                  if (!refreshToken) {
                    return toast.error('No refresh token available')
                  }
                  toast.promise(grantWithRefreshToken(refreshToken), {
                    loading: 'Refreshing token',
                    success: ({ access_token, refresh_token }) => {
                      setAuthorizationToken(access_token)
                      setRefreshToken(refresh_token)
                      copy(access_token)
                      return 'Refreshed token copied to clipboard'
                    },
                    error: 'Could not refresh token',
                  })
                }}
              >
                Refresh token
              </Button>
            </div>
          )}
        </>
      )}
    </Wrapper>
  )
}

export default ImpersonateMemberPage
