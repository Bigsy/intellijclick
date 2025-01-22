import type { Position, Range, Selection, TextDocument } from 'vscode'

export interface HandlerContext {
  doc: TextDocument
  anchor: Position
  selection: Selection
  charLeft: string
  charRight: string
  withOffset: (p: Position, offset: number) => Position
}

export interface Handler {
  name: string
  handle: (context: HandlerContext) => Selection | Range | void
}
