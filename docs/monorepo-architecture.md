# Travel Gacha Monorepo Architecture

## Goal

Single repository for:

- `apps/mobile`: **primary** — React Native app with Expo (5-tab navigation)
- `apps/web`: **minimal** — Next.js skeleton for later
- shared packages in `packages/*`

## Workspace Layout

- `apps/*`: deployable applications
- `packages/*`: reusable libraries/configurations
- root `turbo.json`: orchestrates tasks across workspaces
- root `pnpm-workspace.yaml`: workspace + **catalog** version management

## Design Principles

1. **Mobile-first**: domain features ship in mobile first; web reuses shared packages later.
2. Push cross-platform logic into `packages/api`, `packages/store`, `packages/types`, `packages/utils`.
3. Mobile-only UI (Header, Topbar, TabBar) stays in `apps/mobile/components`.
4. Shared `theme` tokens live in `packages/ui`; web/mobile each apply styles in their own way.

## Build and Task Flow

- `pnpm dev:mobile` → Expo dev server
- `pnpm dev:web` → Next.js dev server
- `pnpm build` → `turbo run build`
- `pnpm lint` → ESLint across workspaces
- `pnpm typecheck` → TypeScript check
- `pnpm format` → Prettier

## State and Data Layer

- `@travel-gacha/store`: Jotai atoms + `AppProviders` (QueryClient + Jotai)
- `@travel-gacha/api`: Axios `getApiClient()` + `queryOptions` + `ApiError`
- `@travel-gacha/ui`: `theme` object (`colors`, `spacing`, `radius`) — web + mobile 공통

## Tooling

- **ESLint**: `@travel-gacha/eslint-config` (base + react)
- **Prettier**: root `.prettierrc.json`
- **Git hooks**: Husky pre-commit → lint-staged (Prettier)
