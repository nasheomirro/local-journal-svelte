import type { ActionMessages, Category, Entry } from '$lib/types';
import type { CategoryStore } from './categories';
import type { EntryStore } from './entries';

interface EntryChannelActions {
	createEntry: (payload: Entry) => void;
	updateEntry: (payload: Entry) => void;
	deleteEntry: (payload: Entry) => void;
	deleteEntriesByCategory: (payload: Category) => void;
}

interface CategoryChannelActions {
	createCategory: (payload: Category) => void;
	updateCategory: (payload: Category) => void;
	deleteCategory: (payload: Category) => void;
	switchCategories: (payload: [string, string]) => void;
	updateCategories: (payload: Category[]) => void;
}

type EntryMessages = ActionMessages<EntryChannelActions>;
type CategoryMessages = ActionMessages<CategoryChannelActions>;

export class EntryChannel {
	postMessage: (message: EntryMessages) => void;

	constructor({ update }: EntryStore) {
		const channel = new BroadcastChannel('entries');
		this.postMessage = channel.postMessage.bind(channel);

		const actions: EntryChannelActions = {
			createEntry: (entry) => {
				update((entries) => [entry, ...entries]);
			},
			updateEntry: (entry) => {
				update((entries) =>
					entries.map((existing) => (existing.id === entry.id ? entry : existing))
				);
			},
			deleteEntry: (entry) => {
				update((entries) => entries.filter((existing) => existing.id !== entry.id));
			},
			deleteEntriesByCategory: (category: Category) => {
				update((entries) => {
					const deleteIds = entries
						.filter((entry) => entry.categoryId !== category.id)
						.map((entry) => entry.id);
					return entries.filter((existing) => !deleteIds.includes(existing.id));
				});
			}
		};

		channel.onmessage = (e: MessageEvent<EntryMessages>) => {
			const { payload, type } = e.data;
			if (actions[type]) {
				// @ts-ignore: type and payload should be matching when received
				actions[type](payload);
			}
		};
	}
}

export class CategoryChannel {
	postMessage: (message: CategoryMessages) => void;

	constructor({ update, set }: CategoryStore) {
		const channel = new BroadcastChannel('categories');
		this.postMessage = channel.postMessage.bind(channel);

		const actions: CategoryChannelActions = {
			createCategory: (category) => {
				update((categories) => [...categories, category]);
			},
			updateCategory: (category) => {
				update((categories) =>
					categories.map((existing) => (existing.id === category.id ? category : existing))
				);
			},
			deleteCategory: (category) => {
				update((categories) => categories.filter((existing) => existing.id !== category.id));
			},
			switchCategories: (categoryIds) => {
				update((categories) => {
					const first = categories.find((category) => category.id === categoryIds[0]);
					const second = categories.find((category) => category.id === categoryIds[1]);
					if (!first || !second) return categories;
					return categories.map((category) => {
						switch (category.id) {
							case first.id:
								return { ...category, index: second.index };
							case second.id:
								return { ...category, index: first.index };
							default:
								return category;
						}
					});
				});
			},

			updateCategories: (categories) => {
				set(categories);
			}
		};

		channel.onmessage = (e: MessageEvent<CategoryMessages>) => {
			const { payload, type } = e.data;
			if (actions[type]) {
				// @ts-ignore: type and payload should be matching when received
				actions[type](payload);
			}
		};
	}
}
