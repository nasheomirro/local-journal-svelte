<script lang="ts">
	import { twJoin } from 'tailwind-merge';

	export let active: boolean;
</script>

<button on:click
	class={twJoin(
		'flex h-auto w-6 items-center justify-center p-1',
		active && 'dark:bg-dark-300 bg-black text-white'
	)}
>
	<slot />
</button>
