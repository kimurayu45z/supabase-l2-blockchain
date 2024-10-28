import type { Inspector } from './inspector.ts';
import type { MsgConstructor } from './msg.ts';

export interface Module<Schema extends Record<string, unknown>> {
	name(): string;
	inspectors(): Inspector<Schema>[];
	msgs(): MsgConstructor<Schema>[];
}
