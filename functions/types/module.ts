import type { Inspector } from './inspector.ts';
import type { MsgConstructor } from './msg.ts';

export interface Module {
	name(): string;
	inspectors(): Inspector[];
	msgs(): MsgConstructor[];
}
