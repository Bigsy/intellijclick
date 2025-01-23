import type { ExtensionContext, Position, Selection, TextDocument } from 'vscode'
import { Range, TextEditorSelectionChangeKind, window, workspace } from 'vscode'
import { characterPairHandler } from './rules/character-pair'
import { toSelection } from './utils'

export function activate(ext: ExtensionContext) {
  let last = 0
  let prevSelection: Selection | undefined
  let timer: any

  const config = workspace.getConfiguration('intellijClicks')

  ext.subscriptions.push(
    window.onDidChangeTextEditorSelection(async (e) => {
      if (timer)
        clearTimeout(timer)
      if (e.kind !== TextEditorSelectionChangeKind.Mouse) {
        last = 0
        return
      }

      const selection = e.selections[0]
      const prev = prevSelection

      try {
        if (
          !prevSelection
          || !prevSelection.isEmpty
          || e.selections.length !== 1
          || selection.start.line !== prevSelection.start.line
          || Date.now() - last > config.get('clicksInterval', 600)
        ) {
          return
        }
      }
      finally {
        prevSelection = selection
        last = Date.now()
      }

      timer = setTimeout(async () => {
        const line = Math.max(0, e.textEditor.selection.active.line - 1)
        const { rangeIncludingLineBreak } = e.textEditor.document.lineAt(line)

        if (rangeIncludingLineBreak.isEqual(selection))
          return
        const newSelection = await trigger(e.textEditor.document, prev!, selection)
        const newSelectionText = e.textEditor.document.getText(newSelection?.[0])
        if (newSelection && newSelectionText) {
          last = 0
          e.textEditor.selections = newSelection
        }
      }, config.get('triggerDelay', 150))
    }),
  )
}

export function deactivate() {
}

async function trigger(
  doc: TextDocument,
  prevSelection: Selection,
  selection: Selection,
) {
  const anchor = prevSelection.start
  const charLeft = doc.getText(new Range(anchor, withOffset(doc, anchor, -1)))
  const charRight = doc.getText(new Range(anchor, withOffset(doc, anchor, 1)))

  const newSelection = characterPairHandler.handle({
    doc,
    anchor,
    selection,
    charLeft,
    charRight,
    withOffset: (p, offset) => withOffset(doc, p, offset),
  })

  if (newSelection)
    return [toSelection(newSelection)]
  return undefined
}

function withOffset(doc: TextDocument, p: Position, offset: number) {
  if (offset === 0)
    return p
  return doc.positionAt(doc.offsetAt(p) + offset)
}
