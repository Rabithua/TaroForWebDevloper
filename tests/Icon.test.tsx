import { describe, expect, mock, test } from 'bun:test'
import { House } from 'lucide'
import { renderToStaticMarkup } from 'react-dom/server'
import type { CSSProperties, ImgHTMLAttributes } from 'react'

mock.module('@tarojs/components', () => ({
  Image({
    ariaLabel,
    imgProps,
    mode,
    ...imageProps
  }: {
    ariaLabel?: string
    className?: string
    imgProps?: ImgHTMLAttributes<HTMLImageElement>
    mode?: string
    src: string
    style?: CSSProperties
  }) {
    return <img {...imageProps} {...imgProps} data-mode={mode} data-taro-aria-label={ariaLabel} />
  },
}))

const { Icon } = await import('../src/components/Icon')

describe('Icon component', () => {
  test('forwards className, size, source, and an accessible label', () => {
    const markup = renderToStaticMarkup(
      <Icon
        icon={House}
        size={20}
        color="#2563eb"
        className="navigation-icon"
        aria-label="Home & overview"
      />
    )

    expect(markup).toContain('class="navigation-icon"')
    expect(markup).toContain('style="width:20px;height:20px;display:block;flex-shrink:0"')
    expect(markup).toContain('src="data:image/svg+xml;base64,')
    expect(markup).toContain('data-mode="aspectFit"')
    expect(markup).toContain('alt="Home &amp; overview"')
    expect(markup).toContain('aria-label="Home &amp; overview"')
    expect(markup).toContain('data-taro-aria-label="Home &amp; overview"')
  })

  test('keeps an unlabelled icon decorative', () => {
    const markup = renderToStaticMarkup(<Icon icon={House} />)

    expect(markup).toContain('alt=""')
    expect(markup).toContain('aria-hidden="true"')
  })

  test('supports Taro ariaLabel as a compatibility alias', () => {
    const markup = renderToStaticMarkup(<Icon icon={House} ariaLabel="Home" />)

    expect(markup).toContain('aria-label="Home"')
    expect(markup).toContain('data-taro-aria-label="Home"')
  })
})
