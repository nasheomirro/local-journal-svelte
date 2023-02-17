import type { Category, Entry } from '$lib/types';
import { openDB, type DBSchema } from 'idb';

interface JournalSchema extends DBSchema {
	entries: {
		key: string;
		value: Entry;
		indexes: { 'by-date': Date };
	};
	categories: {
		key: string;
		value: Category;
		indexes: { 'by-index': number };
	};
}

const db = await openDB<JournalSchema>('journal', 1, {
	upgrade: (db) => {
		const entries = db.createObjectStore('entries', { keyPath: 'id' });
		entries.createIndex('by-date', 'date');

		const categories = db.createObjectStore('categories', { keyPath: 'id' });
		categories.add({ name: 'main', index: 0, id: 'main' });
		categories.createIndex('by-index', 'index');
	}
});

export { db };
