import { BlendFunction, Effect } from 'postprocessing';
import {
	Camera,
	Color,
	LinearFilter,
	NearestFilter,
	RGBAFormat,
	Scene,
	Uniform,
	Vector2,
	WebGLRenderer,
	WebGLRenderTarget
} from 'three';

const fragmentShader = `
uniform vec2 resolution;
uniform float pixelSize;
uniform sampler2D inputBuffer;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 dxy = pixelSize / resolution;
  vec2 coord = dxy * floor(uv / dxy);
  outputColor = texture2D(inputBuffer, coord);
    
  // Quantize the color to create harder edges
  outputColor.rgb = floor(outputColor.rgb * 8.0 + 0.8) / 8.0;
}
`;

export class PixelationEffect extends Effect {
	private pixelatedRenderTarget: WebGLRenderTarget;
	private scene: Scene;
	private camera: Camera;
	private clearColor: Color;

	constructor({
		pixelSize = 8,
		scene,
		camera
	}: {
		pixelSize?: number;
		scene: Scene;
		camera: Camera;
	}) {
		super('PixelationEffect', fragmentShader, {
			blendFunction: BlendFunction.NORMAL,
			uniforms: new Map<string, Uniform<any>>([
				['resolution', new Uniform(new Vector2(1, 1))],
				['pixelSize', new Uniform(pixelSize)],
				['inputBuffer', new Uniform(null)]
			])
		});

		this.scene = scene;
		this.camera = camera;
		this.clearColor = new Color(0, 0, 0);

		this.pixelatedRenderTarget = new WebGLRenderTarget(1, 1, {
			minFilter: LinearFilter,
			magFilter: NearestFilter,
			format: RGBAFormat
		});
	}

	setPixelSize(value: number) {
		const uniform = this.uniforms.get('pixelSize');
		if (uniform) uniform.value = value;
	}

	setSize(width: number, height: number) {
		const uniform = this.uniforms.get('resolution');
		if (uniform) uniform.value.set(width, height);

		const pixelSize = this.uniforms.get('pixelSize')?.value as number;
		const pixelatedWidth = Math.floor(width / pixelSize);
		const pixelatedHeight = Math.floor(height / pixelSize);
		this.pixelatedRenderTarget.setSize(pixelatedWidth, pixelatedHeight);
	}

	update(renderer: WebGLRenderer) {
		const oldRenderTarget = renderer.getRenderTarget();
		const oldClearColor = renderer.getClearColor(new Color());
		const oldClearAlpha = renderer.getClearAlpha();

		renderer.setRenderTarget(this.pixelatedRenderTarget);
		renderer.setClearColor(this.clearColor, 0);
		renderer.clear();
		renderer.render(this.scene, this.camera);

		renderer.setRenderTarget(oldRenderTarget);
		renderer.setClearColor(oldClearColor, oldClearAlpha);

		const inputBufferUniform = this.uniforms.get('inputBuffer');
		if (inputBufferUniform) {
			inputBufferUniform.value = this.pixelatedRenderTarget.texture;
		}
	}
}
