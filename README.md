# SprintDesk Frontend

SprintDesk is a TypeScript task-management dashboard built with React and Vite for the SprintDesk frontend assignment. The implementation uses a feature-based structure, reusable UI components, dedicated data-access services, Zustand for client state, and TanStack Query for server state.

## Current implementation

- Login form with Formik and Yup validation.
- DummyJSON authentication integration.
- Zustand authentication store.
- Access token kept in memory and refresh token kept in `localStorage`.
- Session restoration when the application starts.
- Protected authenticated routes and public-only login route.
- Automatic access-token refresh and one retry for `401` API responses.
- Logout from the profile menu with redirect to `/login`.
- Dynamic header avatar initials from the authenticated user.
- Reusable Tailwind UI components:
  - `Button`
  - `InputField`
  - `Select`
  - `Modal`
  - `Toast`
  - `DataTable`
  - `Skeleton`
  - `Loader`
- Responsive dashboard shell with sidebar, header, profile menu, and mobile navigation.
- Dashboard overview with live sprint metrics and progress sections.
- Kanban board with 30 mock tasks across Backlog, In Progress, Review, and Done columns.
- Drag-and-drop task movement and reordering using `@dnd-kit`.
- Persisted board state with Zustand and a resettable initial dataset.
- Task details drawer with editing, comments, creation, and delete confirmation.
- Analytics page with four responsive Recharts visualizations.
- Notification bell with JSONPlaceholder polling, unread state, persistence, pagination, and read actions.
- Toast notifications for new polling updates while the notification panel is closed.
- Light/dark theme switching persisted with Zustand.
- Route-level lazy loading with React.lazy and Suspense.
- Unit tests for authentication, the auth interceptor, board CRUD/movement, notifications, and `useToast`.

## Technology stack

- React 19 with TypeScript strict mode
- Vite
- React Router v6
- Zustand
- TanStack Query v5 for mock-data loading and notification polling
- Tailwind CSS v3
- Formik and Yup
- Recharts for analytics
- `@dnd-kit` for drag-and-drop board features
- Vitest and React Testing Library
- `react-spinners` for loading indicators

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local URL shown by Vite, normally:

```text
http://localhost:5173
```

Optional environment configuration:

```bash
cp .env.example .env
```

```text
VITE_AUTH_BASE_URL=https://dummyjson.com/auth
```

## Available scripts

```bash
npm run dev              # Start the Vite development server
npm run build            # Type-check and create a production build
npm run lint             # Run Oxlint
npm run test             # Run Vitest in watch mode
npm run test -- --run    # Run the test suite once
npm run preview          # Preview the production build locally
```

## Login

The login page uses the configured auth API. By default, it points to DummyJSON:

```text
POST https://dummyjson.com/auth/login
```

For assignment review, use these DummyJSON demo credentials:

```text
Username: emilys
Password: emilyspass
```

An internet connection is required when logging in or restoring a session.

## Authentication flow

1. The application starts with an authentication status of `loading`.
2. Zustand checks for the stored refresh token.
3. If a refresh token exists, the app requests a new access token and current user details.
4. The access token is stored only in Zustand memory.
5. The refresh token is stored in `localStorage` under `sprintdesk.refreshToken`.
6. Unauthenticated users are redirected to `/login`.
7. Authenticated users are redirected to `/dashboard` when they visit `/login`.
8. `apiFetch` adds the bearer token to protected requests.
9. On a `401` response, `apiFetch` refreshes the session and retries the request once.
10. Logout clears the Zustand session and the stored refresh token.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public only | User authentication |
| `/dashboard` | Protected | Sprint dashboard overview |
| `/board` | Protected | Drag-and-drop sprint task board |
| `/analytics` | Protected | Sprint charts and data visualization |
| `/` | Redirect | Redirects to `/dashboard` |


## Project structure

