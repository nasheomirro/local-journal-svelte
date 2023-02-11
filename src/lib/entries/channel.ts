import type { ActionMessages, Entry } from '$lib/types';
import type { EntryStore } from './store';

interface ChannelActions {
	createEntry: (payload: Entry) => void;
	updateEntry: (payload: Entry) => void;
	deleteEntry: (payload: Entry) => void;
}

type Messages = ActionMessages<ChannelActions>;

export class EntryChannel {
	postMessage: (message: Messages) => void;

	constructor({ update }: EntryStore) {
		const channel = new BroadcastChannel('entries');
		this.postMessage = channel.postMessage.bind(channel);

		const actions: ChannelActions = {
			createEntry: (entry: Entry) => {
				update((entries) => [entry, ...entries]);
			},
			updateEntry: (entry: Entry) => {
				update((entries) =>
					entries.map((existing) => (existing.id === entry.id ? entry : existing))
				);
			},
			deleteEntry: (entry: Entry) => {
				update((entries) => entries.filter((existing) => existing.id !== entry.id));
			}
		};

		channel.onmessage = (e: MessageEvent<Messages>) => {
			const { payload, type } = e.data;
			if (actions[type]) {
				actions[type](payload);
			}
		};
	}
}
