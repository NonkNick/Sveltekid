import type { PageServerLoad } from './$types';
import { getPostBySlug } from "../lib/server/queries/posts";

export const load: PageServerLoad = async ({ params }) => {
    return {
        post: await getPostBySlug(params.slug)
    };
};