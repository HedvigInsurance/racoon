import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import {
  extractErrorMessage,
  Flex,
  isPressing,
  Keys,
  Paragraph,
  Shadowed,
  TextArea,
  useDraft,
  usePlatform,
} from '@hedvig-ui'
import {
  Button,
  LegacyTooltip,
  PopupMenu,
  PopupMenuItem,
} from '@hedvig-ui/redesign'
import {
  GetMemberClaimsDocument,
  useCreateClaimMutation,
  useCreatePaymentCompletionLinkMutation,
  useSendMessageMutation,
} from 'types/generated/graphql'
import { useTemplatesHinting } from '@hope/features/template-messages/use-templates-hinting'
import { useTemplateMessages } from '@hope/features/template-messages/use-template-messages'
import { toast } from 'react-hot-toast'
import {
  CreditCard,
  FileText,
  GraphUpArrow,
  ShieldShaded,
  Tag,
  Telephone,
  TextareaResize,
  XSquare,
} from 'react-bootstrap-icons'
import chroma from 'chroma-js'
import copy from 'copy-to-clipboard'
import { ClaimSource } from '../../config/constants'
import { format } from 'date-fns'
import { useLocation, useNavigate } from 'react-router-dom'
import { ContractTerminationModal } from '@hope/features/contracts/ContractTerminationModal'
import { CreateQuotesModal } from '../../member/tabs/quote-tab/components/CreateQuotesModal'
import { CrossSellSelector } from '@hope/features/cross-sell/CrossSellSelector'
import { ContractSelector } from '../../contracts/ContractSelector'
import { ChatEventBus } from '@hope/features/chat/ChatEventBus'
import gql from 'graphql-tag'

const Container = styled.div`
  border-radius: 8px;
  margin: 0 1rem;
  margin-top: auto;
  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme.accentContrast};

  position: relative;
`

const ChatTextArea = styled(TextArea)`
  &&&& {
    position: relative;
    background: transparent;
    resize: none;
    border: none;
    border-radius: 8px 8px 0 0;
    min-height: 100px;
    transition: height 200ms;
  }
`

const TextAreaFooter = styled.div`
  position: relative;
  padding: 4px 15px;
  border-radius: 0 0 8px 8px;
  background: ${({ theme }) => theme.accentContrast};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;

  & span {
    margin-left: 0.25rem;
    line-height: 0;
    font-size: 12px;
  }

  & .divider {
    position: absolute;
    top: -1px;
    left: 15px;
    width: calc(100% - 30px);
    height: 1px;
    background: ${({ theme }) => theme.accentBackground};
  }
`

const Tip = styled(Paragraph)`
  font-size: 0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const HintContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px 8px 0 0;

  width: 100%;
  height: 80%;

  background: ${({ theme }) => theme.backgroundLight};

  word-wrap: break-word;

  padding: 11px 14px;

  z-index: 0;

  color: ${({ theme }) => theme.placeholderColor};
`

const HintText = styled.span`
  position: absolute;
  top: 1rem;
  left: 0.7rem;

  font-size: 14px;
  font-family: sans-serif;
  letter-spacing: normal;

  padding: 4px 5px;
  border-radius: 4px;

  background: ${({ theme }) => theme.accentBackground};
`

const ResizeButton = styled(TextareaResize)`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;

  z-index: 10;

  fill: ${({ theme }) => chroma(theme.semiStrongForeground).alpha(0.75).hex()};

  transition: fill 200ms;

  :hover {
    fill: ${({ theme }) => chroma(theme.semiStrongForeground).alpha(1).hex()};
  }

  width: 1.1rem;
  height: 1.1rem;

  cursor: pointer;
`

const TipWrapper = styled.div<{ show: boolean }>`
  padding: 1rem 1.25rem;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 200ms ease;
`

gql`
  mutation SendMessage($input: ConversationSendMessageInput!) {
    conversation_sendMessage(input: $input) {
      id
    }
  }
`

