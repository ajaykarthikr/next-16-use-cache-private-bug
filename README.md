# Next.js Bug Reproduction

This repository reproduces a caching issue with Next.js 16.0.1 "use cache: private" directive.

## Bug Report

### Issue Summary

When using `"use cache: private"` directive with `cookies()` API in a cached function, the cache is not being utilized during client-side navigation. The function re-executes on every navigation instead of serving from cache.

### To Reproduce

#### 1. Cached Function with cookies() API

```typescript
// src/app/lib/user.ts
import { cookies } from "next/headers";
import { cacheTag, cacheLife } from "next/cache";

export async function getUser() {
    "use cache: private";
    cacheTag(`userdata`);
    cacheLife({ stale: 60 });

    const sessionId = (await cookies()).get('session-id')?.value || 'guest'

    console.log("Fetching user data"); // This logs on every navigation
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const timestamp = new Date().toISOString();

    return {
        user: {
            name: "Ajay",
            email: "ajay@example.com"
        },
        timestamp: timestamp,
    }
}
```

#### 2. Server Component Page

```typescript
// src/app/about/page.tsx
import { Suspense } from "react";
import { getUser } from "../lib/user";

export default async function Page() {
    return (
        <div>
            <h1>About Page</h1>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </div>
    )
}

async function Content() {
    const data = await getUser();
    return (
        <div>
            <h1>{data.user.name}</h1>
            <p>Fetched at: {data.timestamp}</p>
        </div>
    );
}
```

#### 3. Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

#### 4. Steps to Reproduce

1. Navigate to the page (e.g., `/about`)
2. Navigate away to another page
3. Navigate back using client-side navigation (using `<Link>` component)

### Expected Behavior

The cached function should return the cached result during the 30-second stale period, showing:
- The same timestamp on subsequent navigations
- No "Fetching user data" log in the console after initial fetch

### Actual Behavior

The function re-executes on every client-side navigation:
- Shows a new timestamp each time
- Logs "Fetching user data" in the console on every navigation
- The 5-second delay occurs on each navigation

## Environment Information

**Operating System:**
- Platform: darwin
- Version: Darwin 25.0.0

**Binaries:**
- Node: 22.20.0
- npm: 10.9.3

**Relevant Packages:**
- next: 16.0.1
- react: 19.2.0
- react-dom: 19.2.0
- typescript: 5.x

## Affected Areas

- App Router
- Caching (ISR, Data Cache, Full Route Cache)

## Affected Stages

- `next dev` (local)
- `next build` (local)
- `next start` (local)

## Additional Context

- The issue persists even when explicitly setting `cacheLife({ stale: 60 })` instead of using presets
- Tried setting `experimental.staleTimes.dynamic: 0` but it didn't resolve the issue
- The `"use cache: private"` directive is supposed to work with `cookies()` API according to the documentation
- This appears to be related to Router Cache interaction with function-level caching during client-side navigation

## Running the Reproduction

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or build and run production
npm run build
npm start
```

Navigate to the About page to observe the caching behavior.
