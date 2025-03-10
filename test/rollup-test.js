const { join } = require('path')
const { rm } = require('fs/promises')
const test = require('tape')
const { get } = require('tiny-json-http')
const sandbox = require('@architect/sandbox')

const workingDirectory = join(process.cwd(), 'test', 'rollup-mock')
const port = 6661
const getUrl = (path, port) => `http://localhost:${port}${path}`

test('Start sandbox', async t => {
  t.plan(1)
  await sandbox.start({
    quiet: true,
    cwd: workingDirectory,
    port
  })
  t.pass('Sandbox started')
})

test('Get rolled up main file with Rollup config.', async t => {
  t.plan(2)
  const url = getUrl(`/_static/pages/index.mjs`, port)
  const fileReq = await get({ url, port })
  t.ok(fileReq.body, `Page bundle exists: ${url}` )
  t.true(fileReq.body.startsWith("Hello Rollup!"), "config value used.")
})

test('cleanup', async t => {
  t.plan(1)
  const pub = join(workingDirectory, 'public')
  await sandbox.end()
  await rm(pub, { force: true, recursive: true })
  t.pass('Shut down Sandbox')
})
