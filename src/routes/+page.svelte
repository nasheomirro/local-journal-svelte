<script lang="ts">
	import { goto } from '$app/navigation';
	import { entries } from '$lib/entries/store';
	import type { Entry } from '$lib/types';
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

<div>
	<button on:click={createEntry}>New entry</button>
	<ul>
		{#each $entries as entry}
			<li>{entry.date}</li>
		{/each}
	</ul>
</div>
