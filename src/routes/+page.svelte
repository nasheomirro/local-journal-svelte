<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { nanoid } from 'nanoid';

	import type { Entry } from '$lib/types';
	import { entries } from '$lib/entries/store';
	import { formatDate } from '$lib/utils';
	import ThemeToggle from '$lib/theme/ThemeToggle.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/Button.svelte';
	import { twMerge } from 'tailwind-merge';

	$: activeCategory = $page.url.searchParams.get('c');
	$: filteredEntries = $entries.filter((entry) => entry.category === (activeCategory || 'main'));

	const categories = ['main', 'wisdom', 'projects'];

	const createEntry = async () => {
		const newEntry: Entry = {
			title: '',
			id: nanoid(),
			date: new Date(),
			content: '',
			category: activeCategory || 'main'
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

<div class="flex flex-wrap gap-2 mb-2">
	{#each categories as category}
		<a
			href={`?c=${category}`}
			class={twMerge(
				` transition-colors py-1.5 px-4 text-sm inline-block rounded-2xl border border-stone-200 dark:border-stone-900 dark:bg-stone-800`,
				activeCategory === category ? 'bg-red-400 text-white dark:bg-stone-700' : ''
			)}>{category}</a
		>
	{/each}
</div>

<div class="grid">
	{#key activeCategory}
		<div
			in:fly|local={{ x: 40, duration: 200, delay: 100 }}
			out:fly|local={{ x: -40, duration: 200 }}
			class="w-full in-place inline-block row-start-1 row-end-1 col-start-1 col-end-1"
		>
			<Button class="w-full p-2 mb-4 text-base" on:click={createEntry}>new entry</Button>
			<ul>
				{#each filteredEntries as entry (entry.id)}
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
				<div
					class="py-32 flex justify-center px-3 sm:px-4 text-stone-500 dark:opacity-80 text-center"
				>
					Hello, welcome to journaling! You can create your first entry by clicking the button
					above, provide a title and the content for what happened that day.
				</div>
			{:else if filteredEntries.length === 0}
				<div
					class="py-32 flex justify-center px-3 sm:px-4 text-stone-500 dark:opacity-80 text-center"
				>
					This category doesn't have entries, either create a new entry by pressing the button
					above.
				</div>
			{/if}
		</div>
	{/key}
</div>
