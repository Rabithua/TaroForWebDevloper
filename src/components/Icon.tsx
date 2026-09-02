import { Image } from '@tarojs/components'
import type { IconNode } from 'lucide'
import React from 'react'

import {
  createIconDataUri,
  DEFAULT_ICON_COLOR,
  DEFAULT_ICON_SIZE,
  DEFAULT_ICON_STROKE_WIDTH,
} from './icon-svg'

export interface IconProps {
  icon: IconNode
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
  /** Preferred public spelling; forwarded to Taro and the inner H5 image. */
  'aria-label'?: string
  /** Compatibility alias matching Taro's Image prop. */
  ariaLabel?: string
}

export const Icon = React.memo(function Icon({
  icon,
  size = DEFAULT_ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
  strokeWidth = DEFAULT_ICON_STROKE_WIDTH,
  className,
  'aria-label': ariaLabelAttribute,
  ariaLabel,
}: IconProps) {
  const accessibleLabel = (ariaLabelAttribute ?? ariaLabel)?.trim() || undefined

  return (
    <Image
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        flexShrink: 0,
      }}
      src={createIconDataUri(icon, { size, color, strokeWidth })}
      mode="aspectFit"
      ariaLabel={accessibleLabel || ''}
      imgProps={
        accessibleLabel
          ? { alt: accessibleLabel, 'aria-label': accessibleLabel }
          : { alt: '', 'aria-hidden': true }
      }
    />
  )
})
