const read = require('./read')
const create = require('./create')
const update = require('./update')
const del = require('./delete')

module.exports = {
	...read,
	...create,
	...update,
	...del,
}
