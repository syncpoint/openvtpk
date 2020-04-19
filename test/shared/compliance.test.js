'use strict'

const { expect } = require('chai')

const compliance = require('../../src/shared/compliance')

describe('check compliance', () => {
    it('fails on non-existing path', async () => {
      const somePath = '/does_not_exist'
      const result = await compliance(somePath)
      expect(result.isCompliant).to.be.false
    })
    it('fails on file instead of a folder', async () => {
      const self = 'compliance.test.js'
      const result = await compliance(self)
      expect(result.isCompliant).to.be.false
    })    
})

