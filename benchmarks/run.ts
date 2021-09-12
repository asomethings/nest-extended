import autocannon from 'autocannon'
import { fork } from 'child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as fs from 'node:fs/promises'
import { Stream } from 'stream'

const __dirname = fileURLToPath(dirname(import.meta.url))

const targets = ['nest-express.ts', 'nest-fastify.ts', 'nest-nanoexpress.ts']

const bench = async (target: string) => {
  const path = __dirname + `/${target}`
  const cp = fork(path)

  cp.unref()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const result = await autocannon({
    url: 'http://localhost:3000',
    connections: 1024,
  })

  const ac = autocannon as any
  const emptyStream = new Stream()
  process.env.FORCE_COLOR = '0'
  const result2 = ac.printResult(result, {
    outputStream: emptyStream,
    renderLatencyTable: true,
  })
  await fs.writeFile(path.replace('.ts', '-result.txt'), result2)
  cp.kill()
}

const run = async () => {
  for (const target of targets) {
    await bench(target)
  }
}

run()
