import { convertEnumToTitle } from '@hedvig-ui'
import {
  Button,
  Dialog,
  Div,
  Dropdown,
  DropdownMenu,
  Flex,
  Grid,
  Input,
} from '@hedvig-ui/redesign'
import { theme } from '@hedvig-ui/redesign/theme'
import { Market } from '@hope/features/config/constants'
import { useState } from 'react'
import { Task, TaskResourceType } from 'types/generated/graphql'
import { ScheduleTaskForm } from './ScheduleTask'
import { UseMoveTaskToQueue } from '../hooks/use-move-task-to-queue'
import {
  APPLICABLE_TASK_AREAS,
  APPLICABLE_TASK_TYPES,
  TaskResourceAreaIcon,
  TaskResourceAreaName,
} from '../constants'

type Props = {
  task: Task
  onMove?: () => void
}

function MenuItem(props: Props) {
  const { task, onMove } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newResourceType, setNewResourceType] = useState(task.resourceType)
  const [newResourceArea, setNewResourceArea] = useState(task.area ?? undefined)
  const [moveNote, setMoveNote] = useState('')
  const [creatingScheduledTask, setCreatingScheduledTask] = useState(false)
  const { moveToQueue } = UseMoveTaskToQueue(props.task, {
    onMoved: props.onMove,
  })

  const typeOptions = APPLICABLE_TASK_TYPES[task.resourceType].map((type) => ({
    label: convertEnumToTitle(type),
    value: type,
    selected: type === newResourceType,
    action: () => setNewResourceType(type),
  }))

  const areaOptions = APPLICABLE_TASK_AREAS[newResourceType].map((area) => ({
    label: `${TaskResourceAreaIcon[area]} ${TaskResourceAreaName[area]}`,
    value: area,
    selected: area === newResourceArea,
    action: () => setNewResourceArea(area),
  }))

  const areaIsApplicable = areaOptions.some(
    ({ value }) => value === newResourceArea,
  )

  const moveHandler = () => {
    if (!newResourceType || !newResourceArea || !areaIsApplicable) {
      return
    }
    moveToQueue(newResourceArea, newResourceType, moveNote)
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger asChild>
        <span>
          <DropdownMenu.Item
            onClick={(e) => {
              e.preventDefault()
              setIsModalOpen(true)
            }}
          >
            Move to queue
          </DropdownMenu.Item>
        </span>
      </Dialog.Trigger>
      <Dialog.Content>
        <Div p="lg" style={{ minWidth: '500px', height: '50vh' }}>
          <Grid gap="md">
            <h2 style={{ marginBottom: theme.space.sm }}>
              Select type and area
            </h2>
            <Dropdown
              label="Type"
              options={typeOptions}
              disabled={typeOptions.length <= 1}
            />
            <div>
              <Dropdown
                label="Area"
                options={areaOptions}
                disabled={areaOptions.length <= 1}
              />
              {!areaIsApplicable && (
                <Div px="xs" style={{ color: theme.colors.signalRedText }}>
                  Select applicable area
                </Div>
              )}
            </div>
            <Input
              label="Note"
              value={moveNote}
              onChange={(e) => setMoveNote(e.target.value)}
            />
            <Flex justify="space-between" gap="sm">
              <Button onClick={moveHandler} disabled={!areaIsApplicable}>
                Move
              </Button>

              <Flex gap="sm">
                <Dialog.Root
                  open={creatingScheduledTask}
                  onOpenChange={setCreatingScheduledTask}
                >
                  <Dialog.Trigger asChild>
                    <Button
                      variant="secondary"
                      disabled={!areaIsApplicable}
                      onClick={(e) => {
                        e.preventDefault()
                        setCreatingScheduledTask(true)
                      }}
                    >
                      Schedule
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    {areaIsApplicable && (
                      <ScheduleTaskForm
                        memberId={task.memberId!}
                        resourceId={task.resourceId}
                        market={task.market as Market}
                        title={task.title!}
                        resourceType={newResourceType}
                        area={newResourceArea!}
                        currentTaskId={task.id}
                        conversationId={task.conversationId ?? null}
                        claimId={
                          [
                            TaskResourceType.Claim,
                            TaskResourceType.NewClaim,
                            TaskResourceType.StaleClaim,
                          ].includes(newResourceType)
                            ? (task.claimId ?? null)
                            : null
                        }
                        onSubmit={() => setCreatingScheduledTask(false)}
                        onResolve={() => onMove?.()}
                      />
                    )}
                  </Dialog.Content>
                </Dialog.Root>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </Grid>
        </Div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const MoveToQueue = {
  MenuItem,
}
