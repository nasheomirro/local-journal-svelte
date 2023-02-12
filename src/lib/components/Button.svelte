<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {
		class?: string | undefined;
	}
</script>

<button
	on:click
	{...$$restProps}
	class={`px-4 py-1 bg-orange-300 text-sm ${$$restProps.class || ''}`}
>
	<slot />
</button>
