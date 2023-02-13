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
	import { formatDate } from '$lib/utils';

	export let entry: Entry;

	let draft = { ...entry };
	let element: HTMLDivElement;
	let editor: Editor;
	let isUnsaved = false;

	const handleSave = async () => {
		await entries.updateEntry({ ...draft, content: editor.getHTML() });
		isUnsaved = false;
	};

	let debounceTimeId: null | NodeJS.Timeout = null;
	const debounceTime = 4000;

	const debounceSave = () => {
		if (debounceTimeId) clearTimeout(debounceTimeId);
		debounceTimeId = setTimeout(() => {
			if (isUnsaved) handleSave();
		}, debounceTime);
		isUnsaved = true;
	};

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
			content: draft.content,
			onUpdate: debounceSave,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});

		const warnUserListener = (e: BeforeUnloadEvent) => {
			if (isUnsaved) {
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
	<title>{`${isUnsaved ? '• ' : ''}${draft.title || formatDate(draft.date)}`}</title>
</svelte:head>
<svelte:window on:keydown={handleCustomShortcuts} />

{#if editor}
	<EditorNavbar on:save={handleSave} />
	<TitleInput on:keydown={debounceSave} bind:title={draft.title} />
	<EditorToolbar {editor} />
{/if}

<div
	class="flex min-h-[30rem] dark:bg-stone-800 border border-stone-200 dark:border-none rounded-sm p-2 xs:p-3 sm:p-4"
	bind:this={element}
/>

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
