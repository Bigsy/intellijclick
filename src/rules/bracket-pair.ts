import { Position, Range, Selection } from 'vscode'
import type { Handler } from '../types'

const bracketPairs: [left: string, right: string][] = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
  ['"', '"'],
  ['\'', '\''],
  ['`', '`'],
]

export const bracketPairHandler: Handler = {
  name: 'bracket-pair',
  handle({ charLeft, charRight, doc, anchor: _anchor, withOffset }) {
    for (const DIR of [1, -1]) {
      const OPEN = DIR === 1 ? 0 : 1
      const CLOSE = DIR === 1 ? 1 : 0
      const isQuote = (char: string) => char === '"' || char === "'" || char === '`'
      // Handle quotes specially - they work in both directions
      if (isQuote(charLeft) || isQuote(charRight)) {
        const quotePair = bracketPairs.find(i => i[0] === charLeft || i[0] === charRight)
        if (quotePair) {
          const anchor = withOffset(_anchor, -1)

          const start = withOffset(anchor, DIR)
          const rest = doc.getText(
            DIR === 1
              ? new Range(start, new Position(Infinity, Infinity))
              : new Range(new Position(0, 0), start),
          )

          let index = -1
          let curly = 0
          for (let i = 0; i < rest.length; i += 1) {
            const idx = (rest.length + i * DIR) % rest.length
            const c = rest[idx]
            if (rest[idx - 1] === '\\')
              continue
            if (c === quotePair[0]) {
              curly++
              if (curly > 1) {
                index = i
                break
              }
            }
          }

          if (index < 0)
            continue

          if (DIR === 1) {
            return new Selection(
              start,
              withOffset(start, index + 1),
            )
          }
          else {
            return new Selection(
              withOffset(start, index * DIR),
              start,
            )
          }
        }
      }

      // Handle regular brackets
      const bracketLeft = bracketPairs.find(i => i[OPEN] === charLeft)
      const bracketRight = bracketPairs.find(i => i[OPEN] === charRight)
      const bracket = bracketLeft || bracketRight
      const anchor = bracketLeft ? withOffset(_anchor, -1) : _anchor

      if (!bracket)
        continue

      const start = withOffset(anchor, DIR)
      const rest = doc.getText(
        DIR === 1
          ? new Range(start, new Position(Infinity, Infinity))
          : new Range(new Position(0, 0), start),
      )

      let index = -1
      let curly = 0
      for (let i = 0; i < rest.length; i += 1) {
        const idx = (rest.length + i * DIR) % rest.length
        const c = rest[idx]
        if (rest[idx - 1] === '\\')
          continue
        if (c === bracket[OPEN]) {
          curly++
        }
        else if (c === bracket[CLOSE]) {
          curly--
          if (curly < 0) {
            index = i
            break
          }
        }
      }

      if (index < 0)
        continue

      if (DIR === 1) {
        return new Selection(
          withOffset(start, -1),
          withOffset(start, index + 1),
        )
      }
      else {
        return new Selection(
          withOffset(start, index * DIR),
          withOffset(start, 2),
        )
      }
    }
  },
}
