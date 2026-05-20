# Consumer Contract - @sparkmate/ui

This file defines stable integration expectations for app teams and coding agents.

## Required

- Import CSS exactly once at app root:
  - `import '@sparkmate/ui/styles.css'`
- Use package components through `@sparkmate/ui` exports.

## Ownership Boundaries

Package owns:
- UI components
- styling tokens/utilities
- reusable app shell and chat presentation

Consumer app owns:
- routes and navigation state
- auth/session actions
- backend calls and business logic
- concrete nav configuration

## Sidebar Contract

`AppSidebar` requires:
- `groups`
- `pathname`
- `onNavigate`
- `user`

No default nav config is provided by package.

## Chat Contract

`AgentChat` is presentation + interaction shell.

Consumer should provide:
- `onSubmit` behavior
- optional controlled message state (`messages`, `onMessagesChange`)
- optional model label/avatar/name context

## Backward-Compatibility Notes

- Additive props are preferred.
- Breaking visual changes should be noted in changelog.
- Keep existing prop names stable unless deprecation path is provided.
