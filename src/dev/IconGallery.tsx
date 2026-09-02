import { Text, View } from '@tarojs/components'
import { CalendarDays, House, MapPin, Search, Settings, UserRound } from 'lucide'

import { Icon } from '@/components/Icon'

const examples = [
  { label: 'Home', icon: House, color: '#0a0a0a' },
  { label: 'Search', icon: Search, color: '#2563eb' },
  { label: 'Map pin', icon: MapPin, color: '#dc2626' },
  { label: 'Calendar', icon: CalendarDays, color: '#7c3aed' },
  { label: 'Profile', icon: UserRound, color: '#0f766e' },
  { label: 'Settings', icon: Settings, color: '#525252' },
]

/**
 * Development-only UI kit preview. It is intentionally absent from app.config.ts.
 * Import it temporarily from a local development page when reviewing icon rendering.
 */
export function IconGallery() {
  return (
    <View className="grid grid-cols-3 gap-4 p-4 bg-background">
      {examples.map((example) => (
        <View
          key={example.label}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border p-3"
        >
          <Icon
            icon={example.icon}
            size={24}
            color={example.color}
            strokeWidth={2}
            aria-label={example.label}
          />
          <Text className="text-xs text-foreground">{example.label}</Text>
        </View>
      ))}
    </View>
  )
}
