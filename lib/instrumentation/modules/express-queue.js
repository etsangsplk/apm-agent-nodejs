'use strict'

var shimmer = require('../shimmer')

module.exports = function (expressQueue, agent, version, enabled) {
  if (!enabled) return expressQueue

  var ins = agent._instrumentation

  return function wrappedExpressQueue (config) {
    var result = expressQueue(config)
    shimmer.wrap(result.queue, 'createJob', function (original) {
      return function (job) {
        if (job.next) {
          job.next = ins.bindFunction(job.next)
        }
        return original.apply(this, arguments)
      }
    })
    return result
  }
}
