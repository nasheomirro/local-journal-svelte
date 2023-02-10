import { db } from '$lib/storage/idb';
import type { Entry } from '$lib/types';
import { writable, type Writable } from 'svelte/store';
import { EntryChannel } from './channel';

export type EntryStore = Writable<Entry[]>;

const initialValue = await db.getAllFromIndex('entries', 'by-date');
const { set, subscribe, update } = writable(initialValue);
const { postMessage } = new EntryChannel({ set, subscribe, update });

const setEntry = async (entry: Entry) => {
	await db.put('entries', entry);
	postMessage({ type: 'setEntry', payload: entry });
	update((entries) => entries.map((existing) => (existing.id === entry.id ? entry : existing)));
};

const deleteEntry = async (entry: Entry) => {
	await db.delete('entries', entry.id);
	postMessage({ type: 'deleteEntry', payload: entry });
	update((entries) => entries.filter((existing) => existing.id !== entry.id));
};

export const entries = { subscribe, setEntry, deleteEntry };
