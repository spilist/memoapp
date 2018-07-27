var mongoose = require('mongoose');

var MemoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Memo', MemoSchema);
