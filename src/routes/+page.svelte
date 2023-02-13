<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { nanoid } from 'nanoid';

	import type { Entry } from '$lib/types';
	import { entries } from '$lib/entries/store';
	import { formatDate } from '$lib/utils';
	import ThemeToggle from '$lib/theme/ThemeToggle.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	const createEntry = async () => {
		const newEntry: Entry = {
			title: '',
			id: nanoid(),
			date: new Date(),
			content: ''
		};
		await entries.createEntry(newEntry);
	};

	const deleteEntry = async (entry: Entry) => {
		await entries.deleteEntry(entry);
	};
</script>

<svelte:head>
	<title>Journal</title>
</svelte:head>

<Navbar>
	<div class="flex gap-2 items-center ml-auto">
		<ThemeToggle />
	</div>
</Navbar>

<button
	class="w-full p-2 mb-4 dark:hover:transition-colors border rounded-sm bg-white border-stone-200 text-stone-500 dark:text-white dark:bg-stone-800 dark:hover:bg-stone-600 dark:opacity-50 dark:border-none"
	on:click={createEntry}>new entry</button
>

<ul>
	{#each $entries as entry (entry.id)}
		<li
			transition:fade|local={{ duration: 200 }}
			animate:flip={{ duration: 400 }}
			class="flex flex-col xs:flex-row justify-between items-center bg-white rounded-sm dark:bg-stone-800 dark:border-none py-2 px-3 border border-stone-200 mb-2 xs:border-b"
		>
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

{#if $entries.length === 0}
	<div class="py-32 flex justify-center px-3 sm:px-4 text-stone-500 dark:opacity-80 text-center">
		Hello, welcome to journaling! You can create your first entry by clicking the button above,
		provide a title and the content for what happened that day.
	</div>
{/if}
