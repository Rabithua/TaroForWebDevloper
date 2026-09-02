# Taro + Tailwind CSS + Redux Toolkit

A multi-platform development template based on Taro 4.x, Tailwind CSS 4.x, and Redux Toolkit, supporting WeChat Mini Program, H5, and other platforms.

## Tech Stack

### Core Framework

- **Taro 4.1.9** - Multi-platform unified development framework
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool

### Styling Solution

- **Tailwind CSS 4.x** - Utility-first CSS framework
- **@tailwindcss/postcss** - Tailwind CSS 4.x PostCSS plugin
- **weapp-tailwindcss** - Mini Program Tailwind CSS support

### State Management

- **Redux Toolkit** - Official Redux toolset
- **React Redux** - React bindings
- **Redux Logger** - Development logging middleware
- **Redux Thunk** - Async action support

### Icon Solution

- **Lucide IconNode** - Tree-shakeable semantic icon data
- **Icon Component** - UTF-8-safe SVG serialization to a cached Base64 data URI rendered by Taro `Image`

### Backend Service

- **PocketBase** - Lightweight backend service (runs via Docker)

### Code Quality

- **ESLint** - JavaScript/TypeScript code linting
- **Stylelint** - CSS code linting
- **Prettier** - Code formatting
- **Commitlint** - Git commit message conventions
- **Husky** - Git hooks management

## Features

- ✅ Multi-platform support (WeChat Mini Program, H5, Alipay Mini Program, Douyin Mini Program, etc.)
- ✅ Tailwind CSS 4.x integration with support for Tailwind utility classes in Mini Programs
- ✅ Redux Toolkit state management with type safety
- ✅ Full TypeScript support
- ✅ Icon component wrapper for unified icon usage
- ✅ PocketBase backend service integration
- ✅ Code quality tools (ESLint, Stylelint, Prettier)
- ✅ Git commit conventions (Commitlint, Husky)

## Quick Start

### Install Dependencies

```bash
bun install
```

### Development

```bash
# WeChat Mini Program
bun run dev:weapp

# H5
bun run dev:h5

# Other platforms
bun run dev:swan      # Baidu Mini Program
bun run dev:alipay    # Alipay Mini Program
bun run dev:tt        # Douyin Mini Program
bun run dev:qq        # QQ Mini Program
bun run dev:jd        # JD Mini Program
```

### Build

```bash
# WeChat Mini Program
bun run build:weapp

# H5
bun run build:h5

# Other platforms follow the same pattern
```

### PocketBase Service

```bash
# Start PocketBase service
bun run dev:pb

# Stop service
bun run dev:pb:stop

# View logs
bun run dev:pb:logs

# Restart service
bun run dev:pb:restart
```

For more PocketBase usage instructions, see [pocketbase/README.md](./pocketbase/README.md)

## Project Structure

```
src/
  ├── app.tsx              # Application entry (includes Redux Provider)
  ├── app.config.ts        # Application config
  ├── app.css              # Global styles (imports Tailwind CSS)
  ├── components/          # Shared components
  │   ├── Icon.tsx         # Icon component
  │   └── icon-svg.ts      # Pure IconNode serializer and data URI cache
  ├── dev/                 # Unrouted development-only UI kit previews
  │   └── IconGallery.tsx
  ├── pages/               # Pages directory
  │   └── index/
  │       ├── index.tsx
  │       └── index.config.ts
  ├── store/               # Redux Store
  │   ├── index.ts         # Store configuration
  │   ├── hooks.ts         # Type-safe hooks
  │   └── slices/          # Redux slices
  │       ├── appSlice.ts
  │       └── userSlice.ts
  └── types/               # Type definitions
      ├── store.ts         # Store types
      └── user.ts          # User types

config/                     # Build configuration
  ├── index.ts            # Main config
  ├── dev.ts              # Development config
  └── prod.ts             # Production config

pocketbase/                 # PocketBase backend service
  ├── docker-compose.yml  # Docker Compose configuration
  ├── Dockerfile          # Docker image build
  └── pb_migrations/      # Database migration files

tests/                      # Bun unit tests
  ├── Icon.test.tsx
  └── icon-svg.test.ts
```

## Usage Guide

### Using Tailwind CSS

Tailwind CSS is already imported in `src/app.css`. You can directly use Tailwind utility classes in components:

```tsx
<View className="flex items-center justify-center h-screen">
  <Text className="text-2xl font-bold">Hello Taro</Text>
</View>
```

