function merge (...objects) {
  return objects.reduce(function (sum, value) {
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
  }, {})
}

module.exports = {
  merge
}
