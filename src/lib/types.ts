export type Entry = Readonly<{
  title: string;
	id: string;
	content: string;
	date: Date;
  category?: string;
}>;

type GetValues<T> = T[keyof T];
type FunctionToMessage<Fn, Key> = Fn extends (p: infer P) => unknown
	? unknown extends P
		? {
				type: Key;
		  }
		: P extends undefined
		? {
				type: Key;
				payload?: P;
		  }
		: {
				type: Key;
				payload: P;
		  }
	: never;
export type ActionMessages<P> = GetValues<{ [K in keyof P]: FunctionToMessage<P[K], K> }>;
