import {
  Button,
  Card,
  Dialog,
  DropdownInput,
  Flex,
  Input,
} from '@hedvig-ui/redesign'
import { Message } from '../../messages/components/Message/Message'
import toast from 'react-hot-toast'
import {
  TaskResourceType,
  useForwardMessagesMutation,
} from 'types/generated/graphql'
import { FormEvent } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { ConversationState } from '../../ConversationState'
import { extractErrorMessage } from '@hedvig-ui'
import { css } from './ForwardConversation.css'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import clsx from 'clsx'
import {
  APPLICABLE_TASK_AREAS,
  TaskResourceAreaIcon,
  TaskResourceAreaName,
} from '@hope/features/tasks/constants'
import { useChat } from '@hope/features/chat/ChatContext'

export function ForwardConversation() {
  const { activeConversation } = useChat()
  const setIsForwardingActive = useSetAtom(
    ConversationState.isForwardingActiveAtom,
  )
  const [messagesToForward, setMessagesToForward] = useAtom(
    ConversationState.messagesToForwardAtom,
  )

  const [forwardMessagesMutation, { loading: isForwarding }] =
    useForwardMessagesMutation()

  async function forwardMessages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const taskArea = formData.get('area')!.toString()
    const note = formData.get('note')?.toString() ?? undefined

    await toast.promise(
      forwardMessagesMutation({
        variables: {
          input: {
            fromConversationId: activeConversation!.id,
            toConversationId: undefined,
            messageIds: messagesToForward.map(({ id }) => id),
            note,
            taskArea,
          },
        },
      }),
      {
        loading: 'Forwarding',
        success: () => {
          setIsForwardingActive(false)
          setMessagesToForward([])
          return 'Messages forwarded to new conversation'
        },
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const areaOptions = APPLICABLE_TASK_AREAS[TaskResourceType.Question].map(
    (area) => ({
      label: `${TaskResourceAreaIcon[area]} ${TaskResourceAreaName[area]}`,
      value: area,
    }),
  )

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="large" disabled={messagesToForward.length === 0}>
          Forward messages
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <form onSubmit={forwardMessages} className={css.form}>
          <Flex direction="column" gap="xs">
            <Dialog.Title>Forward messages</Dialog.Title>
            <Dialog.Description
              className={clsx(cssUtil.textMuted, cssUtil.textSmaller)}
            >
              Create a new task by forwarding messages to a new conversation
            </Dialog.Description>
          </Flex>

          <DropdownInput label={'Area'} name={'area'} options={areaOptions} />

          <Flex direction="column" gap="xs">
            <p>Messages transferred to new conversation</p>
            <Card variant="secondary" className={css.listContainer}>
              {messagesToForward
                .toSorted((a, b) => a.timestamp.localeCompare(b.timestamp))
                .map((message) => (
                  <Message key={message.id} message={message} />
                ))}
            </Card>
          </Flex>

          <Input name="note" label="Internal note" />

          <Flex justify="flex-end" gap="sm">
            <Dialog.Close asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Dialog.Close>
            <Button disabled={isForwarding}>Forward messages</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
