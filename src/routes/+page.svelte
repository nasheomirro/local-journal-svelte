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

	const deleteEntry = async (entry: Entry) => {
		await entries.deleteEntry(entry);
	};
</script>

<svelte:head>
	<title>Journal</title>
</svelte:head>

<Navbar>
	<button class="ml-auto" on:click={createEntry}>New entry</button>
</Navbar>

<ul>
	{#each $entries as entry}
		<li class="flex justify-between px-2 pb-2">
			<span class="w-full">
				{entry.date}
			</span>
			<div class="flex gap-6">
        <button class="text-red-400" on:click={() => deleteEntry(entry)}>Delete</button>
				<a href={entry.id}>Edit</a>
			</div>
		</li>
	{/each}
</ul>
