<script lang="ts">
	export let title: string;
</script>

<div class="mb-4 text-sm">
	<label for="entry-title" class="pr-1 font-medium">label:</label>
	<input
    on:keydown
		bind:value={title}
		id="entry-title"
		placeholder="it was ..."
		class="focus:outline-none border-b p-1 w-60"
	/>
</div>
