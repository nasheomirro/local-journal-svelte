<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ save: undefined }>();
</script>

<Navbar>
	<a href="/">back</a>
	<Button on:click={() => dispatch('save')}>save entry</Button>
</Navbar>
