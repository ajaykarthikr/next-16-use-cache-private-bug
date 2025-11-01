import { getUser } from "@/lib/user";
import { Suspense } from "react";

async function Content() {
    const data =  await getUser();

    return (
        <div className="bg-zinc-100 p-4 rounded-md mt-3">
            <h1>{data.user.name}</h1>
            <small>{data.user.email}</small>
            <p>Fetched at: {data.timestamp}</p>
        </div>
    );
}

export default async function Page() {
    return (
        <div className="w-full">
            <h1>About Page</h1>
            <p>Using "use cache: private" in getUser function</p>
            <Suspense fallback={<p>Loading with fake 2s sleep...</p>}>
                <Content />
            </Suspense>
        </div>
    )
}


