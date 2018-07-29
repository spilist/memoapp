const byUpdatedAt = (a, b) => {
  return a.updatedAt > b.updatedAt ? -1 : 1;
};

export default {
  byUpdatedAt,
};
