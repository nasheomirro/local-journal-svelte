<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import { categories } from '$lib/storage/categories';

	import IconButton from '$lib/components/IconButton.svelte';
	import CategoryModal from './categoryModal/CategoryModal.svelte';
	import SettingsIcon from './SettingsIcon.svelte';

	export let categoryId: string;
	let isSettingsOpen = false;

	const toggleSettingsModal = () => (isSettingsOpen = !isSettingsOpen);
</script>

<ul class="flex flex-wrap gap-1.5 mb-2">
	<li>
		<IconButton class="hover:rotate-180 ease-in-out origin-center" on:click={toggleSettingsModal}>
			<span class="sr-only">open category settings</span>
			<SettingsIcon />
		</IconButton>
	</li>
	{#each $categories as category (category.id)}
		<li transition:fade|local={{ duration: 200 }} animate:flip={{ duration: 200 }}>
			<a
				href={`?c=${category.id}`}
				class={twMerge(
					` transition-colors py-1.5 px-4 text-sm inline-block rounded-2xl border border-stone-200 dark:border-stone-900 dark:bg-stone-800`,
					categoryId === category.id ? 'bg-red-400 text-white dark:bg-stone-700' : ''
				)}>{category.name}</a
			>
		</li>
	{/each}
</ul>

{#if isSettingsOpen}
	<CategoryModal onExit={toggleSettingsModal} />
{/if}
