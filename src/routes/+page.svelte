<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { Entry } from '$lib/types';
	import { goto } from '$app/navigation';
	import { entries } from '$lib/entries/store';
	import { nanoid } from 'nanoid';
	import { formatDate } from '$lib/utils';
	import Button from '$lib/components/Button.svelte';

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
	<Button class="ml-auto" on:click={createEntry}>new entry</Button>
</Navbar>

<ul>
	{#each $entries as entry}
		<li class="flex flex-col xs:flex-row justify-between items-center rounded-sm dark:bg-stone-800 dark:border-none py-2 px-3 border border-stone-200 mb-2 xs:border-b">
			<div class="grid grid-cols-1 xs:grid-cols-2 w-full items-center">
				<span class="font-medium">{entry.title || 'no-title'}</span>
				<div class="w-full text-sm">
					<span class="md:hidden">{formatDate(entry.date, 'short')}</span>
					<span class="hidden md:block">
						{formatDate(entry.date)}
					</span>
				</div>
			</div>
			<div class="flex gap-6 ml-auto text-sm">
				<button class="text-red-400" on:click={() => deleteEntry(entry)}>delete</button>
				<a href={entry.id}>edit</a>
			</div>
		</li>
	{/each}
</ul>
