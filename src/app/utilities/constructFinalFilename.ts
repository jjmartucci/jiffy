import { createId } from "@paralleldrive/cuid2";

// ehhhh this could be better?
export const constructFinalFileName = (name: string, type: string) => {
  const cuid = createId();
  return {
    filename: `${name}-${cuid}.${type}`,
    cuid,
  };
};
