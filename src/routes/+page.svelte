<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { Entry } from '$lib/types';
	import { goto } from '$app/navigation';
	import { entries } from '$lib/entries/store';
	import { nanoid } from 'nanoid';
	import { formatDate } from '$lib/utils';

	const createEntry = async () => {
		const newEntry: Entry = {
      title: '',
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
	<button class="ml-auto" on:click={createEntry}>new entry</button>
</Navbar>

<ul>
	{#each $entries as entry}
		<li class="flex justify-between items-center px-2 py-2 border-b last:border-b-0">
      <div class="grid grid-cols-2 w-full items-center">
        <span>{entry.title || "no-title"}</span>
        <span class="w-full text-sm">
          {formatDate(entry.date)}
        </span>
      </div>
			<div class="flex gap-6">
        <button class="text-red-400" on:click={() => deleteEntry(entry)}>delete</button>
				<a href={entry.id}>edit</a>
			</div>
		</li>
	{/each}
</ul>
