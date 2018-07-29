export default {
  endPoints: {
    memo: {
      list: '/memos',
      create: '/memos',
      get: '/memos/:id',
      update: '/memos/:id',
      delete: '/memos/:id',
    },
    label: {
      list: '/labels',
      create: '/labels',
    },
  },
};
