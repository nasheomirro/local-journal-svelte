<script lang="ts">
	import { theme } from '$lib/theme/store';
	import { onMount } from 'svelte';
	import '../app.css';

	let root: HTMLElement;
	onMount(() => {
		root = document.documentElement;
	});

	$: root && ($theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark'));
</script>

<div class="px-2 py-4 w-full flex min-h-screen max-w-screen-md mx-auto">
	<div class="grow flex flex-col">
		<slot />
	</div>
</div>
