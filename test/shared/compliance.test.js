'use strict'

const { expect } = require('@oclif/test')

const compliance = require('../../src/shared/compliance')

describe('not existing root path', async () => {
    const somePath = '/does_not_exist'
    const result = await compliance(somePath)
    console.dir(result)
    expect(result.isCompliant).to.be.false
})

describe('file instead of a folder', async () => {
  const self = 'compliance.test.js'
  const result = await compliance(self)
  console.dir(result)
  expect(result.isCompliant).to.be.false
})