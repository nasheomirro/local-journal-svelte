import { db } from '$lib/storage/idb';
import type { Category, Entry } from '$lib/types';
import { get, writable, type Writable } from 'svelte/store';
import { EntryChannel } from './channels';

export type EntryStore = Writable<Entry[]>;

const getInitialValue = async () => {
	const entries = [];
	let cursor = await db
		.transaction('entries', 'readonly')
		.objectStore('entries')
		.index('by-date')
		.openCursor();

	while (cursor) {
		const entry = cursor.value;
		entries.unshift(entry);
		cursor = await cursor.continue();
	}
	return entries;
};

const initialValue = await getInitialValue();
const { set, subscribe, update } = writable(initialValue);
const { postMessage } = new EntryChannel({ set, subscribe, update });

const createEntry = async (entry: Entry) => {
	await db.add('entries', entry);
	postMessage({ type: 'createEntry', payload: entry });
	update((entries) => [entry, ...entries]);
};

const updateEntry = async (entry: Entry) => {
	await db.put('entries', entry);
	postMessage({ type: 'updateEntry', payload: entry });
	update((entries) => entries.map((existing) => (existing.id === entry.id ? entry : existing)));
};

const deleteEntry = async (entry: Entry) => {
	await db.delete('entries', entry.id);
	postMessage({ type: 'deleteEntry', payload: entry });
	update((entries) => entries.filter((existing) => existing.id !== entry.id));
};

const deleteEntriesByCategory = async (category: Category) => {
	const dbStore = db.transaction('entries', 'readwrite').objectStore('entries');

	const entriesToDelete = get({ subscribe }).filter((entry) => entry.categoryId === category.id);
	const promises = entriesToDelete.map((entry) => dbStore.delete(entry.id));

	await Promise.all(promises);
	postMessage({ type: 'deleteEntriesByCategory', payload: category });
	update((entries) => {
		const deleteIds = entriesToDelete.map((entry) => entry.id);
		return entries.filter((existing) => !deleteIds.includes(existing.id));
	});
};

export const entries = {
	subscribe,
	createEntry,
	updateEntry,
	deleteEntry,
	deleteEntriesByCategory
};
