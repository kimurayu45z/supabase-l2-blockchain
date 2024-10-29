export function canonicalizeObjectForSerialization(value: object): unknown {
	if (Object.prototype.toString.call(value) === '[object Object]') {
		const sorted = {} as Record<string, unknown>;
		const keys = Object.keys(value).sort();

		for (const key of keys) {
			const keyValue = (value as Record<string, unknown>)[key];
			if (keyValue != null) {
				sorted[key] = canonicalizeObjectForSerialization(keyValue);
			}
		}

		return sorted;
	}

	if (Array.isArray(value)) {
		return value.map((element) => canonicalizeObjectForSerialization(element));
	}

	return value === undefined ? null : value;
}
