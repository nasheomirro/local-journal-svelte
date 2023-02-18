<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { nanoid } from 'nanoid';
	import { categories } from '$lib/storage/categories';
	import type { Category } from '$lib/types';

	import IconButton from '$lib/components/IconButton.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import CloseIcon from './CloseIcon.svelte';
	import PlusIcon from './PlusIcon.svelte';

	export let onExit: () => void;

	const editCategory = (e: Event & { currentTarget: HTMLFormElement }, category: Category) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		categories.updateCategory({
			...category,
			name: formData.get('category-name')?.toString() || category.name
		});
	};

	const createCategory = () => {
		categories.createCategory({
			name: 'no-name',
			index: $categories.length,
			id: nanoid()
		});
	};

	const deleteCategory = (category: Category) => {
		categories.deleteCategory(category);
	};
</script>

<Modal {onExit}>
	<div
		transition:fly={{ y: 20, duration: 100 }}
		class="max-w-screen-sm bg-white dark:bg-stone-800 min-h-[10rem] py-3 w-full rounded"
	>
		<div class="flex items-center px-4 mb-3">
			<span class="font-bold block">Categories</span>
			<div class="flex gap-2 ml-auto">
				<IconButton class="dark:border-stone-600 dark:border-solid" on:click={createCategory}>
					<span class="sr-only">create new category</span>
					<PlusIcon />
				</IconButton>
				<IconButton class="dark:border-stone-600 dark:border-solid" on:click={onExit}>
					<span class="sr-only">close category settings</span>
					<CloseIcon />
				</IconButton>
			</div>
		</div>
		<ul
			class="flex flex-col gap-1 h-40 overflow-y-scroll scrollbar-thin pl-4 pr-6 scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-700 dark:scrollbar-track-stone-900"
		>
			{#each $categories as category (category.id)}
				<li transition:fade|local={{ duration: 200 }} animate:flip={{ duration: 200 }}>
					<form
						class="flex items-end flex-wrap bg-white dark:bg-stone-800"
						on:submit={(e) => editCategory(e, category)}
					>
						<input
							name="category-name"
							class="focus:outline-none bg-transparent border-stone-200 dark:border-b-stone-600 border-b p-1 sm:px-2 w-60"
							value={category.name}
						/>
						<div class="ml-auto flex flex-wrap gap-4">
							{#if category.id !== 'main'}
								<button
									type="button"
									class="text-sm text-red-400"
									on:click={() => deleteCategory(category)}>delete</button
								>
							{/if}
							<button class="text-sm">save</button>
						</div>
					</form>
				</li>
			{/each}
		</ul>
	</div>
</Modal>
