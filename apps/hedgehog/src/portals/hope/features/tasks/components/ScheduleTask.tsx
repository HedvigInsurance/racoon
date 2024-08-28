import { useState } from 'react'
import * as React from 'react'
import {
  Button,
  Checkbox,
  convertEmailToName,
  DateTimePicker,
  Flex,
  formatDistanceWithAccuracy,
  InfoTag,
  Label,
  Modal,
  ModalProps,
  Paragraph,
  SecondLevelHeadline,
  Spacing,
  TextArea,
} from '@hedvig-ui'
import { FieldValues, useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { Market, MarketFlags } from '../../config/constants'
import { TaskResourceAreaIcon } from '@hope/features/tasks/constants'
import {
  TaskFragment,
  TaskResourceArea,
  TaskResourceType,
} from 'types/generated/graphql'
import { useCreateTask } from '@hope/features/tasks/hooks/use-create-task'
import { useRadioGroup } from '@hope/common/hooks/use-radio-group'
import { addMinutes, isWeekend, parseISO } from 'date-fns'
import { useUsers } from '@hope/features/user/hooks/use-users'
import { useMe } from '@hope/features/user/hooks/use-me'
import { useResolveTask } from '@hope/features/tasks/hooks/use-resolve-task'
import toast from 'react-hot-toast'
import { CheckCircle } from 'react-bootstrap-icons'
import { Dropdown } from '@hedvig-ui/redesign'

const Form = styled.form`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 25rem;
`

export const ScheduleTaskForm: React.FC<{
  memberId: string
  resourceId: string
  market: Market
  title: string
  area: TaskResourceArea | null
  resourceType: TaskResourceType
  currentTaskId: string | null
  conversationId: string | null
  claimId: string | null
  onSubmit: () => void
  onResolve?: () => void
}> = ({
  memberId,
  resourceId,
  market,
  title,
  area,
  resourceType,
  currentTaskId,
  conversationId,
  claimId,
  onSubmit,
  onResolve,
}) => {
  const [assignableTo, setAssignableTo] = useState<string | null>(null)
  const { resolve } = useResolveTask()
  const [resolveTask, setResolveTask] = useState(true)
  const { me } = useMe()
  const { register, watch, handleSubmit } = useForm()
  const [customDate, setCustomDate] = useState<Date>(addMinutes(new Date(), 60))
  const { users } = useUsers()
  const { createScheduledTask } = useCreateTask()

  const { value: assignableFromDay, component: TimingRadioButtonGroup } =
    useRadioGroup<'TOMORROW' | 'MONDAY' | null>({
      initialValue: isWeekend(new Date()) ? 'MONDAY' : 'TOMORROW',
      label: 'When?',
      options: [
        {
          text: 'Tomorrow',
          value: 'TOMORROW',
        },
        {
          text: 'Next week',
          value: 'MONDAY',
        },
        {
          text: 'Custom',
          value: null,
        },
      ],
    })
  const submitHandler = async ({ note }: FieldValues) => {
    const assignableFrom = assignableFromDay ?? customDate
    if (!assignableFrom) return
    await createScheduledTask(
      memberId,
      resourceId,
      market,
      title,
      area,
      resourceType,
      assignableFrom,
      assignableTo,
      note,
      conversationId,
      claimId,
    )
    if (currentTaskId && resolveTask) {
      await resolve(currentTaskId)
      onResolve?.()
    }
    onSubmit?.()
  }

  const [dropdownRevision, setDropdownRevision] = useState(0)

  return (
    <Form onSubmit={handleSubmit(submitHandler)}>
      <>
        <SecondLevelHeadline>
          {area && TaskResourceAreaIcon[area]} Schedule task
        </SecondLevelHeadline>
        <Paragraph>
          {MarketFlags[market]} {title}
        </Paragraph>
        <TimingRadioButtonGroup />
        {!assignableFromDay && (
          <DateTimePicker
            date={customDate}
            setDate={(date) => setCustomDate(date)}
            minDate={new Date()}
            showTimePicker
          />
        )}
        <TextArea required label="Note*" {...register('note')} />
        <div>
          <Label>
            <Flex justify="space-between" align="center">
              Who? (Optional){' '}
              <InfoTag
                style={{ cursor: 'pointer' }}
                status="info"
                onClick={() => {
                  setAssignableTo(me.email)
                  setDropdownRevision((current) => current + 1)
                }}
              >
                Quick select
              </InfoTag>
            </Flex>
          </Label>
          <Dropdown
            key={dropdownRevision}
            searchable
            options={users
              .filter((user) => user.role === 'IEX' || user.email === me.email)
              .map((user) => ({
                value: user.email,
                label: user.fullName,
                selected: user.email === assignableTo,
                action: () => {
                  setAssignableTo((current) =>
                    current === user.email ? null : user.email,
                  )
                },
              }))}
          />
        </div>
        {currentTaskId && (
          <Checkbox
            label="Resolve current task?"
            checked={resolveTask}
            onChange={() => setResolveTask((current) => !current)}
          />
        )}
        <Button disabled={!watch('note')}>Schedule</Button>
      </>
    </Form>
  )
}

export const ScheduleTaskModal = ({
  visible,
  onClose,
  scheduledTasks,
  memberId,
  resourceId,
  market,
  title,
  area,
  resourceType,
  conversationId,
  claimId,
}: {
  scheduledTasks: TaskFragment[]
  memberId: string
  resourceId: string
  market: string
  title: string
  resourceType: TaskResourceType
  area: TaskResourceArea | null
  conversationId: string | null
  claimId: string | null
} & ModalProps) => {
  const { resolve } = useResolveTask()
  return (
    <Modal visible={visible} onClose={onClose}>
      <Spacing
        left="small"
        right="small"
        top="small"
        style={{ width: '35rem' }}
      >
        <Flex direction="column" gap="small">
          {scheduledTasks.map((task) => {
            return (
              <Flex
                key={task.id}
                justify="space-between"
                align="center"
                gap="small"
              >
                <div>
                  {task.area ? TaskResourceAreaIcon[task.area] : '📬'}{' '}
                  <span
                    style={
                      task.resolvedAt ? { textDecoration: 'line-through' } : {}
                    }
                  >
                    {task.description}
                  </span>
                </div>
                <div style={{ textAlign: 'right', width: '15rem' }}>
                  {!task.resolvedAt ? (
                    <>
                      {formatDistanceWithAccuracy(
                        parseISO(task.assignableFrom),
                      )}
                      <Button
                        variant="tertiary"
                        onClick={async (e) => {
                          e.stopPropagation()
                          await resolve(task.id)
                          onClose()
                        }}
                        icon={<CheckCircle />}
                      />
                    </>
                  ) : (
                    <>
                      {formatDistanceWithAccuracy(parseISO(task.resolvedAt))}
                      <br />
                      {task.resolvedBy && (
                        <sub>by {convertEmailToName(task.resolvedBy)}</sub>
                      )}
                    </>
                  )}
                </div>
              </Flex>
            )
          })}
        </Flex>
      </Spacing>
      <ScheduleTaskForm
        memberId={memberId}
        resourceId={resourceId}
        market={market as Market}
        title={title}
        resourceType={resourceType}
        area={area}
        currentTaskId={null}
        onSubmit={() => {
          toast.success('Task scheduled')
          onClose()
        }}
        conversationId={conversationId}
        claimId={claimId}
      />
    </Modal>
  )
}
