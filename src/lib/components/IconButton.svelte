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
		`w-8 h-8 flex justify-center items-center transition-all rounded-full border border-stone-200 dark:border-none dark:bg-stone-800 dark:hover:bg-stone-600 relative text-red-500 hover:border-red-500`,
		$$restProps.class || ''
	)}
>
	<div class="w-6 h-6">
		<slot />
	</div>
</button>
