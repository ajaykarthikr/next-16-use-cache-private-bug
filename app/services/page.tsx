import { cacheTag, cacheLife } from "next/cache";
import { Suspense } from "react";

export async function getData() {
    "use cache";
    cacheTag(`public-timestamp`);
    cacheLife({ stale: 31, revalidate: 32, expire: 33 });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const timestamp = new Date().toISOString();

    return {
        timestamp: timestamp,
    }
}

async function Content() {
    const data =  await getData();

    return (
        <div className="bg-zinc-100 p-4 rounded-md mt-3">
            <p>Fetched at: {data.timestamp}</p>
        </div>
    );
}

export default async function Page() {
    return (
        <div className="w-full">
            <h1>Services Page</h1>
            <p>Using "use cache" in getData function. This works</p>
            <Suspense fallback={<p>Loading with fake 2s sleep...</p>}>
                <Content />
            </Suspense>
        </div>
    )
}
