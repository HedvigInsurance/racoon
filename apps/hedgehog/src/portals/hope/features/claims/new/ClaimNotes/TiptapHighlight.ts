// Function to create decorations for each instance of a word
import { noteFilterRegex } from '@hope/features/claims/new/ClaimNotes/ClaimNotesNew'
import * as css from '@hope/features/claims/new/ClaimNotes/Tiptap.css'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Node } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor, Extension } from '@tiptap/react'

export const SearchHighlight = {
  extension: Extension.create({
    name: 'searchHighlight',

    addProseMirrorPlugins() {
      return [highlightPlugin]
    },
  }),

  // Trigger a state change in our plugin, and pass in the new word
  // as "transaction metadata".
  highlight(editor: Editor, text: string | undefined) {
    editor.view.dispatch(
      editor.view.state.tr.setMeta(highlightPlugin, {
        [transactionMetadataKey]: text,
      }),
    )
  },
}

const transactionMetadataKey = 'newHighlight'

// In the ProseMirror plugin state, we store which "decorations" (highlights)
// we have, as well as the currently highlighted text.
interface HighlightPluginState {
  decorations: DecorationSet
  currentHighlight?: string
}

const pluginKey = new PluginKey<HighlightPluginState>('searchHighlight')

// A plugin is needed in order to place decorations in the UI.
// https://prosemirror.net/docs/ref/#state.Plugin_System
const highlightPlugin = new Plugin<HighlightPluginState>({
  key: pluginKey,

  // State of the plugin is computed by `state.init` and `state.apply`,
  // and the state currently holds what we want to highlight and which word.
  state: {
    init(_, { doc }): HighlightPluginState {
      return {
        decorations: applyHighlight(doc),
      }
    },
    apply(tr, state): HighlightPluginState {
      const meta = tr.getMeta(pluginKey)
      const newHighlight = meta?.[transactionMetadataKey]
      if (tr.docChanged || newHighlight !== state.currentHighlight) {
        return {
          decorations: applyHighlight(tr.doc, newHighlight),
          currentHighlight: newHighlight,
        }
      }
      return state
    },
  },
  // `props.decorations` is a reserved thing inside ProseMirror, and is
  // used by the library to ask our plugin "what it wants to decorate".
  // Since we have stored our decorations in our state, we return that.
  // https://prosemirror.net/docs/ref/#view.EditorProps.decorations
  props: {
    decorations(state) {
      const highlightPluginState = this.getState(state)
      return highlightPluginState?.decorations
    },
  },
})

// Create a `DecorationSet`, which is simply a bag of ranges in the text
// we wish to apply decorations to. In our case we apply a CSS class
// with a yellow background color.
function applyHighlight(doc: Node, highlight?: string): DecorationSet {
  const decorations: Decoration[] = []

  if (highlight) {
    const regex = noteFilterRegex(highlight, 'gi')
    doc.descendants((node, pos) => {
      if (node.isText) {
        let match
        while ((match = regex.exec(node.text!)) !== null) {
          const start = pos + match.index
          const end = start + match[0].length
          const decoration = Decoration.inline(start, end, {
            class: css.highlight,
          })
          decorations.push(decoration)
        }
      }
    })
  }

  return DecorationSet.create(doc, decorations)
}
