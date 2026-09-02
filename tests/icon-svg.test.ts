import { describe, expect, test } from 'bun:test'
import { House, Search, type IconNode } from 'lucide'

import { createIconDataUri, serializeIconSvg } from '../src/components/icon-svg'

function decodeDataUri(dataUri: string) {
  const encodedSvg = dataUri.replace('data:image/svg+xml;base64,', '')
  const bytes = Uint8Array.from(atob(encodedSvg), (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

describe('Lucide IconNode SVG rendering', () => {
  test('renders different Lucide icons to different SVG image sources', () => {
    const house = createIconDataUri(House)
    const search = createIconDataUri(Search)

    expect(house).toStartWith('data:image/svg+xml;base64,')
    expect(search).toStartWith('data:image/svg+xml;base64,')
    expect(house).not.toBe(search)
    expect(decodeDataUri(house)).toContain('d="M15 21v-8a1 1 0 0 0-1-1h-4')
    expect(decodeDataUri(search)).toContain('<circle cx="11" cy="11" r="8"/>')
  })

  test('applies size, concrete colors, and exact stroke widths including zero', () => {
    const configuredSvg = serializeIconSvg(Search, {
      size: 32,
      color: 'rgba(12, 34, 56, 0.75)',
      strokeWidth: 1.5,
    })
    const zeroWidthSvg = serializeIconSvg(Search, { strokeWidth: 0 })

    expect(configuredSvg).toContain('width="32" height="32"')
    expect(configuredSvg).toContain('stroke="rgba(12, 34, 56, 0.75)"')
    expect(configuredSvg).toContain('stroke-width="1.5"')
    expect(zeroWidthSvg).toContain('stroke-width="0"')
  })

  test('normalizes React-style attribute names and safely escapes XML and UTF-8', () => {
    const customIcon: IconNode = [
      [
        'path',
        {
          ariaLabel: '温暖 & <home> "quoted" \'single\'',
          d: 'M0 0 你好 & < > " \'',
          fillRule: 'evenodd',
          strokeWidth: 3,
        },
      ],
    ]

    const decodedSvg = decodeDataUri(createIconDataUri(customIcon, { color: '#123456' }))

    expect(decodedSvg).toContain(
      'aria-label="温暖 &amp; &lt;home&gt; &quot;quoted&quot; &apos;single&apos;"'
    )
    expect(decodedSvg).toContain('d="M0 0 你好 &amp; &lt; &gt; &quot; &apos;"')
    expect(decodedSvg).toContain('fill-rule="evenodd"')
    expect(decodedSvg).toContain('stroke-width="3"')
  })

  test('produces stable output for repeated calls and attribute insertion order', () => {
    const first: IconNode = [['path', { d: 'M1 2', fill: 'none' }]]
    const reordered: IconNode = [['path', { fill: 'none', d: 'M1 2' }]]
    const options = { size: 20, color: '#2563eb', strokeWidth: 2 }

    const firstResult = createIconDataUri(first, options)

    expect(createIconDataUri(first, options)).toBe(firstResult)
    expect(createIconDataUri(reordered, options)).toBe(firstResult)
    expect(createIconDataUri(first, { ...options, color: '#dc2626' })).not.toBe(firstResult)
  })

  test('rejects dimensions and colors that cannot render reliably in an image', () => {
    expect(() => createIconDataUri(House, { size: 0 })).toThrow('Icon size')
    expect(() => createIconDataUri(House, { strokeWidth: -1 })).toThrow('Icon strokeWidth')
    expect(() => createIconDataUri(House, { color: 'currentColor' })).toThrow('concrete color')
    expect(() => createIconDataUri(House, { color: 'var(--foreground)' })).toThrow('concrete color')
  })
})
