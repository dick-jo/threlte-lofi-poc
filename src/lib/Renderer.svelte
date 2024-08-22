<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import { EffectComposer, EffectPass, RenderPass } from 'postprocessing';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { PixelationEffect } from './PixelationEffect';

	const { scene, renderer, camera, size, renderStage, autoRender } = useThrelte();

	let composer: EffectComposer;
	let pixelationEffect: PixelationEffect;

	const setupEffectComposer = (camera: THREE.Camera) => {
		console.log('Setting up EffectComposer');
		composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(scene, camera));

		console.log('Creating PixelationEffect');
		pixelationEffect = new PixelationEffect({ pixelSize: 8, scene, camera });
		const effectPass = new EffectPass(camera, pixelationEffect);
		composer.addPass(effectPass);
		console.log('EffectComposer setup complete');
	};

	$: if ($camera && renderer && scene) {
		console.log('Camera, renderer, and scene available');
		setupEffectComposer($camera);
	}

	$: if (composer && $size) {
		console.log('Resizing composer', $size.width, $size.height);
		composer.setSize($size.width, $size.height);
		if (pixelationEffect) {
			pixelationEffect.setSize($size.width, $size.height);
		}
	}

	onMount(() => {
		console.log('Component mounted');
		let before = autoRender.current;
		autoRender.set(false);
		return () => autoRender.set(before);
	});

	useTask(
		(delta) => {
			if (composer) {
				composer.render(delta);
			}
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
