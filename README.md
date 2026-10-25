# NoteHub

NoteHub is a Next.js application with cookie-based authentication for creating,
searching, filtering, viewing, and deleting personal notes.

Live application: [https://09-auth-two-delta.vercel.app](https://09-auth-two-delta.vercel.app)

## Features

- Server-side rendering and client-side data fetching with TanStack Query
- Tag filtering with App Router parallel and catch-all routes
- Intercepting route for note previews in a modal
- Dynamic SEO and Open Graph metadata
- Note creation on a dedicated page
- Persistent note drafts with Zustand and localStorage
- Registration, login, logout, and protected routes
- User profile viewing and editing
- Globally optimized Roboto font through `next/font`

## Local development

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
