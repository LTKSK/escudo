export type Group = {
  ids: number[];
};

function is(target: unknown): target is Group {
  if (!Array.isArray((target as Group).ids)) {
    return false;
  }
  if (
    !(target as Group).ids.every((id): id is number => typeof id === "number")
  ) {
    return false;
  }
  return true;
}
