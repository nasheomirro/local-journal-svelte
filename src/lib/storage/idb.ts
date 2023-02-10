import type { Entry } from '$lib/types';
import { openDB } from 'idb';
import type { DBSchema } from 'idb/build/entry';

interface JournalSchema extends DBSchema {
	entries: {
		key: string;
		value: Entry;
    indexes: { 'by-date': Date };
	};
}

const db = await openDB<JournalSchema>('journal', 1, {
	upgrade: (db) => {
		const entries = db.createObjectStore('entries', { keyPath: 'id' });
    entries.createIndex('by-date', "date")
	}
});

export { db };
