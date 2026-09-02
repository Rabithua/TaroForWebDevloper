import { View, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Moon, Sun } from 'lucide'
import { useAppDispatch } from '@/store/hooks'
import { setTheme } from '@/store/slices/appSlice'
import { useThemeViewProps } from '@/hooks/useTheme'
import { Icon } from '@/components/Icon'
import PageContainer from '@/components/PageContainer'

export default function Index() {
  const dispatch = useAppDispatch()
  const { theme, systemInfo } = useThemeViewProps()

  useLoad(() => {
    console.log('Page loaded.')
  })

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <PageContainer className="p-4 flex flex-col items-start justify-start space-y-4 transition-colors duration-300">
      <View className="text-3xl font-bold">Hello world!</View>

      <View className="w-full space-y-3">
        <View className="text-xl">Project Introduction</View>
        <View className="text-base leading-relaxed">
          This is a multi-platform development template built with Taro 4.x, Tailwind CSS 4.x, and
          Redux Toolkit. It supports WeChat Mini Program, H5, and other platforms with a modern tech
          stack.
        </View>
        <View className="text-sm space-y-1">
          <View>• Taro 4.1.9 + React 18 + TypeScript</View>
          <View>• Tailwind CSS 4.x for styling</View>
          <View>• Redux Toolkit for state management</View>
          <View>• PocketBase backend integration</View>
        </View>
      </View>

      <View className="w-full space-y-2 pt-4 border-t border-border mt-auto">
        <View className="text-sm font-medium opacity-70">Environment & Theme Status</View>
        <View className="flex flex-col space-y-1 text-sm bg-muted p-3 rounded-lg">
          <View className="flex justify-between">
            <View className="opacity-60">Current Theme:</View>
            <View className="font-mono flex items-center gap-2">
              <Icon
                icon={theme === 'dark' ? Moon : Sun}
                size={16}
                color={theme === 'dark' ? '#fafafa' : '#0a0a0a'}
              />
              <View>{theme === 'dark' ? 'Dark' : 'Light'}</View>
            </View>
          </View>
          <View className="flex justify-between">
            <View className="opacity-60">Platform:</View>
            <View className="font-mono">{systemInfo?.platform || 'H5 / Web'}</View>
          </View>
        </View>

        <Button
          onClick={toggleTheme}
          className="mx-0 w-full mt-2 bg-primary text-primary-foreground border-none rounded-md"
        >
          Toggle Manual Override
        </Button>
        <View className="text-[10px] text-center opacity-40 pt-2">
          Note: System theme changes will automatically sync.
        </View>
      </View>
    </PageContainer>
  )
}