```text
src/
|-- components/
|   |-- layout/       # Header, sidebar, and main layout
|   `-- ui/           # Reusable design-system components
|-- features/
|   |-- auth/         # Login form and authentication UI
|   |-- board/        # Board page, columns, task cards, and board utilities
|   |-- analytics/    # Recharts visualizations and sprint summary
|   |-- notifications/# Notification polling and notification panel
|   `-- dashboard/    # Dashboard feature UI
|-- config/           # Environment-backed runtime configuration
|-- hooks/            # Shared hooks such as useToast
|-- data/             # Local mock task data
|-- lib/              # Shared TanStack Query client
|-- pages/            # Route-level page components
|-- router/           # Routes and authentication guards
|-- services/         # DummyJSON service and authenticated API client
|-- stores/           # Zustand stores
|-- types/            # Shared TypeScript types
|-- utils/            # Validation schemas and utilities
`-- test/             # Test setup
```

## Validation

The login validation schema is kept separately in:

```text
src/utils/validationSchema.ts
```

Current rules:

- Username is required.
- Password is required.
- Password must contain at least eight characters.

## Architecture and data flow

The application separates server state, application state, and local component state:

1. Feature pages and components render the application.
2. Feature hooks use TanStack Query for request lifecycle, caching, loading, errors, refetching, and polling.
3. Service modules provide the data-access boundary for DummyJSON, JSONPlaceholder, and the supplied mock data.
4. Zustand stores hold shared client state for authentication, board edits, notifications, toast messages, and theme preference.
5. Local component state is used for temporary UI concerns such as an open drawer, modal form values, and pagination.

The supplied mock data is read only through `src/services/mockDataService.ts`. Replacing it with a backend request does not require board or analytics components to change.

## API documentation

Authentication uses DummyJSON:

- `POST https://dummyjson.com/auth/login`
  - Request body: username and password.
  - Response: accessToken, refreshToken, and authenticated user fields.
- `POST https://dummyjson.com/auth/refresh`
  - Request body: refreshToken and expiresInMins.
  - Response: refreshed accessToken and refreshToken.
- `GET https://dummyjson.com/auth/me`
  - Header: Authorization: Bearer accessToken.
  - Response: current authenticated user.

The authenticated API client adds the bearer token, refreshes once after a `401` response, and retries the original request.

Notifications use JSONPlaceholder:

- `GET https://jsonplaceholder.typicode.com/posts?_limit=5`
  - The five post IDs are treated as notification IDs.
  - Polling runs through TanStack Query every 30 seconds.
  - Polling is paused while the browser tab is hidden.

The board, users, sprints, comments, and initial notifications use `src/data/mock-data.json` as the provided mock backend response.

## Testing

The current tests cover:

- Successful login state and token storage.
- Login form rendering, validation, password visibility, auth errors, and successful navigation.
- Logout state cleanup.
- Refreshing an expired access token.
- Retrying a failed request with the refreshed bearer token.
- Board add, move, reorder, update, comment, delete, and reset behavior.
- Notification hydration, duplicate prevention, and read state.
- Toast creation and dismissal through `useToast`.
- Reusable UI components including Button, InputField, Select, Modal, DataTable, Skeleton, and Toast rendering.
- Task drawer save/close and comment submission behavior.
- Dashboard section components including metrics, header links, progress, focus, attention, recent updates, and workload rendering.

Run the tests once before submitting changes:

```bash
npm run test -- --run
```

## Assignment status

All required functional routes and core features in the assignment are implemented in this repository. Optional bonus items such as Remember Me, password strength, undo history, custom analytics date ranges, PNG export, Storybook, and axe-core testing are intentionally not included because they are not required.

The source has been cleaned for assessment submission: no commented-out implementation code, debug statements, or unused imports are kept. The provided `src/data/mock-data.json` file is left unchanged.

Lighthouse scores should be measured against the production preview with `npm run preview`. The repository includes responsive layouts, semantic labels, keyboard drag sensors, meaningful avatar alt text, lazy routes, memoized task cards, and loading/error states to support the assignment quality targets.

## Quality checks

Before sharing a change, run:

```bash
npm run lint
npm run build
npm run test -- --run
```

All three commands should complete successfully.
