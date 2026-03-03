import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// destructure request headers check if sessie
const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	// populate sveltekit locals. server side user tijdelijk voor elke req
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	// wrapper voor svelte response() voor better auth
	return svelteKitHandler({ event, resolve, auth, building });
};

// basically een middleware voor handle bij elke request, rename
export const handle: Handle = handleBetterAuth;
