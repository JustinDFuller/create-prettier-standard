/**
 * @param {Object} mergeInto The object to merge into.
 * @param {Object} mergeFrom The object ot merge from.
 * @returns {Object} The mergeInto object merged with the mergeFrom object.
 */
function mergeObjects (mergeInto, mergeFrom) {
  for (let key in mergeFrom) {
    const value = mergeFrom[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      mergeInto[key] = merge(mergeInto[key] || {}, value)
    } else {
      mergeInto[key] = value
    }
  }

  return mergeInto
}

/**
 * @param {...Object} objects All objects will be merged into a new object.
 * @returns {Object} an object with all properties merged from left to right.
 */
function merge (...objects) {
  return objects.reduce(mergeObjects, {})
}

module.exports = {
  merge
}
