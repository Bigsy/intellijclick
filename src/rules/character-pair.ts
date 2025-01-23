import { Position, Range, Selection } from 'vscode'
import type { Handler } from '../types'

const characterPairs: [left: string, right: string][] = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
  ['"', '"'],
  ['\'', '\''],
  ['`', '`'],
]

export const characterPairHandler: Handler = {
  name: 'character-pair',
  handle({ charLeft, charRight, doc, anchor: _anchor, withOffset }) {
    for (const DIR of [1, -1]) {
      const OPEN = DIR === 1 ? 0 : 1
      const CLOSE = DIR === 1 ? 1 : 0
      const isQuote = (char: string) => char === '"' || char === "'" || char === '`'
      // Handle quotes specially - they work in both directions
      if (isQuote(charLeft) || isQuote(charRight)) {
        const quotePair = characterPairs.find(i => i[0] === charLeft || i[0] === charRight)
        if (quotePair) {
          const anchor = withOffset(_anchor, -1)

          const start = withOffset(anchor, DIR)
          const rest = doc.getText(
            DIR === 1
              ? new Range(start, new Position(Infinity, Infinity))
              : new Range(new Position(0, 0), start),
          )

          let index = -1
          let pairCount = 0
          for (let i = 0; i < rest.length; i += 1) {
            const idx = (rest.length + i * DIR) % rest.length
            const c = rest[idx]
            if (rest[idx - 1] === '\\')
              continue
            if (c === quotePair[0]) {
              pairCount++
              if (pairCount > 1) {
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

      // Handle paired characters
      const pairLeft = characterPairs.find(i => i[OPEN] === charLeft)
      const pairRight = characterPairs.find(i => i[OPEN] === charRight)
      const pair = pairLeft || pairRight
      const anchor = pairLeft ? withOffset(_anchor, -1) : _anchor

      if (!pair)
        continue

      const start = withOffset(anchor, DIR)
      const rest = doc.getText(
        DIR === 1
          ? new Range(start, new Position(Infinity, Infinity))
          : new Range(new Position(0, 0), start),
      )

      let index = -1
      let pairCount = 0
      for (let i = 0; i < rest.length; i += 1) {
        const idx = (rest.length + i * DIR) % rest.length
        const c = rest[idx]
        if (rest[idx - 1] === '\\')
          continue
        if (c === pair[OPEN]) {
          pairCount++
        }
        else if (c === pair[CLOSE]) {
          pairCount--
          if (pairCount < 0) {
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
