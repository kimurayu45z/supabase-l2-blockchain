export type Any = {
	type: string;
	value: unknown;
};

export interface AnyPossible {
	constructor: AnyPossibleConstructor<typeof this>;
	value: unknown;
}

export interface AnyPossibleConstructor<T extends AnyPossible = AnyPossible> {
	type(): string;
	new (value: any): T;
}
