import {
  EditorContent,
  EditorEvents,
  EditorProvider,
  JSONContent,
  useCurrentEditor,
  useEditor,
} from '@tiptap/react'
import * as css from './Tiptap.css'
import { SearchHighlight } from './TiptapHighlight'
import { useCallback, useEffect } from 'react'
import { IconButton } from '@hedvig-ui/icons'
import {
  BlockquoteLeft,
  Link45deg,
  ListOl,
  ListUl,
  TypeBold,
  TypeItalic,
} from 'react-bootstrap-icons'
import { Tooltip } from '@hedvig-ui/redesign'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import { useConfirmDialog } from '@hedvig-ui'

const editorExtensions = [
  StarterKit,
  Link.configure({
    openOnClick: 'whenNotEditable',
  }),
  Placeholder.configure({
    placeholder: () => 'Your note goes here...',
  }),
]

type TiptapEditorProperties = {
  autofocus: boolean
  disabled: boolean
  content: JSONContent | null
  onContentChange: (content: JSONContent) => void
  onFocus: (event: EditorEvents['focus']) => void
  onBlur: (event: EditorEvents['blur']) => void
}

export const TiptapEditor = (props: TiptapEditorProperties) => {
  return (
    <div className={css.editor}>
      <EditorProvider
        extensions={editorExtensions}
        slotBefore={<ToolBar />}
        children={[]} // silence typescript warning
        autofocus={props.autofocus}
        editable={!props.disabled}
        content={props.content}
        onUpdate={({ editor }) => props.onContentChange(editor.getJSON())}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
    </div>
  )
}

const viewExtensions = [StarterKit, Link, SearchHighlight.extension]

export function TiptapView({
  content,
  highlight,
}: {
  content: JSONContent
  highlight?: string
}) {
  const editor = useEditor({
    extensions: viewExtensions,
    content: content,
    editable: false,
  })

  useEffect(() => {
    if (!editor) return
    SearchHighlight.highlight(editor, highlight)
  }, [highlight, editor])

  return (
    <div className={css.view}>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolBar() {
  const { editor } = useCurrentEditor()
  const { confirmWithValue } = useConfirmDialog()

  const toggleLink = useCallback(async () => {
    if (!editor) return null
    if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    let url: string | undefined
    try {
      const result = await confirmWithValue({
        content: 'Add link to text',
        values: {
          url: {
            type: 'input',
            label: 'Link',
          },
        },
      })
      url = result?.['url']?.toString()
    } catch {
      // dialog closed
    }

    if (!url) {
      return
    }
    editor.commands.setLink({ href: url, target: '_blank' })
  }, [editor, confirmWithValue])

  if (!editor) return null

  return (
    <div className={css.toolbar}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          >
            <TypeBold size={24} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Bold</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          >
            <TypeItalic size={24} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Italic</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            onClick={toggleLink}
            disabled={editor.state.selection.empty && !editor.isActive('link')}
            variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          >
            <Link45deg size={24} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Link</Tooltip.Content>
      </Tooltip.Root>

      <div className={css.verticalLine} />

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          >
            <BlockquoteLeft size={24} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Block Quote</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          >
            <ListUl size={24} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Bullet List</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          >
            <ListOl size={24} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Ordered List</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}
