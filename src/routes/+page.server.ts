import type { PageServerLoad } from './$types';
import { getRecentPosts } from "../lib/server/queries/posts";

export const load: PageServerLoad = async ({ params }) => {
    return {
        post: await getRecentPosts()
    };
};