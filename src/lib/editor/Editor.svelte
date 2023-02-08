<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import EditorToolbar from './EditorToolbar.svelte';

	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
			content: '<p>Hello World! 🌍️ </p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

{#if editor}
	<EditorToolbar {editor} />
{/if}

<div bind:this={element} />

<style>
	:global(.ProseMirror) {
		@apply outline-none grow;
	}

  :global(.ProseMirror > p) {
    @apply mb-2;
  }

	:global(.ProseMirror > h2) {
		@apply font-sans text-2xl font-bold mb-2;
	}
	:global(.ProseMirror > h3) {
		@apply font-sans text-xl font-bold mb-2;
	}
	:global(.ProseMirror > h4) {
		@apply font-sans text-lg font-bold mb-2;
	}
  :global(.ProseMirror > ul) {
    @apply list-disc pl-4 mb-2;
  }
  :global(.ProseMirror > ol) {
    @apply list-decimal pl-4 mb-2;
  }
</style>
