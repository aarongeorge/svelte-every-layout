<script>
	import PageContainer from '../components/page-container.svelte'
	import * as Layout from '../layout/index.ts'
	import Controller, {controlledProps} from '../components/controller.svelte'

	const props = {
		align: 'center',
		caps: true,
		label: void 0,
		space: '1em'
	}
</script>

<PageContainer>
	<Controller name='The Icon' {props} />

	<Layout.Icon {...$controlledProps}>
		<svg viewBox='0 0 10 10' stroke='currentColor' stroke-width='2'>
			<path d='M1,1 9,9 M9,1 1,9' />
		</svg>
	</Layout.Icon>
</PageContainer>
