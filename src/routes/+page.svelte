<script lang="ts">
	import { page } from '$app/stores';

	import ThemeToggle from '$lib/theme/ThemeToggle.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Categories from '$lib/home/Categories.svelte';
	import Entries from '$lib/home/Entries.svelte';
	import { categories } from '$lib/storage/categories';
	import EmptyMessage from '$lib/components/EmptyMessage.svelte';

	$: activeCategoryId = $page.url.searchParams.get('c') || 'main';
</script>

<svelte:head>
	<title>Journal</title>
</svelte:head>

<Navbar>
	<div class="flex gap-2 items-center ml-auto">
		<ThemeToggle />
	</div>
</Navbar>

<Categories categoryId={activeCategoryId} />

{#if $categories.find((category) => category.id === activeCategoryId)}
	<Entries categoryId={activeCategoryId} />
{:else}
	<EmptyMessage>This category was either deleted or doesn't exist.</EmptyMessage>
{/if}
