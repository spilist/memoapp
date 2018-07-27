var express = require('express');
var router = express.Router();

var Label = require('../models/Label.js');

/* GET /labels listing. */
router.get('/', function(req, res, next) {
  var query;
  if (req.query.populate === 'false') {
    query = Label.find();
  } else {
    query = Label.find().populate('memos');
  }
  query
    .exec(function (err, labels) {
      if (err) return next(err);
      res.json(labels);
    })
});

/* POST /labels */
router.post('/', function(req, res, next) {
  Label
    .create(req.body, function (err, label) {
      if (err) return next(err);
      res.json(label);
    });
});

/* GET /labels/:id */
router.get('/:id', function(req, res, next) {
  Label
    .findById(req.params.id)
    .populate('memos')
    .exec(function (err, label) {
      if (err) return next(err);
      res.json(label);
    })
});

/* PUT /labels/:id */
router.put('/:id', function(req, res, next) {
  Label
    .findByIdAndUpdate(req.params.id, req.body, {new: true})
    .populate('memos')
    .exec(function (err, label) {
      if (err) return next(err);
      res.json(label);
    });
});

/* DELETE /labels/:id */
router.delete('/:id', function(req, res, next) {
  Label
    .findByIdAndRemove(req.params.id, req.body)
    .populate('memos')
    .exec(function (err, label) {
      if (err) return next(err);
      res.json(label);
    });
});

/* POST /:id/memos */
router.post('/:id/memos', function(req, res, next) {
  var memoIds = req.body.memoIds || [];
  Label
    .findByIdAndUpdate(req.params.id, { $addToSet: { memos: { $each: memoIds } } }, {new: true})
    .populate('memos')
    .exec(function (err, label) {
      if (err) return next(err);
      res.json(label);
    });
});

/* DELETE /:id/memos */
router.delete('/:id/memos', function(req, res, next) {
  var memoIds = req.body.memoIds || [];
  Label
    .findByIdAndUpdate(req.params.id, { $pop: { memos: { $each: memoIds } } }, {new: true})
    .populate('memos')
    .exec(function (err, label) {
      if (err) return next(err);
      res.json(label);
    });
});

module.exports = router;
