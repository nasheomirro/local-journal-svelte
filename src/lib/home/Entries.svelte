<script lang="ts">
	import { nanoid } from 'nanoid';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';

	import { entries } from '$lib/storage/entries';
	import type { Entry } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import EmptyMessage from '$lib/components/EmptyMessage.svelte';
	import Button from '$lib/components/Button.svelte';

	export let categoryId: string;
	$: filteredEntries = $entries.filter((entry) => entry.categoryId === (categoryId || 'main'));

	const createEntry = async () => {
		const newEntry: Entry = {
			title: '',
			id: nanoid(),
			date: new Date(),
			content: '',
			categoryId
		};
		await entries.createEntry(newEntry);
	};

	const deleteEntry = async (entry: Entry) => {
		await entries.deleteEntry(entry);
	};
</script>

<div class="grid">
	{#key categoryId}
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
				<EmptyMessage>
					Hello, welcome to journaling! You can create your first entry by clicking the button
					above, provide a title and the content for what happened that day.
				</EmptyMessage>
			{:else if filteredEntries.length === 0}
				<EmptyMessage>
					This category doesn't have entries, either create a new entry by pressing the button
					above.
				</EmptyMessage>
			{/if}
		</div>
	{/key}
</div>
