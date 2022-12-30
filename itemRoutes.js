const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();

const USERS = [
  { id: 1, username: 'VJC123' },
  { id: 2, username: 'EHC123' },
];

const items = global.items;
items.push({ name: 'popsicle', price: 1.45 }, { name: 'cheerios', price: 3.4 });

router.get('/', (req, res, next) => {
  try {
    return res.json({ items: items });
  } catch (e) {
    next(e);
  }
});
// ***************************************************************************************************

router.post('/', (req, res, next) => {
  try {
    if (req.body.name) {
      items.push({ name: `${req.body.name}`, price: req.body.price });
    } else {
      return res.status(400).send('The item needs a name');
    }
    return res.json({
      added: { name: `${req.body.name}`, price: req.body.price },
      // added: { name: `${req.params.name}`, price: req.params.price },
    });
  } catch (e) {
    return next(e);
  }
});
// ***************************************************************************************************

router.get('/:name', (req, res, next) => {
  try {
    const item = items.find((i) => i.name === req.params.name);
    if (item) {
      return res.json({ item });
    } else {
      return res.status(404).send('That item is not in stock.');
    }
  } catch (e) {
    return next(e);
  }
});
// ***************************************************************************************************

router.patch('/:name', (req, res, next) => {
  try {
    const item = items.find((i) => i.name === req.params.name);
    if (item) {
      item.name = req.body.name;
      item.price = req.body.price;
    } else {
      return res.status(404).send('That item is not in stock.');
    }
    return res.json({ item });
  } catch (e) {
    return next(e);
  }
});
// ***************************************************************************************************

router.delete('/:name', (req, res, next) => {
  try {
    const item = items.find((i) => i.name === req.params.name);
    const index = items.indexOf(item);
    if (index === -1) {
      return res
        .status(404)
        .send('This product is not in stock and cannot be removed.');
      // return new ExpressError('Item not in stock', 404);
      // return newErr;
    }
    items.splice(index, 1);
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.log(e.status);
    return next(e);
  }
});

module.exports = router;
