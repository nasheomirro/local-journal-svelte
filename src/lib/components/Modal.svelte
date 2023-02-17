<script lang="ts">
	import { onMount } from 'svelte';
	// svelte has no native portal API unlike react
	// https://github.com/sveltejs/svelte/issues/3088

	let modal: HTMLDivElement;
	onMount(() => {
		let portal = document.createElement('div');
		document.body.appendChild(portal);
		portal.appendChild(modal);

		return () => document.body.removeChild(portal);
	});
</script>

<div bind:this={modal}>
	<slot />
</div>
