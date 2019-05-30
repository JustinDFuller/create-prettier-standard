/**
 * @param {Object} sum The object to merge into.
 * @param {Object} value The object ot merge from.
 * @returns {Object} The sum value merged with the next object.
 */
function reducer (sum, value) {
  for (let key in value) {
    const property = value[key]

    if (
      typeof property === 'object' &&
      property !== null &&
      !Array.isArray(property)
    ) {
      sum[key] = merge(sum[key] || {}, property)
    } else {
      sum[key] = property
    }
  }

  return sum
}

/**
 * @{...Object} objects All objects will be merged into a new object.
 * @returns {Object} an object with all properties merged from left to right.
 */
function merge (...objects) {
  return objects.reduce(reducer, {})
}

module.exports = {
  merge
}
