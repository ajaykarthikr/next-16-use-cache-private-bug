import { cacheTag, cacheLife } from "next/cache";
import { cookies } from "next/headers";
import { Suspense } from "react";


async function Content() {
    "use cache: private";
    cacheTag(`special-userdata`);
    cacheLife({ stale: 31, revalidate: 32, expire: 33 });

    const sessionId = (await cookies()).get('session-id')?.value || 'guest'

    console.log("Got user cookies", sessionId)

    console.log("Fetching user data");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const timestamp = new Date().toISOString();

    return (
        <div>
            <p>Fetched at: {timestamp}</p>
        </div>
    );
}

export default async function Page() {
    return (
        <div>
            <h1>Contact Page</h1>
            <p>Using "use cache: private" in <pre>Content</pre> component</p>

            <Suspense fallback={<p>Loading with fake 2s sleep...</p>}>
                <Content />
            </Suspense>
        </div>
    )
}

