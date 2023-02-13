<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	interface $$Props extends HTMLButtonAttributes {
		class?: string | undefined;
	}
</script>

<button
	on:click
	{...$$restProps}
	class={twMerge(
		`px-4 py-1 transition-colors border border-stone-200 hover:border-red-600 dark:border-none dark:bg-stone-800 dark:hover:bg-stone-600 text-sm`,
		$$restProps.class || ''
	)}
>
	<slot />
</button>
