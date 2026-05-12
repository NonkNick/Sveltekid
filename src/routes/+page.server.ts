import type { PageServerLoad } from './$types';
import { getRecentPosts } from "../lib/server/queries/posts";

export const load: PageServerLoad = async () => {
	return {
		posts: await getRecentPosts()
	};
};