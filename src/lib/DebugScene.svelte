<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Gizmo } from '@threlte/extras';
	import Renderer from './Renderer.svelte';

	// TASK ----------------------------------- //
	let rot = 0;

	useTask((delta) => {
		rot += delta;
	});
</script>

<!-- RENDERER -->
<Renderer />

<!-- SCENE -->
<Gizmo />

<T.DirectionalLight intensity={2} position={[0, 12, 12]} color={'#ffffff'} />

<T.OrthographicCamera
	makeDefault
	position={[0, 4, 8]}
	zoom={280}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
/>

<T.Mesh rotation.y={rot}>
	<T.IcosahedronGeometry />
	<T.MeshPhysicalMaterial color="#ff00ff" />
</T.Mesh>

<T.Mesh rotation.y={rot}>
	<T.BoxGeometry args={[2.125, 0.25, 2.125]} />
	<T.MeshPhysicalMaterial color="#00ffff" />
</T.Mesh>
