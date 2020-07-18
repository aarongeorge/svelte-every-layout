interface Instance {
	el: HTMLElement
	id: string
	name: string
	props: object
	styleEl: HTMLStyleElement
	styleFn: (instance: Instance) => string
}

export default class EveryLayout {
	instanceIdCount: number
	instances: Array<Instance>

	constructor () {
		this.instances = []
		this.instanceIdCount = 0
	}

	createStyleEl (instance: Instance) {
		instance.styleEl = document.createElement('style')
		instance.styleEl.id = instance.id
		instance.styleEl.innerHTML = instance.styleFn(instance)

		document.head.appendChild(instance.styleEl)
	}

	destroy (instance: Instance) {
		this.instances = this.instances.filter(inst => inst.id !== instance.id)

		this.getInstancesById(instance.id).length === 0 && instance.styleEl.remove()
	}

	generateId (instance: Instance) {
		return [instance.name, ...Object.values(instance.props)]
			.map(v => String(v).replace(/[^a-zA-Z0-9-_]/g, '_'))
			.join('-')
	}

	getInstancesById (id: Instance['id']) {
		return this.instances.filter(inst => inst.el.dataset.id === id)
	}

	mount (instance: Instance) {
		this.setId(instance, this.generateId(instance))

		const existingIdInstances = this.getInstancesById(instance.id)

		if (existingIdInstances.length) instance.styleEl = existingIdInstances[0].styleEl
		else this.createStyleEl(instance)

		this.instances.push(instance)

		return instance
	}

	onPropsUpdate (instance: Instance, props: Instance['props']) {
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

	setId (instance: Instance, id: Instance['id']) {
		instance.id = id
		instance.el.dataset.id = id
	}
}
