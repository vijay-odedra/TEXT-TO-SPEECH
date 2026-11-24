const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');

test('GET /api/health should return 200 with server status', async () => {
  const response = await request(app).get('/api/health');
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.message, 'Text-to-Speech server is running');
});

test('GET /api/status should return active provider status', async () => {
  const response = await request(app).get('/api/status');
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.data.activeProvider, 'browser');
});

test('GET /api/voices should return voice list or dynamic note', async () => {
  const response = await request(app).get('/api/voices');
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.success, true);
  assert.ok(response.body.provider);
});

test('POST /api/tts should return 400 if Content-Type is missing or not application/json', async () => {
  const response = await request(app)
    .post('/api/tts')
    .set('Content-Type', 'text/plain')
    .send('some raw text');
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'INVALID_CONTENT_TYPE');
});

test('POST /api/tts should reject missing text', async () => {
  const response = await request(app)
    .post('/api/tts')
    .send({});
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'MISSING_TEXT');
});

test('POST /api/tts should reject empty or whitespace-only text', async () => {
  const response = await request(app)
    .post('/api/tts')
    .send({ text: '    ' });
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'EMPTY_TEXT');
});

test('POST /api/tts should reject text exceeding character limit', async () => {
  const longText = 'a'.repeat(5005);
  const response = await request(app)
    .post('/api/tts')
    .send({ text: longText });
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'TEXT_TOO_LONG');
});

test('POST /api/tts should reject invalid speed outside 0.5 - 2.0', async () => {
  const response = await request(app)
    .post('/api/tts')
    .send({ text: 'Hello', speed: 5.0 });
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'INVALID_SPEED');
});

test('POST /api/tts should reject invalid pitch outside 0.5 - 2.0', async () => {
  const response = await request(app)
    .post('/api/tts')
    .send({ text: 'Hello', pitch: 0.1 });
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'INVALID_PITCH');
});

test('POST /api/tts should reject invalid volume outside 0.0 - 1.0', async () => {
  const response = await request(app)
    .post('/api/tts')
    .send({ text: 'Hello', volume: 2.5 });
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'INVALID_VOLUME');
});

test('POST /api/tts synthesizes and streams real audio buffer', async () => {
  const response = await request(app)
    .post('/api/tts')
    .send({
      text: 'Hello, welcome to the Text-to-Speech application.',
      language: 'en-US',
      speed: 1,
      pitch: 1,
      volume: 1
    });
  assert.strictEqual(response.status, 200);
  assert.ok(response.headers['content-type'].includes('audio/mpeg'));
  assert.ok(response.headers['content-disposition'].includes('attachment'));
});

test('GET non-existent endpoint should return 404', async () => {
  const response = await request(app).get('/api/unknown-endpoint');
  assert.strictEqual(response.status, 404);
  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.error.code, 'ROUTE_NOT_FOUND');
});
