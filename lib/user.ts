import { cookies } from "next/headers";
import { cacheTag, cacheLife } from "next/cache";

export async function getUser() {
    "use cache: private";
    cacheTag(`userdata`);
    cacheLife({ stale: 31, revalidate: 32, expire: 33 });

    const sessionId = (await cookies()).get('session-id')?.value || 'guest'

    console.log("Got user cookies", sessionId)

    console.log("Fetching user data");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const timestamp = new Date().toISOString();

    return {
        user: {
            name: "Ajay",
            email: "ajay@example.com"
        },
        timestamp: timestamp,
    }
}