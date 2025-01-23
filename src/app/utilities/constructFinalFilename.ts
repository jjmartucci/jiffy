import { createId } from "@paralleldrive/cuid2";
import slug from "slug";

// ehhhh this could be better?
export const constructFinalFileName = (name: string, type: string) => {
  const cuid = createId();
  return {
    filename: `${slug(name)}-${cuid}.${type}`,
    cuid,
  };
};
