import { writable } from 'svelte/store';

// get from local storage
// if it doesn't exist, get user preference
export type Theme = 'dark' | 'light';

const initialValue: Theme =
	window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const theme = writable<Theme>(initialValue);
