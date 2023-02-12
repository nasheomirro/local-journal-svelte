<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import EditorToolbar from './EditorToolbar.svelte';
	import type { Entry } from '$lib/types';
	import { entries } from '$lib/entries/store';
	import EditorNavbar from './EditorNavbar.svelte';
	import { writable } from 'svelte/store';
	import TitleInput from './TitleInput.svelte';

	export let entry: Entry;

	let element: HTMLDivElement;
	let editor: Editor;
	let isUnsaved = writable(false);

	const handleSave = async () => {
		await entries.updateEntry({ ...entry, content: editor.getHTML() });
		$isUnsaved = false;
	};

	let debounceTimeId: null | NodeJS.Timeout = null;
	const debounceTime = 4000;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
			content: entry.content,
			onUpdate: () => {
				if (debounceTimeId) clearTimeout(debounceTimeId);
				debounceTimeId = setTimeout(() => {
					if ($isUnsaved) handleSave();
				}, debounceTime);
				$isUnsaved = true;
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});

		const warnUserListener = (e: BeforeUnloadEvent) => {
			if ($isUnsaved) {
				return (e.returnValue = 'changes may not be saved.');
			}
		};

		window.addEventListener('beforeunload', warnUserListener);

		return () => {
			editor.destroy();
			window.removeEventListener('beforeunload', warnUserListener);
			debounceTimeId && clearTimeout(debounceTimeId);
		};
	});

	const handleCustomShortcuts = async (e: KeyboardEvent) => {
		const mod = e.ctrlKey || e.metaKey;
		if (mod && e.key === 's') {
			e.preventDefault();
			await handleSave();
		}
	};
</script>

<svelte:head>
	<title>{`${$isUnsaved ? '• ' : ''}${entry.date}`}</title>
</svelte:head>

{#if editor}
	<EditorNavbar on:save={handleSave} />
	<TitleInput bind:title={entry.title} />
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
