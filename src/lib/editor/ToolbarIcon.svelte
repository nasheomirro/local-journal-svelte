<script lang="ts">
	import { twJoin } from 'tailwind-merge';

	export let active: boolean;
</script>

<button on:click
	class={twJoin(
		'flex h-auto w-6 p-1 sm:w-7 items-center justify-center sm:p-1.5',
		active && 'bg-black dark:bg-stone-800 text-white'
	)}
>
	<slot />
</button>
