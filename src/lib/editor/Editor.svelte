<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import EditorToolbar from './EditorToolbar.svelte';
	import type { Entry } from '$lib/types';
	import { entries } from '$lib/entries/store';

	export let entry: Entry;

	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
			content: entry.content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});

		return () => {
			editor.destroy();
		};
	});

	const handleCustomShortcuts = async (e: KeyboardEvent) => {
		const mod = e.ctrlKey || e.metaKey;
		if (mod && e.key === 'S') {
			e.preventDefault();
			await entries.updateEntry({ ...entry, content: editor.getHTML() });
		}
	};
</script>

{#if editor}
	<EditorToolbar {editor} />
{/if}

<div bind:this={element} on:keydown={handleCustomShortcuts} />

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
