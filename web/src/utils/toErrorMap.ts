import type { FieldError } from '../generated';

export const toErrorMap = (errors: FieldError[]) => {
	const map: NodeJS.Dict<string> = {};
	// const map: { [field: string]: string | undefined } = {};
	errors.forEach(
		({ field, message }) => (map[field] = message)
	);

	return map;
};
