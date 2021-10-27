import {
  object,
  number,
  string,
  Describe,
  coerce,
  optional,
  min,
} from "superstruct";

export * from "./user.dto";
export * from "./auth.dto";

const NumberString = coerce(number(), string(), value => parseFloat(value));

export interface IPagination {
  page?: number;
  size?: number;
}

export const PaginationQueryDto: Describe<IPagination> = object({
  page: optional(min(NumberString, 1)),
  size: optional(NumberString),
});
