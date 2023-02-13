<script lang="ts">
	import { fly } from 'svelte/transition';
	import MoonIcon from './MoonIcon.svelte';
	import { theme } from './store';
	import SunIcon from './SunIcon.svelte';

	const toggle = () => ($theme = $theme === 'light' ? 'dark' : 'light');
</script>

<button
	class="w-7 h-7 relative text-red-500 transition-colors"
	on:click={toggle}
>
	<span class="sr-only">switch themes</span>
	{#if $theme === 'dark'}
		<div
			class="w-full h-full absolute top-0 left-0"
			in:fly|local={{ y: 20, duration: 400, delay: 100 }}
			out:fly|local={{ y: -20, duration: 400 }}
		>
			<SunIcon />
		</div>
	{:else if $theme === 'light'}
		<div
			class="w-full h-full absolute top-0 left-0"
			in:fly|local={{ y: 20, duration: 400, delay: 100 }}
			out:fly|local={{ y: -20, duration: 400 }}
		>
			<MoonIcon />
		</div>
	{/if}
</button>
