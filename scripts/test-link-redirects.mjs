import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {after, before, test} from 'node:test'
import {deadOrAlive} from 'dead-or-alive'

const server = createServer((request, response) => {
  const redirects = {
    '/redirect': '/page',
    '/chain': '/redirect',
    '/replace': '/page#other',
    '/clear': '/page#',
    '/dead': '/missing'
  }
  if (Object.hasOwn(redirects, request.url)) {
    response.writeHead(302, {location: redirects[request.url]}).end()
  } else if (request.url === '/page') {
    response.writeHead(200, {'content-type': 'text/html'}).end('<h1 id="present">Present</h1><h2 id="other">Other</h2>')
  } else {
    response.writeHead(404).end()
  }
})

let origin
before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
})
after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())))

test('inherits fragments across redirects and validates the final anchor', async () => {
  const result = await deadOrAlive(`${origin}/chain#present`)
  assert.equal(result.status, 'alive')
  assert.equal(result.url, `${origin}/page#present`)
  assert.deepEqual(result.messages, [])

  const missing = await deadOrAlive(`${origin}/redirect#missing`)
  assert.equal(missing.status, 'dead')
  assert.equal(missing.messages[0].ruleId, 'missing-anchor')
})

test('honors explicit replacement and empty fragments', async () => {
  const replaced = await deadOrAlive(`${origin}/replace#missing`)
  assert.equal(replaced.status, 'alive')
  assert.equal(replaced.url, `${origin}/page#other`)

  const cleared = await deadOrAlive(`${origin}/clear#missing`)
  assert.equal(cleared.status, 'alive')
  assert.equal(new URL(cleared.url).hash, '')
})

test('continues to report dead redirect destinations', async () => {
  const result = await deadOrAlive(`${origin}/dead#present`, {maxRetries: 0})
  assert.equal(result.status, 'dead')
  assert.equal(result.messages[0].ruleId, 'dead')
})
