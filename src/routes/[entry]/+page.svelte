<script lang="ts">
	import Editor from '$lib/editor/Editor.svelte';
	import { entries } from '$lib/entries/store';
	import type { PageData } from './$types';

	export let data: PageData;
	let entry = $entries.find((entry) => entry.id === data.id);
</script>

{#if entry}
	<Editor {entry} />
{:else}
	<div>Entry does not exist!</div>
{/if}
