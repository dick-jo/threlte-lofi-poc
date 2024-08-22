<script lang="ts">
	import DebugScene from '$lib/DebugScene.svelte';
	import { Canvas } from '@threlte/core';
</script>

<!-- MARKUP -->
<main>
	<Canvas rendererParameters={{ antialias: false }}>
		<DebugScene />
	</Canvas>
</main>

<!-- CSS -->
<style>
	:global(*) {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-family: monospace;
	}

	:global(html, body) {
		width: 100%;
		height: 100%;
		min-height: 100vh;
	}

	:global(body) {
		padding: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	main {
		height: 100%;
		aspect-ratio: 1/1;
		background-image: radial-gradient(khaki, orange);
		/* background-color: black; */
	}
</style>
