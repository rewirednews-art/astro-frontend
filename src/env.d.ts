/// <reference types="astro/client" />

import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase?: SupabaseClient;
		}
	}

	interface ImportMetaEnv {
		readonly SUPABASE_URL?: string;
		readonly SUPABASE_PUBLISHABLE_KEY?: string;
		readonly PUBLIC_SUPABASE_URL?: string;
		readonly SUPABASE_ANON_KEY?: string;
	}
}

export {};
