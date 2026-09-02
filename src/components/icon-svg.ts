import type { IconNode } from 'lucide'

export const DEFAULT_ICON_COLOR = '#0a0a0a'
export const DEFAULT_ICON_SIZE = 24
export const DEFAULT_ICON_STROKE_WIDTH = 2

export interface IconSvgOptions {
  size?: number
  color?: string
  strokeWidth?: number
}

const BASE64_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const SVG_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.:-]*$/
const CONTEXT_DEPENDENT_COLOR_PATTERN =
  /^(currentcolor|inherit|initial|revert|revert-layer|unset)$|(?:var|url)\s*\(/i

const ATTRIBUTE_NAME_OVERRIDES: Record<string, string> = {
  className: 'class',
  htmlFor: 'for',
  preserveAspectRatio: 'preserveAspectRatio',
  tabIndex: 'tabindex',
  viewBox: 'viewBox',
  xlinkHref: 'xlink:href',
  xmlnsXlink: 'xmlns:xlink',
}

const MAX_CACHE_ENTRIES_PER_ICON = 64
const dataUriCache = new WeakMap<IconNode, Map<string, string>>()

function assertPositiveFiniteNumber(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite number greater than zero`)
  }
}

function assertNonNegativeFiniteNumber(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite number greater than or equal to zero`)
  }
}

function normalizeColor(color: string) {
  const normalizedColor = color.trim()

  if (!normalizedColor) {
    throw new TypeError('Icon color must be a non-empty, concrete SVG color')
  }

  if (CONTEXT_DEPENDENT_COLOR_PATTERN.test(normalizedColor)) {
    throw new TypeError(
      `Icon color "${normalizedColor}" cannot be resolved inside an SVG image; pass a concrete color value`
    )
  }

  return normalizedColor
}

function normalizeAttributeName(name: string) {
  const normalizedName =
    ATTRIBUTE_NAME_OVERRIDES[name] || name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

  if (!SVG_NAME_PATTERN.test(normalizedName)) {
    throw new TypeError(`Invalid SVG attribute name: ${name}`)
  }

  return normalizedName
}

function escapeXmlAttribute(value: string | number) {
  return String(value).replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&apos;'
    }
  })
}

function serializeIconNode(icon: IconNode) {
  return icon
    .map(([tag, attributes]) => {
      if (!SVG_NAME_PATTERN.test(tag)) {
        throw new TypeError(`Invalid SVG tag name: ${tag}`)
      }

      const serializedAttributes = Object.entries(attributes)
        .map(([name, value]) => [normalizeAttributeName(name), value] as const)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([name, value]) => `${name}="${escapeXmlAttribute(value)}"`)
        .join(' ')

      return serializedAttributes ? `<${tag} ${serializedAttributes}/>` : `<${tag}/>`
    })
    .join('')
}

function encodeUtf8AsBase64(value: string) {
  const bytes: number[] = []

  for (let index = 0; index < value.length; index += 1) {
    let codePoint = value.charCodeAt(index)

    if (codePoint >= 0xd800 && codePoint <= 0xdbff) {
      const trailingSurrogate = value.charCodeAt(index + 1)
      if (trailingSurrogate >= 0xdc00 && trailingSurrogate <= 0xdfff) {
        codePoint = 0x10000 + ((codePoint - 0xd800) << 10) + (trailingSurrogate - 0xdc00)
        index += 1
      } else {
        codePoint = 0xfffd
      }
    } else if (codePoint >= 0xdc00 && codePoint <= 0xdfff) {
      codePoint = 0xfffd
    }

    if (codePoint <= 0x7f) {
      bytes.push(codePoint)
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f))
    } else if (codePoint <= 0xffff) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      )
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      )
    }
  }

  let result = ''
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index]
    const hasSecond = index + 1 < bytes.length
    const hasThird = index + 2 < bytes.length
    const second = hasSecond ? bytes[index + 1] : 0
    const third = hasThird ? bytes[index + 2] : 0
    const bitmap = (first << 16) | (second << 8) | third

    result += BASE64_CHARACTERS[(bitmap >> 18) & 63]
    result += BASE64_CHARACTERS[(bitmap >> 12) & 63]
    result += hasSecond ? BASE64_CHARACTERS[(bitmap >> 6) & 63] : '='
    result += hasThird ? BASE64_CHARACTERS[bitmap & 63] : '='
  }

  return result
}

export function serializeIconSvg(icon: IconNode, options: IconSvgOptions = {}) {
  const size = options.size ?? DEFAULT_ICON_SIZE
  const color = normalizeColor(options.color ?? DEFAULT_ICON_COLOR)
  const strokeWidth = options.strokeWidth ?? DEFAULT_ICON_STROKE_WIDTH

  assertPositiveFiniteNumber(size, 'Icon size')
  assertNonNegativeFiniteNumber(strokeWidth, 'Icon strokeWidth')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${escapeXmlAttribute(color)}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${serializeIconNode(icon)}</svg>`
}

export function createIconDataUri(icon: IconNode, options: IconSvgOptions = {}) {
  const size = options.size ?? DEFAULT_ICON_SIZE
  const color = normalizeColor(options.color ?? DEFAULT_ICON_COLOR)
  const strokeWidth = options.strokeWidth ?? DEFAULT_ICON_STROKE_WIDTH

  assertPositiveFiniteNumber(size, 'Icon size')
  assertNonNegativeFiniteNumber(strokeWidth, 'Icon strokeWidth')

  const cacheKey = JSON.stringify([size, color, strokeWidth])
  const iconCache = dataUriCache.get(icon) || new Map<string, string>()
  const cachedDataUri = iconCache.get(cacheKey)
  if (cachedDataUri) {
    iconCache.delete(cacheKey)
    iconCache.set(cacheKey, cachedDataUri)
    return cachedDataUri
  }

  const dataUri = `data:image/svg+xml;base64,${encodeUtf8AsBase64(
    serializeIconSvg(icon, { size, color, strokeWidth })
  )}`
  if (iconCache.size >= MAX_CACHE_ENTRIES_PER_ICON) {
    const oldestCacheKey = iconCache.keys().next().value
    if (oldestCacheKey) iconCache.delete(oldestCacheKey)
  }
  iconCache.set(cacheKey, dataUri)
  dataUriCache.set(icon, iconCache)

  return dataUri
}
