<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	// svelte has no native portal API unlike react
	// https://github.com/sveltejs/svelte/issues/3088

	export let onExit: () => void;
	let modal: HTMLDivElement;
	onMount(() => {
		let portal = document.createElement('div');
		document.body.appendChild(portal);
		portal.appendChild(modal);

		return () => document.body.removeChild(portal);
	});
</script>

<div bind:this={modal}>
	<div
		transition:fade={{ duration: 100 }}
		class="fixed top-0 left-0 w-full h-full flex items-center justify-center p-2"
	>
		<div
			aria-hidden="true"
			class="bg-stone-900 opacity-60 w-full h-full absolute -z-10"
			on:click={onExit}
		/>
		<slot />
	</div>
</div>