### Using Redux Toolkit

#### In Components

```tsx
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setTheme } from '../../store/slices/appSlice'

export default function Index() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.app.theme)

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <View>
      <Text>Current theme: {theme}</Text>
      <Button onClick={toggleTheme}>Toggle Theme</Button>
    </View>
  )
}
```

For more Redux Toolkit usage instructions, see [doc/REDUX_TOOLKIT.md](./doc/REDUX_TOOLKIT.md)

### Using Icon Component

Import an `IconNode` from `lucide`, then render it exclusively through the template component:

```tsx
import { Icon } from '../../components/Icon'
import { House } from 'lucide'

export default function Index() {
  return (
    <View>
      <Icon
        icon={House}
        size={24}
        color="#171717"
        strokeWidth={2}
        className="shrink-0"
        aria-label="Home"
      />
    </View>
  )
}
```

The public API is:

```ts
interface IconProps {
  icon: IconNode
  size?: number // CSS pixels on both WeChat Mini Program and H5; default 24
  color?: string // Concrete SVG color; default #0a0a0a
  strokeWidth?: number // Default 2; zero is supported
  className?: string
  'aria-label'?: string
  ariaLabel?: string // Taro-compatible alias
}
```

Important constraints:

- `lucide` exports icon data in this template. Never render it as `<House />`, and do not render a `lucide-react` SVG component in Mini Program business code. WeChat Mini Program does not provide the DOM SVG path that React icon packages expect. `<Icon icon={House} />` serializes the node to a UTF-8-safe Base64 data URI and renders it through Taro `Image` on every platform.
- Pass a concrete color such as `#171717` or `rgba(...)`. `currentColor`, `inherit`, CSS variables, and paint-server URLs cannot cross the independent image boundary and are rejected. Resolve light/dark theme colors before passing `color`.
- `size` controls both rendered width and height in CSS pixels. The component uses `aspectFit`, a non-shrinking inline size, and a matching SVG viewport to prevent intrinsic SVG dimensions from changing the layout.
- Use `className` for layout placement, not to override the icon's width, height, or stroke color. Use `size`, `color`, and `strokeWidth` for those properties.
- A standalone meaningful icon should have `aria-label`. An icon next to visible text, or inside an already labelled button, should omit it and remain decorative. On H5 the label is forwarded to the inner image; Taro also receives its `ariaLabel` form.
- Do not use text characters or emoji as icon placeholders. Choose a semantic Lucide node so the same glyph renders consistently across fonts and platforms.

#### Lucide vs. design-specific SVG assets

Use `Icon` for common semantic actions and states: navigation, search, settings, back, share, location, calendar, profile, loading controls, and similar UI concepts. Use the exact exported design asset through Taro `Image` for brand marks, logos, illustrations, campaign artwork, or a bespoke glyph whose geometry is part of the design. Do not approximate a design-specific asset with a vaguely similar Lucide icon, and do not place exported artwork inside the semantic `Icon` API.

A development-only gallery is available at `src/dev/IconGallery.tsx`. It is intentionally not imported by `src/app.config.ts`, so it never becomes a production route. Temporarily render it from a local development page when reviewing a new platform, theme palette, or Lucide upgrade.

### Code Standards

The project uses the following tools to ensure code quality:

- **ESLint** - Automatically checks for code issues
- **Stylelint** - Checks style code
- **Prettier** - Automatically formats code
- **Commitlint** - Enforces Git commit message conventions

Run code checks and formatting:

```bash
# Format code
bun run format

# Check code format
bun run format:check

# Lint, typecheck, and unit tests
bun run lint
bun run typecheck
bun run test

# Run all non-build checks
bun run check
```

## Notes

- The `weapp-tw patch` command will automatically run after the first dependency installation to handle Tailwind CSS compatibility in WeChat Mini Programs
- For development, it's recommended to open the `dist` directory in WeChat Developer Tools for preview
- Style units are automatically converted (rem to rpx)
- Avoid using `rpx` units unless necessary
- Avoid abusing `ScrollView` unless necessary
- Use Redux Toolkit for state management
- Use the Icon component for semantic icons; use exact exported image assets for bespoke design artwork
- Documentation files should be placed in the `doc` folder

## Development Guidelines

- Default language is English
- Use Tailwind CSS v4
- Run lint and tsc checks after every code change
- Use bun instead of npm
