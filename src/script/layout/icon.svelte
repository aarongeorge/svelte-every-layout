<script context='module'>
	import EveryLayout from './every-layout.ts'

	const layouts = new EveryLayout()
</script>

<script>
	/**
	* @component Icon
	* @description A custom element for inline icon insertion
	* @property {string} align=center The vertical alignment of the icon to the text
	* @property {boolean} caps=false The height of the first character
	* @property {string} label=null Turns the element into an image in assistive technologies and adds an aria-label of the value
	* @property {string} space=null The space between the text and the icon. If null, natural word spacing is preserved
	*/
	import {onDestroy, onMount} from 'svelte'

	export let align = 'center'
	export let caps = false
	export let label = void 0
	export let space = '1em'

	let ref = void 0
	let instance = void 0

	onMount(() => {
		instance = layouts.mount({
			el: ref,
			props: {align, caps, label, space},
			name: 'Icon',
			styleFn: ({id, props}) => `
				span[data-id=${id}] {
					align-items: ${props.align};
					display: flex;
				}

				span[data-id=${id}] > svg {
					height: 1${props.caps ? 'ch' : 'ex'};
					${props.space ? `margin-inline-end: ${props.space};`: ''}
				}
			`.replace(/\s\s+/g, ' ').trim()
		})
	})

	onDestroy(() => { layouts.destroy(instance) })

	$: align, caps, label, space, instance && (() => { layouts.onPropsUpdate(instance, {align, caps, label, space}) })()
</script>

<span bind:this={ref} {...$$restProps} role={$$props.label ? 'img' : void 0} aria-label={$$props.label}>
	<slot></slot>{$$props.label ? $$props.label : void 0}
</span>
