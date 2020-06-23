export default class EveryLayout {
	constructor () {
		this.instances = []
		this.instanceIdCount = 0
	}

	onPropsUpdate (instance, props) {
		instance.props = props

		const newId = this.generateId(instance)

		if (instance.id === newId) return

		const oldIdInstances = this.getInstancesById(instance.id)
		const newIdInstances = this.getInstancesById(newId)
		const create = newIdInstances.length === 0
		const remove = oldIdInstances.length === 1

		this.setId(instance, newId)

		if (remove) instance.styleEl.remove()
		if (create) this.createStyleEl(instance)
		else instance.styleEl = newIdInstances[0].styleEl
	}

	setId (instance, id) {
		instance.id = id
		instance.el.dataset.id = id
	}

	mount (instance) {
		this.setId(instance, this.generateId(instance))

		const existingIdInstances = this.getInstancesById(instance.id)

		if (existingIdInstances.length) instance.styleEl = existingIdInstances[0].styleEl
		else this.createStyleEl(instance)

		this.instances.push(instance)

		return instance
	}

	destroy (instance) {
		this.instances = this.instances.filter(inst => inst.id !== instance.id)

		this.getInstancesById(instance.id).length === 0 && instance.styleEl.remove()
	}

	createStyleEl (instance) {
		instance.styleEl = document.createElement('style')
		instance.styleEl.id = instance.id
		instance.styleEl.innerHTML = instance.styleFn(instance)

		document.head.appendChild(instance.styleEl)
	}

	getInstancesById (id) {
		return this.instances.filter(inst => inst.el.dataset.id === id)
	}

	generateId (instance) {
		return [instance.name, ...Object.values(instance.props)]
			.map(v => String(v).replace(/[^a-zA-Z0-9-_]/g, '_'))
			.join('-')
	}
}
