const sortByUpdatedAt = (a, b) => {
  return a.updatedAt > b.updatedAt ? -1 : 1;
};

const _intersect2 = (xs, ys) => xs.filter(x => ys.some(y => y === x));

const intersect = (xs, ys, ...rest) =>
  ys === undefined ? xs : intersect(_intersect2(xs, ys), ...rest);

export default {
  sortByUpdatedAt,
  intersect,
};
