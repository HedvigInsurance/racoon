import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { EntrypointFragment } from 'types/generated/graphql'
import { LOCALES } from '../constants'
import { Button, Flex, InfoTag, Popover, useConfirmDialog } from '@hedvig-ui'
import { PencilFill, Lock, Unlock } from 'react-bootstrap-icons'
import { useEntrypoints } from '../hooks'

export const EntrypointListEntry = ({
  entrypoint,
}: {
  entrypoint: EntrypointFragment
}) => {
  const {
    createEntrypoint,
    isCreatingEntrypoint,
    selectedEntrypoint,
    setSelectedEntrypointId,
  } = useEntrypoints()

  const isSelected = selectedEntrypoint?.id === entrypoint.id
  const [isHoveringUnlock, setIsHoveringUnlock] = useState(false)

  const { confirm } = useConfirmDialog()
  return (
    <>
      <span
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          opacity: 1,
        }}
      >
        {entrypoint.removedAt ? (
          <Popover
            contents={`This entrypoint is not active\nClick to activate`}
          >
            <Button
              size="small"
              onMouseEnter={() => setIsHoveringUnlock(true)}
              onMouseLeave={() => setIsHoveringUnlock(false)}
              status={isHoveringUnlock ? 'success' : 'danger'}
              icon={isHoveringUnlock ? <Unlock /> : <Lock />}
              onClick={() =>
                confirm('This will activate the entrypoint').then(() =>
                  createEntrypoint({
                    displayName: entrypoint.displayName,
                    acceptLanguage: entrypoint.acceptLanguage,
                  }).then(() => setSelectedEntrypointId(entrypoint.id)),
                )
              }
              disabled={isCreatingEntrypoint}
            />
          </Popover>
        ) : (
          <Button
            size="small"
            variant={isSelected ? 'secondary' : 'tertiary'}
            icon={<PencilFill />}
            onClick={() => setSelectedEntrypointId(entrypoint.id)}
          />
        )}
      </span>
      <span>{entrypoint.displayName}</span>
      <span>
        {LOCALES.find(({ value }) => value === entrypoint.acceptLanguage)?.text}
      </span>
      <span>
        <Flex wrap="wrap" gap="tiny">
          {entrypoint.keywords.map((keyword) => (
            <InfoTag status="info" key={keyword}>
              {keyword}
            </InfoTag>
          ))}
        </Flex>
      </span>
      <span>
        {format(parseISO(entrypoint.createdAt), 'dd MMMM YYY, HH:mm')}
      </span>
    </>
  )
}
