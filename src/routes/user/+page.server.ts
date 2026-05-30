import type { PageServerLoad } from "./$types";
import { getUserById } from "$lib/server/queries/user";

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user ? await getUserById(locals.user.id) : null
	};
};
