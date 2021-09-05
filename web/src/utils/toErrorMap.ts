import type { FieldError } from '../generated';

export const toErrorMap = (errors: FieldError[]) => {
	const map: Record<string, string> = {};
	// const map: { [field: string]: string } = {};
	errors.forEach(
		({ field, message }) => (map[field] = message)
	);

	return map;
};
