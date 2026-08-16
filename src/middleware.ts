import { createServerClient } from '@supabase/ssr';
import { defineMiddleware } from 'astro:middleware';

const parseCookies = (header: string | null) => {
	if (!header) return [];
	return header
		.split(';')
		.map((pair) => {
			const index = pair.indexOf('=');
			if (index === -1) return null;
			const name = pair.slice(0, index).trim();
			let value = pair.slice(index + 1).trim();
			try {
				value = decodeURIComponent(value);
			} catch {
				// keep raw value on malformed input
			}
			return { name, value };
		})
		.filter((cookie): cookie is { name: string; value: string } => cookie !== null);
};

export const onRequest = defineMiddleware(async (context, next) => {
	const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
	const supabaseKey =
		import.meta.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.SUPABASE_ANON_KEY;

	if (supabaseUrl && supabaseKey) {
		context.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
			cookies: {
				getAll() {
					return parseCookies(context.request.headers.get('cookie'));
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						context.cookies.set(name, value, options),
					);
				},
			},
		});
	}

	return next();
});