export const ChatInput: React.FC<{
  memberId: string
  conversationId: string
  onFocus?: () => void
  onBlur?: () => void
  slim?: boolean
}> = ({ memberId, conversationId, onFocus, onBlur, slim }) => {
  const [isLarge, setIsLarge] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const cursorRef = React.useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useDraft(memberId)
  const [inputFocused, setInputFocused] = useState(false)
  const [sendMessage, { loading: loadingSendMessage }] =
    useSendMessageMutation()
  const { isMetaKey, metaKey } = usePlatform()

  const [createPaymentCompletionLink, { loading: loadingPaymentsLink }] =
    useCreatePaymentCompletionLinkMutation({
      variables: { memberId },
    })
  const [createClaim, { loading: isCreatingClaim }] = useCreateClaimMutation()

  const { hinting, templateHint, onChange, onKeyDown, clearHinting } =
    useTemplatesHinting(message, setMessage, isMetaKey)
  const { show: showTemplates, selected, select } = useTemplateMessages()

  useEffect(() => {
    if (selected) {
      clearHinting()
      setMessage(selected)
      select('')
    }
  }, [select, selected, clearHinting, setMessage])

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e)

    setMessage(e.currentTarget.value)
  }

  const sendMessageWithRefetch = (message: string) =>
    toast.promise(
      sendMessage({
        variables: {
          input: {
            id: conversationId,
            text: message,
          },
        },
      }),
      {
        loading: 'Sending message',
        success: () => {
          ChatEventBus.notifyMessageSent(conversationId)
          setMessage('')
          return 'Message sent'
        },
        error: 'Could not send message',
      },
    )

  const appendChatLink = async (link: string) => {
    if (loadingSendMessage) return
    const newMessage =
      message && message !== '' ? `${message}\n${link} ` : `${link} `
    setMessage(newMessage)
    setTimeout(() => {
      cursorRef.current?.focus()
      cursorRef.current?.setSelectionRange(newMessage.length, newMessage.length)
    }, 30)
  }

  const handleSendMessage = async () => {
    if (loadingSendMessage || !message) return
    await sendMessageWithRefetch(message)
  }

  const handleOnKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    onKeyDown(e)

    if (isMetaKey(e) && isPressing(e, Keys.Enter) && !hinting) {
      await handleSendMessage()
      return
    }
  }

  const [showCrossSellPopup, setShowCrossSellPopup] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showClaimPopup, setShowClaimPopup] = useState(false)
  const [showAppLinksPopup, setShowAppLinksPopup] = useState(false)
  const [showAppLinksContractsPopup, setShowAppLinksContractsPopup] =
    useState(false)

  return (
    <Container>
      <div>
        <ResizeButton onClick={() => setIsLarge((prev) => !prev)} />
        <HintContainer>
          {hinting && (
            <HintText>
              {templateHint?.title ? `/${templateHint?.title}` : message}
            </HintText>
          )}
        </HintContainer>

        <ChatTextArea
          onFocus={() => {
            setInputFocused(true)
            onFocus?.()
          }}
          onBlur={() => {
            setInputFocused(false)
            onBlur?.()
          }}
          ref={cursorRef}
          placeholder={
            !hinting
              ? slim
                ? 'Message goes here '
                : `Message goes here or type '/' for templates`
              : ''
          }
          value={message}
          onChange={onChangeHandler}
          onKeyDown={handleOnKeyDown}
          style={{
            height: isLarge ? '20rem' : '8rem',
          }}
        />

        {!slim && (
          <TextAreaFooter>
            <div className="divider" />
            <Flex wrap="wrap">
              <PopupMenu
                target={
                  <LegacyTooltip content="Send link">
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => setShowCrossSellPopup(true)}
                    >
                      <GraphUpArrow />
                      Cross sell
                    </Button>
                  </LegacyTooltip>
                }
                position="topLeft"
                visible={showCrossSellPopup}
                onClose={() => setShowCrossSellPopup(false)}
              >
                <CrossSellSelector
                  memberId={memberId}
                  onSelect={(link) => {
                    appendChatLink(link)
                    setShowCrossSellPopup(false)
                  }}
                />
              </PopupMenu>

              <LegacyTooltip content="Create quote">
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => setShowQuoteModal(true)}
                >
                  <Tag />
                  Quote
                </Button>
              </LegacyTooltip>
              <CreateQuotesModal
                visible={showQuoteModal}
                onClose={() => setShowQuoteModal(false)}
                memberId={memberId}
              />

              <LegacyTooltip content="Terminate contracts">
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => setShowContractModal(true)}
                >
                  <XSquare />
                  Terminate
                </Button>
              </LegacyTooltip>
              <ContractTerminationModal
                visible={showContractModal}
                onClose={() => setShowContractModal(false)}
                memberId={memberId}
              />

              <LegacyTooltip content="Generate payments link">
                <Button
                  disabled={loadingPaymentsLink}
                  size="small"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault()
                    toast.promise(createPaymentCompletionLink(), {
                      loading: 'Generating payment link...',
                      success: ({ data: response }) => {
                        if (!response?.createPaymentCompletionLink?.url) {
                          return null
                        }

                        copy(response?.createPaymentCompletionLink?.url, {
                          format: 'text/plain',
                        })

                        return 'Payment link copied to clipboard'
                      },
                      error: 'Could not generate payment link',
                    })
                  }}
                >
                  <CreditCard /> Link
                </Button>
              </LegacyTooltip>

              <PopupMenu
                target={
                  <LegacyTooltip content="Create chat claim">
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => setShowClaimPopup(true)}
                    >
                      <ShieldShaded /> Claim
                    </Button>
                  </LegacyTooltip>
                }
                position="topLeft"
                visible={showClaimPopup}
                onClose={() => setShowClaimPopup(false)}
              >
                <PopupMenuItem
                  onClick={async () => {
                    if (isCreatingClaim) {
                      return
                    }
                    await toast.promise(
                      createClaim({
                        variables: {
                          memberId,
                          date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
                          source: ClaimSource.Chat,
                        },
                        refetchQueries: [
                          {
                            query: GetMemberClaimsDocument,
                            variables: { memberId },
                          },
                        ],
                      }),
                      {
                        loading: 'Creating claim',
                        success: ({ data }) => {
                          setShowClaimPopup(false)
                          const claimId = data?.createClaim?.id
                          if (!claimId)
                            return 'No claim found, navigate there yourself'
                          const params = new URLSearchParams(location.search)
                          params.delete('active')
                          const fullPath = `${
                            location.pathname
                          }?${params.toString()}`
                          navigate(
                            `${fullPath}&claimId=${claimId}&active=${claimId}`,
                          )
                          return 'Claim created'
                        },
                        error: ({ message }) => extractErrorMessage(message),
                      },
                    )
                  }}
                >
                  Create chat claim
                </PopupMenuItem>
                <PopupMenuItem onClick={() => setShowClaimPopup(false)}>
                  Cancel
                </PopupMenuItem>
              </PopupMenu>

              <LegacyTooltip content="Open templates">
                <Button onClick={showTemplates} size="small" variant="ghost">
                  <FileText /> Template
                </Button>
              </LegacyTooltip>

              <PopupMenu
                target={
                  <LegacyTooltip content="Send app link">
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => setShowAppLinksPopup(true)}
                    >
                      <Telephone /> App Links
                    </Button>
                  </LegacyTooltip>
                }
                position="topLeft"
                visible={showAppLinksPopup}
                onClose={() => setShowAppLinksPopup(false)}
              >
                <PopupMenu
                  target={
                    <LegacyTooltip content="Select contract">
                      <PopupMenuItem
                        onClick={() => setShowAppLinksContractsPopup(true)}
                      >
                        Contracts
                      </PopupMenuItem>
                    </LegacyTooltip>
                  }
                  position="right"
                  visible={showAppLinksContractsPopup}
                  onClose={() => setShowAppLinksContractsPopup(false)}
                >
                  <ContractSelector
                    memberId={memberId}
                    onSelect={(link) => {
                      appendChatLink(link)
                      setShowAppLinksContractsPopup(false)
                      setShowAppLinksPopup(false)
                    }}
                  />
                </PopupMenu>
                <PopupMenuItem
                  onClick={() => {
                    appendChatLink(
                      `${process.env.NEXT_PUBLIC_HEDVIG_APP}/payments`,
                    )
                    setShowAppLinksPopup(false)
                  }}
                >
                  Payments
                </PopupMenuItem>
              </PopupMenu>
            </Flex>
          </TextAreaFooter>
        )}
      </div>
      {slim && (
        <Flex justify="flex-end">
          <Button
            style={{ marginTop: '1rem', minWidth: '7.5rem' }}
            disabled={!message}
            onClick={() => handleSendMessage()}
          >
            Send
          </Button>
        </Flex>
      )}
      {!slim && (
        <TipWrapper show={inputFocused}>
          <Tip>
            <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Enter</Shadowed> to
            send
          </Tip>
        </TipWrapper>
      )}
    </Container>
  )
}
