import { ErrorObject } from "ajv";

// tslint:disable-next-line:no-var-requires
const ajvValidate = require("../dist/ajv-validate");

export class ValidationError extends Error {
  public readonly name = "ValidationError";

  constructor(public readonly errors: ErrorObject[]) {
    super(formatErrors(errors));
  }
}

function formatErrors(errors: ErrorObject[]): string {
  if (!errors.length) return "No errors";
  return errors.map(err => `${err.dataPath} ${err.message}`).join(", ");
}

/**
 * Validates data with kosko configuration schema. It throws a ValidationError
 * when validation failed.
 *
 * @param data
 */
export function validate(data: any) {
  const valid = ajvValidate(data);
  if (valid) return;

  throw new ValidationError(ajvValidate.errors || []);
}
