import type { MsgConstructor } from './msg.ts';

export interface Module {
	name(): string;
	msgs(): MsgConstructor[];
}
