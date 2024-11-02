import { DescMessage, fromBinary } from '@bufbuild/protobuf';
import { Any } from '@bufbuild/protobuf/wkt';

export interface AnyPossible {
	toAny(): Any;
}

export interface AnyPossibleConstructor<T extends AnyPossible = AnyPossible> {
	desc(): DescMessage;
	fromAny(value: Any): T;
}
