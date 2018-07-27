var mongoose = require('mongoose');

var LabelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    memos: [ {type : mongoose.Schema.ObjectId, ref : 'Memo'} ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Label', LabelSchema);
