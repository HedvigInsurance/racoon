import { format, parseISO } from 'date-fns'
import {
  ClaimNoteFragment,
  ClaimNoteTag,
  ClaimNoteType,
} from 'types/generated/graphql'
import Markdown, { Components } from 'react-markdown'
import { creatorInfo, noteItem, noteText } from './ClaimNoteItem.css'
import { Button, Flex, LegacyTooltip, PopupMenu } from '@hedvig-ui/redesign'
import React, { ReactNode, useState } from 'react'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { Pin, PinFill, Tag, TagFill } from 'react-bootstrap-icons'
import { useClaimNoteTags } from './hooks'
import { ClaimNoteSettingsMenu } from './ClaimNoteSettingsMenu'
import { IconButton } from '@hedvig-ui/icons'
import { NoteTags } from './NoteTags'
import { richText } from 'portals/hope/features/claims/new/ClaimNotes/richText.css'
import remarkBreaks from 'remark-breaks'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import { TiptapView } from '@hope/features/claims/new/ClaimNotes/Tiptap'
import { noteFilterRegex } from '@hope/features/claims/new/ClaimNotes/ClaimNotesNew'

type Highlighter = (text: string) => ReactNode

const remarkPlugins = [remarkBreaks]

export const ClaimNoteItemNew = ({
  note,
  highlight,
}: {
  note: ClaimNoteFragment
  highlight?: string
}) => {
  const { text, insertedBy, insertedAt, tags, type } = note
  const claimId = useClaim().claimId
  const { toggleTag, isPinned, hasTags } = useClaimNoteTags({ claimId, note })
  const togglePinned = () => toggleTag(ClaimNoteTag.Pinned)

  const highlighter = createHighlighter(highlight)
  const [showSettings, setShowSettings] = useState(false)
  return (
    <>
      <Flex direction="column" gap="small" py="medium" className={noteItem}>
        <Flex gap="medium" justify="space-between" align="flex-start">
          {type === ClaimNoteType.TiptapJson ? (
            <TiptapView
              content={text ? JSON.parse(text) : null}
              highlight={highlight}
            ></TiptapView>
          ) : type === ClaimNoteType.Markdown ? (
            // Future improvement:
            // At some point when Tiptap has been out a while, maybe we should
            // just render markdown in plain text, to get rid of the dependency.
            <div className={richText}>
              <Markdown
                components={highlightMarkdownComponent(highlighter)}
                remarkPlugins={remarkPlugins}
              >
                {text}
              </Markdown>
            </div>
          ) : (
            <p className={noteText}>{highlighter(text)}</p>
          )}
          <div>
            {formatInsertedBy(insertedBy) !== 'Automatic Summary (Live)' && (
              <Flex gap="tiny" align="center">
                <LegacyTooltip content={isPinned ? 'Unpin' : 'Pin'}>
                  <Button
                    onClick={togglePinned}
                    variant="ghost"
                    style={{ padding: 0, aspectRatio: '1' }}
                  >
                    {isPinned ? <PinFill /> : <Pin />}
                  </Button>
                </LegacyTooltip>
                <LegacyTooltip content="Tags">
                  <PopupMenu
                    visible={showSettings}
                    onClose={() => setShowSettings(false)}
                    target={
                      <IconButton onClick={() => setShowSettings(true)}>
                        {hasTags ? <TagFill /> : <Tag />}
                      </IconButton>
                    }
                  >
                    <ClaimNoteSettingsMenu note={note} />
                  </PopupMenu>
                </LegacyTooltip>
              </Flex>
            )}
          </div>
        </Flex>
        <Flex gap="medium" justify="space-between" align="flex-end">
          <NoteTags tags={tags} />
          <div className={creatorInfo}>
            <span>{formatInsertedBy(insertedBy)}</span>
            <span>{format(parseISO(insertedAt), 'yyyy-MM-dd HH:mm:ss')}</span>
          </div>
        </Flex>
      </Flex>
    </>
  )
}

/**
 * Takes a `highlight` parameter and returns a new function that
 * takes a string and produces a ReactNode where the original highlight
 * param "lights up" by getting a span with a yellow background.
 */
const createHighlighter = (highlight?: string): Highlighter => {
  if (!highlight) {
    return (text: string) => text
  }
  const regex = noteFilterRegex(highlight, 'i')

  return (text: string) => {
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className={cssUtil.textHighlight}>
          {part}
        </span>
      ) : (
        part
      ),
    )
  }
}

/**
 * Creates a react-markdown `Components` object, which lets you apply
 * custom rendering to a specific set of dom elements.
 *
 * Sadly, it does not let you simply override the rendering of `text`. That
 * would have been amazing, but that callback never happens.
 */
const highlightMarkdownComponent = (highlighter: Highlighter): Components => {
  return {
    h1: (props) => (
      <h1>{recursivelyReplaceTexts(highlighter, props.children)}</h1>
    ),
    h2: (props) => (
      <h2>{recursivelyReplaceTexts(highlighter, props.children)}</h2>
    ),
    h3: (props) => (
      <h3>{recursivelyReplaceTexts(highlighter, props.children)}</h3>
    ),
    h4: (props) => (
      <h4>{recursivelyReplaceTexts(highlighter, props.children)}</h4>
    ),
    h5: (props) => (
      <h5>{recursivelyReplaceTexts(highlighter, props.children)}</h5>
    ),
    h6: (props) => (
      <h6>{recursivelyReplaceTexts(highlighter, props.children)}</h6>
    ),
    li: (props) => (
      <li>{recursivelyReplaceTexts(highlighter, props.children)}</li>
    ),
    ol: (props) => (
      <ol>{recursivelyReplaceTexts(highlighter, props.children)}</ol>
    ),
    pre: (props) => (
      <pre>{recursivelyReplaceTexts(highlighter, props.children)}</pre>
    ),
    p: (props) => <p>{recursivelyReplaceTexts(highlighter, props.children)}</p>,
  }
}

/**
 * Crazy-transform a ReactNode into a new one where all 'string' leafs
 * have been replaced with spans created by the given `Highlighter`.
 */
const recursivelyReplaceTexts = (
  highlighter: Highlighter,
  node: ReactNode,
): ReactNode => {
  if (typeof node === 'string') {
    return highlighter(node)
  }
  if (Array.isArray(node)) {
    return node.map((child) => recursivelyReplaceTexts(highlighter, child))
  }
  if (React.isValidElement(node)) {
    return React.cloneElement(
      node,
      {},
      React.Children.map(node.props.children, (child) =>
        recursivelyReplaceTexts(highlighter, child),
      ),
    )
  }
  return node
}

const formatInsertedBy = (insertedBy: ClaimNoteFragment['insertedBy']) => {
  switch (insertedBy?.__typename) {
    case 'AdminSystemUser':
    case 'EmailSystemUser':
      return insertedBy.email
    case 'UnknownSystemUser':
      return insertedBy.name
    default:
      return 'automation'
  }
}
