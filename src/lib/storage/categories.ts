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

const switchCategories = async (categoryIds: [string, string]) => {
	const dbStore = db.transaction('categories', 'readwrite').objectStore('categories');
	const firstCategory = await dbStore.get(categoryIds[0]);
	const secondCategory = await dbStore.get(categoryIds[1]);
	if (firstCategory && secondCategory) {
		await dbStore.put({ ...secondCategory, index: firstCategory.index });
		await dbStore.put({ ...firstCategory, index: secondCategory.index });
	}

	postMessage({ type: 'switchCategories', payload: categoryIds });
	update((categories) => {
		const first = categories.find((category) => category.id === categoryIds[0]);
		const second = categories.find((category) => category.id === categoryIds[1]);
		if (!first || !second) return categories;
		return categories
			.map((category) => {
				switch (category.id) {
					case first.id:
						return { ...first, index: second.index };
					case second.id:
						return { ...second, index: first.index };
					default:
						return category;
				}
			})
			.sort((a, b) => a.index - b.index);
	});
};

const updateCategories = async (categories: Category[]) => {
	const dbStore = db.transaction('categories', 'readwrite').objectStore('categories');
	const promises = categories.map((category) => dbStore.put(category));

	await Promise.all(promises);
	postMessage({ type: 'updateCategories', payload: categories });
	set(categories);
};

const deleteCategory = async (category: Category) => {
	await entries.deleteEntriesByCategory(category);

	// deleting main will only clear it.
	if (category.id !== 'main') {
		await db.delete('categories', category.id);
		postMessage({ type: 'deleteCategory', payload: category });
		update((categories) => categories.filter((existing) => existing.id !== category.id));
	}
};

export const categories = {
	subscribe,
	createCategory,
	updateCategory,
	deleteCategory,
	updateCategories,
	switchCategories
};
