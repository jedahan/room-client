const Room = require(`../build/room`)
const test = require(`ava`)

test.beforeEach(async t => {
  const server = require(`@living-room/service-js`)
  t.context.server = await server.listen()
  const port = t.context.server.port
  t.context.room = new Room(`http://localhost:${port}`)
})

test.cb(`we get calls when broken up`, t => {
  const room = t.context.room
  const animal = new Set([
    `party`,
    `car`,
    `animal`,
    `blue`,
    `me`
  ])

  const asserts = Array.from(animal.values())
    .map(what => ({ assert: `animal ${what}` }))

  room.on(`animal $what`, ({what}) => {
    t.true(animal.delete(what))
    if (animal.size === 0) t.end()
  })

  room
     .assert(`animal party`)
     .assert(`animal car`)
     .assert(`animal animal`)

  room
     .assert(`animal blue`)
     .assert(`animal me`)
     .then(({facts}) => {
       t.deepEqual(facts, asserts)
     })
})
/*
test.cb(`once only gets called for existing assertions`, t => {
  const room = t.context.room
  const asserts = new Set([ `first`, `second` ])
  room
    .assert(`first`)
    .assert(`second`)
    .then(() => {
      room
        .on(`$number`, ({number}) => {
          t.true([`first`, `second`].includes(number))
        })
      setTimeout(() => {
        room.assert(`third`).then(() => t.end())
      }, 150)
    })
})

test(`await works`, async t => {
  const room = t.context.room
  const { facts } = await room.assert(`hello`)
  t.deepEqual(facts, [{assert: `hello`}])
})

test.cb(`on gets called for all assertions`, t => {
  const room = t.context.room
  let asserts = new Set([ `first`, `second`, `third` ])

  room
    .assert(`first`)
    .assert(`second`)
    .then(() => {
      room
        .on(`$number`, ({number}) => {
          t.true(asserts.delete(number))
        })
      setTimeout(() => {
        room.assert(`third`)
          .then(() => {
            t.is(asserts.size, 0)
            t.end()
          })
      }, 150)
    })
})

test.cb(`an assert with no callback works`, t => {
  const room = t.context.room
  room.on(`$what callback assert`, ({what}) => {
    t.is(what, `no`)
    t.end()
  })
  room.assert(`no callback assert`)
})

test.cb('setImmediate clears calls a second time', t => {
  const room = t.context.room
  const processed = response => {
    t.deepEqual(response, ['this', 'is', 'cool'])
    room.off('processed', processed)
  }

  room.on('processed', processed)

  room
    .assert('this')
    .assert('is')
    .assert('cool')

  setImmediate(() => {
    room
      .assert('like')
      .assert('the')
      .assert('coolest')
      .then(response=> {
        t.is(response, [`like`, `the` , `coolest`])
        t.end()
      })
  })
})
*/
