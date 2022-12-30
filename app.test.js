process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb');

let candy = { name: 'Mars', price: 1.49 };

beforeEach(function () {
  items.length = 0;
  items.push(candy);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe('GET /items', () => {
  test('Get all items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [candy] });
  });
});

describe('POST /items', () => {
  test('Creating an item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Snickers', price: 1.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      added: { item: { name: 'Snickers', price: 1.99 } },
    });
  });
  test('Responds with 400 if name is missing', async () => {
    const res = await request(app).post('/items').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /items/:name', () => {
  test('Get item by name', async () => {
    const res = await request(app).get(`/items/${candy.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: candy });
  });
  test('Responds with 404 for invalid item', async () => {
    const res = await request(app).get(`/items/redhots`);
    expect(res.statusCode).toBe(404);
  });
});

describe('/PATCH /items/:name', () => {
  test("Updating a item's name", async () => {
    const res = await request(app)
      .patch(`/items/${candy.name}`)
      .send({ name: 'Monster' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: 'Monster', price: candy.price } });
  });
  test('Responds with 404 for invalid name', async () => {
    const res = await request(app)
      .patch(`/cats/zigzags`)
      .send({ name: 'Monster' });
    expect(res.statusCode).toBe(404);
  });
});

describe('/DELETE /items/:name', () => {
  test('Deleting an item', async () => {
    const res = await request(app).delete(`/items/${candy.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' });
  });
  test('Responds with 404 for deleting invalid item', async () => {
    const res = await request(app).delete(`/items/twix`);
    expect(res.statusCode).toBe(404);
  });
});
