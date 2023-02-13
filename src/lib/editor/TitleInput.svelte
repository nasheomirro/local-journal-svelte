<script lang="ts">
	export let title: string;
</script>

<div class="mb-4 text-sm">
	<label for="entry-title" class="pr-1 font-medium">label:</label>
	<input
    on:keydown
		bind:value={title}
		id="entry-title"
		class="focus:outline-none dark:bg-stone-800 border-stone-200 dark:border-b-0 border-b p-1 sm:px-2 w-60"
	/>
</div>
