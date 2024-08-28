import * as React from 'react'
import { useState } from 'react'
import { TagFragment } from 'types/generated/graphql'
import {
  Button,
  convertEnumToTitle,
  Modal,
  Popover,
  TextArea,
} from '@hedvig-ui'
import { useTag } from '@hope/features/tags/hooks/use-tag'
import styled from '@emotion/styled'
import { TagColor, TagValue } from '../config/constants'

const Tag = styled.div<{ value?: TagValue; active: boolean }>`
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem 0.25rem 0;
  border-radius: 0.5rem;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  ${({ value, active }) =>
    active && value
      ? `background-color: ${TagColor[value]}; color: white;`
      : ''}
`

export const Tags: React.FC<{ resourceId: string; tags: TagFragment[] }> = ({
  resourceId,
  tags,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [current, setCurrent] = useState<TagFragment | undefined>(undefined)
  return (
    <div>
      {tags.map((tag) => {
        return (
          <Popover key={tag.id} contents={tag.note} position="bottom">
            <Tag
              value={tag.value as TagValue}
              active={true}
              onClick={() => {
                setCurrent(tag)
                setShowModal(true)
              }}
            >
              {convertEnumToTitle(tag.value)}
            </Tag>
          </Popover>
        )
      })}
      <Tag active={false} onClick={() => setShowModal((current) => !current)}>
        +
      </Tag>
      <Modal
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          setCurrent(undefined)
        }}
      >
        <TagModal resourceId={resourceId} tag={current} currentTags={tags} />
      </Modal>
    </div>
  )
}

const TagModal: React.FC<{
  resourceId: string
  tag?: TagFragment
  currentTags: TagFragment[]
}> = ({ resourceId, tag, currentTags }) => {
  const currentTagValues = currentTags.map((current) => current.value)
  const [value, setValue] = useState<TagValue | undefined>(
    tag?.value as TagValue | undefined,
  )
  const [note, setNote] = useState(tag?.note ?? '')
  const { upsertTag, removeTag } = useTag(resourceId)
  return (
    <div style={{ width: '40rem', padding: '0.75rem' }}>
      {!tag ? (
        <div>
          {Object.values(TagValue)
            .filter((tagValue) => !currentTagValues.includes(tagValue))
            .map((tagValue) => (
              <Tag
                key={tagValue}
                value={tagValue}
                active={value === tagValue}
                onClick={() => setValue(tagValue)}
              >
                {convertEnumToTitle(tagValue)}
              </Tag>
            ))}
        </div>
      ) : (
        <Tag value={tag.value as TagValue} active={true}>
          {convertEnumToTitle(tag.value)}
          <span
            onClick={() => removeTag(tag.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            ⛌
          </span>
        </Tag>
      )}
      <TextArea
        value={note}
        style={{ height: '20rem' }}
        wrapperStyle={{ height: '100%', padding: '0.5rem' }}
        onChange={({ currentTarget: { value } }) => setNote(value)}
      />
      <Button
        disabled={!value}
        onClick={() => {
          value && upsertTag(value, note)
        }}
        style={{ margin: '0 0 0 auto', display: 'block' }}
      >
        {tag ? 'Update' : 'Create'}
      </Button>
    </div>
  )
}
