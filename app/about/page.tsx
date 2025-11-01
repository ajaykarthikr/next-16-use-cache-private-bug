import { getUser } from "@/lib/user";
import { Suspense } from "react";

async function Content() {
    const data =  await getUser();

    return (
        <div>
            <h1>{data.user.name}</h1>
            <small>{data.user.email}</small>
            <p>Fetched at: {data.timestamp}</p>
        </div>
    );
}

export default async function Page() {
    return (
        <div>
            <h1>About Page</h1>
            <p>Using "use cache: private" in <pre>getUser</pre> function</p>
            <Suspense fallback={<p>Loading with fake 5s sleep...</p>}>
                <Content />
            </Suspense>
        </div>
    )
}


