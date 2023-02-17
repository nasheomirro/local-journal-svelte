import { writable, type Writable } from 'svelte/store';
import type { Category } from '$lib/types';

import { CategoryChannel } from './channels';
import { entries } from './entries';
import { db } from './idb';

export type CategoryStore = Writable<Category[]>;

const getInitialValue = async () => {
	return await db.getAllFromIndex('categories', 'by-index');
};

const initialValue = await getInitialValue();
const { set, subscribe, update } = writable(initialValue);
const { postMessage } = new CategoryChannel({ set, subscribe, update });

const createCategory = async (category: Category) => {
	await db.add('categories', category);
	postMessage({ type: 'createCategory', payload: category });
	update((categories) => [...categories, category]);
};

const updateCategory = async (category: Category) => {
	await db.put('categories', category);
	postMessage({ type: 'updateCategory', payload: category });
	update((categories) =>
		categories.map((existing) => (existing.id === category.id ? category : existing))
	);
};

const deleteCategory = async (category: Category) => {
	await entries.deleteEntriesByCategory(category);
	await db.delete('categories', category.id);
	postMessage({ type: 'deleteCategory', payload: category });
	update((categories) => categories.filter((existing) => existing.id !== category.id));
};

export const categories = { subscribe, createCategory, updateCategory, deleteCategory };
