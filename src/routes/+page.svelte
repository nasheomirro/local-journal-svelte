<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { Entry } from '$lib/types';
	import { goto } from '$app/navigation';
	import { entries } from '$lib/entries/store';
	import { nanoid } from 'nanoid';

	const createEntry = async () => {
		const newEntry: Entry = {
			id: nanoid(),
			date: new Date(),
			content: ''
		};

		await entries.createEntry(newEntry);
		goto(newEntry.id);
	};
</script>

<svelte:head>
  <title>Journal</title>
</svelte:head>

<Navbar>
	<a href="/">Home</a>
	<button on:click={createEntry}>New entry</button>
</Navbar>

<ul>
	{#each $entries as entry}
		<li>
			<a href={entry.id}>
				{entry.date}
			</a>
		</li>
	{/each}
</ul>
