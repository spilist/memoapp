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
      update: '/labels/:id',
      delete: '/labels/:id',
      addMemos: '/labels/:id/memos',
      deleteMemos: '/labels/:id/memos',
    },
  },
};
