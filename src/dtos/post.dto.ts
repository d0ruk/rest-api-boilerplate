import {
  object,
  string,
  Describe,
  boolean,
  optional,
  array,
  number,
} from "superstruct";

import { IPost } from "models/post.model";

export type PostCreationParams = Pick<IPost, "title" | "body">;
export type PostUpdateParams = Partial<IPost>;
export type PostTagsParams = { tags: number[] };

export const PostCreateDto: Describe<PostCreationParams> = object({
  title: string(),
  body: string(),
});

export const PostUpdateDto: Describe<PostUpdateParams> = object({
  title: optional(string()),
  body: optional(string()),
  published: optional(boolean()),
});

export const PostTagsDto: Describe<PostTagsParams> = object({
  tags: array(number()),
});
