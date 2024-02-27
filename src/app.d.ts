// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		type CodeEntry = {
			code: string;
			description: string;
			hcc_v24?: number;
			hcc_v28?: number;
			is_specific?: boolean;
			children?: Array<CodeEntry>
			parent?: CodeEntry;
		}
	}
}

export {};