import { object, string, Describe } from "superstruct";

import { ITag } from "models/tag.model";

export type TagCreationParams = Pick<ITag, "name">;
export type TagUpdateParams = TagCreationParams;

export const TagCreateDto: Describe<TagCreationParams> = object({
  name: string(),
});

export const TagUpdateDto: Describe<TagUpdateParams> = object({
  name: string(),
});
