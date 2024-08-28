import { ComponentProps, useState } from 'react'
import { TagFragment } from 'types/generated/graphql'
import { convertEnumToTitle, Modal, ModalProps, TextArea } from '@hedvig-ui'
import { Button, Flex, LegacyTooltip } from '@hedvig-ui/redesign'
import { useTag } from '@hope/features/tags/hooks/use-tag'
import { TagColor, TagValue } from '../../../config/constants'
import { PlusIcon, XIcon } from '@hedvig-ui/icons'
import { theme } from '@hedvig-ui/redesign/theme'
import * as css from './Tags.css'

export const TagsNew: React.FC<{ resourceId: string; tags: TagFragment[] }> = ({
  resourceId,
  tags,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [current, setCurrent] = useState<TagFragment | undefined>(undefined)
  return (
    <>
      <Flex gap="xs">
        {tags.map((tag) => {
          return (
            <LegacyTooltip key={tag.id} content={tag.note}>
              <Tag
                active={true}
                value={tag.value as TagValue}
                onClick={() => {
                  setCurrent(tag)
                  setShowModal(true)
                }}
              >
                {convertEnumToTitle(tag.value)}
              </Tag>
            </LegacyTooltip>
          )
        })}
        <Tag active={false} onClick={() => setShowModal((current) => !current)}>
          <PlusIcon /> New tag
        </Tag>
      </Flex>

      <TagModal
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          setCurrent(undefined)
        }}
        resourceId={resourceId}
        tag={current}
        currentTags={tags}
      />
    </>
  )
}

type TagModalProps = {
  resourceId: string
  tag?: TagFragment
  currentTags: TagFragment[]
} & ModalProps

const TagModal = (props: TagModalProps) => {
  const { resourceId, tag, currentTags, ...modalProps } = props

  const tagOptions = Object.values(TagValue).filter(
    (tagValue) => !currentTags.find(({ value }) => value === tagValue),
  )

  const [value, setValue] = useState<TagValue | undefined>(
    tag?.value as TagValue | undefined,
  )
  const [note, setNote] = useState(tag?.note ?? '')
  const { upsertTag, removeTag } = useTag(resourceId)

  // useEffect(() => {
  //   if (tag?.note) {
  //     setNote(tag.note)
  //   }
  // }, [tag?.note])

  return (
    <Modal className={css.modal} {...modalProps}>
      <Flex direction="column" gap="small">
        {tag ? (
          <div>
            <Tag active={true} value={tag.value as TagValue}>
              <Flex gap="tiny" align="center">
                {convertEnumToTitle(tag.value)}
                <XIcon onClick={() => removeTag(tag.value)} />
              </Flex>
            </Tag>
          </div>
        ) : (
          <Flex wrap="wrap" gap="xs">
            {tagOptions.map((option) => (
              <Tag
                key={option}
                active={value === option}
                value={option}
                onClick={() => setValue(option)}
              >
                {convertEnumToTitle(option)}
              </Tag>
            ))}
          </Flex>
        )}

        <TextArea
          className={css.textArea}
          value={note}
          onChange={({ currentTarget: { value } }) => setNote(value)}
        />

        <Flex justify="flex-end">
          <Button
            disabled={!value}
            onClick={() => {
              value && upsertTag(value, note)
            }}
          >
            {tag ? 'Update' : 'Create'}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

const Tag = ({
  active,
  value,
  ...divProps
}: { active: boolean; value?: TagValue } & ComponentProps<'div'>) => {
  if (active && value) {
    return (
      <div
        className={css.tag}
        style={{ backgroundColor: TagColor[value], color: theme.colors.white }}
        {...divProps}
      />
    )
  }

  return <div className={css.tag} {...divProps} />
}
