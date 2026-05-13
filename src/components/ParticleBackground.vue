<template>
  <canvas ref="canvasRef" class="cinematic-bg" aria-hidden="true" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)

const CONFIG = {
  particleCount: 580,

  depthLayers: [0.22, 0.55, 1.0],
  depthRatios: [0.48, 0.32, 0.20],

  particleColors: [
    [0.13, 0.86, 0.60],
    [0.06, 0.55, 0.38],
    [0.04, 0.42, 0.26],
    [0.78, 0.58, 0.10],
  ],
  particleColorWeights: [0.55, 0.25, 0.14, 0.06],

  baseSize: 2.2,
  pixelRatioCap: 2,

  driftSpeed: 16,
  flowAmplitude: 28,

  revealRadius: 380,
  mouseFollow: 0.11,
  parallaxBase: 6,
  parallaxDepth: 28,

  baseColor: [0.97, 0.97, 0.97],
  ambientColor: [0.68, 0.92, 0.76],
  ambientIntensity: 0.03,
  lightColor: [0.13, 0.86, 0.60],
  lightIntensity: 0.05,
  lightRadius: 380,
  vignetteStrength: 0.18,
  grainStrength: 0.014,
}

const VERT_QUAD = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG_BG = `
precision highp float;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform vec3 uBaseColor;
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float uLightRadius;
uniform float uVignette;
uniform float uGrain;
uniform float uGrainTick;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 frag = gl_FragCoord.xy / uPixelRatio;
  frag.y = uResolution.y - frag.y;

  vec2 uv = frag / uResolution;
  vec3 col = uBaseColor;

  // Ambient sky-light: soft brightening from top-center, no mouse needed
  vec2 ambientCenter = vec2(0.5, 0.18);
  float ambientDist = distance(uv, ambientCenter);
  float ambientGlow = 1.0 - smoothstep(0.0, 1.05, ambientDist);
  ambientGlow = pow(ambientGlow, 1.4);
  col += uAmbientColor * uAmbientIntensity * ambientGlow;

  // Mouse light: accent, not the main illumination
  float d = distance(frag, uMouse);
  float att = 1.0 / (1.0 + pow(d / uLightRadius, 2.2));
  att = smoothstep(0.0, 1.0, att) * uMouseActive;
  col += uLightColor * uLightIntensity * att;

  vec2 vc = uv * 2.0 - 1.0;
  float vDist = dot(vc, vc);
  col *= 1.0 - vDist * uVignette;

  float g = hash21(gl_FragCoord.xy + uGrainTick * 0.137) - 0.5;
  col += g * uGrain;

  gl_FragColor = vec4(col, 1.0);
}`

const VERT_PARTICLE = `
attribute vec4 aSeed;
attribute vec2 aVelocity;
attribute vec3 aColor;
attribute float aSize;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uMouseNorm;
uniform float uMouseActive;
uniform float uRevealRadius;
uniform float uPixelRatio;
uniform float uFlowAmp;
uniform float uParallaxBase;
uniform float uParallaxDepth;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 flow = vec2(
    sin(uTime * 0.13 + aSeed.y * 9.42) * uFlowAmp,
    cos(uTime * 0.11 + aSeed.x * 8.16) * uFlowAmp * 0.7
  );

  vec2 pos = mod(aSeed.xy * uResolution + aVelocity * uTime + flow, uResolution);

  vec2 parallax = -uMouseNorm * (aSeed.z * uParallaxDepth + uParallaxBase) * uMouseActive;
  pos = mod(pos + parallax + uResolution, uResolution);

  vec2 clip = (pos / uResolution) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);

  float depthSize = mix(0.55, 1.75, aSeed.z);
  float sizeBreath = 0.55 + 0.45 * sin(uTime * 0.38 + aSeed.x * 8.73);
  gl_PointSize = aSize * depthSize * uPixelRatio * sizeBreath;

  float twinkle = 0.68 + 0.32 * sin(uTime * 0.58 + aSeed.w * 6.28);

  float md = distance(pos, uMouse);
  float reveal = 1.0 - smoothstep(0.0, uRevealRadius, md);
  reveal = pow(reveal, 1.7) * uMouseActive;

  float base = mix(0.55, 0.88, aSeed.z);
  vAlpha = (base + reveal * 0.28) * twinkle;
  vColor = aColor;
}`

const FRAG_PARTICLE = `
precision mediump float;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d2 = dot(uv, uv);
  if (d2 > 0.25) discard;

  float core = exp(-d2 * 24.0);
  float halo = exp(-d2 * 5.5) * 0.62;
  float glow = exp(-d2 * 2.6) * 0.28;
  float alpha = (core + halo + glow) * vAlpha;

  gl_FragColor = vec4(vColor, alpha);
}`

let gl = null
let bgProgram = null
let particleProgram = null
let quadBuffer = null
let particleBuffer = null
let particleCount = 0
let rafId = 0
let running = true
let width = 0
let height = 0
let dpr = 1
let startTime = 0

const mouse = {
  x: -9999, y: -9999,
  tx: -9999, ty: -9999,
  active: false,
}

const uniforms = { bg: {}, particle: {} }
const attribs = { bg: {}, particle: {} }

function compileShader(type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function createProgram(vs, fs) {
  const v = compileShader(gl.VERTEX_SHADER, vs)
  const f = compileShader(gl.FRAGMENT_SHADER, fs)
  if (!v || !f) return null
  const p = gl.createProgram()
  gl.attachShader(p, v)
  gl.attachShader(p, f)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p))
    return null
  }
  return p
}

function pickWeighted(values, weights) {
  const r = Math.random()
  let cum = 0
  for (let i = 0; i < values.length; i++) {
    cum += weights[i]
    if (r < cum) return values[i]
  }
  return values[values.length - 1]
}

function buildParticleBuffer() {
  particleCount = CONFIG.particleCount
  const data = new Float32Array(particleCount * 10)
  let o = 0
  for (let i = 0; i < particleCount; i++) {
    const depth = pickWeighted(CONFIG.depthLayers, CONFIG.depthRatios)
    const color = pickWeighted(CONFIG.particleColors, CONFIG.particleColorWeights)
    const speed = CONFIG.driftSpeed * (0.5 + depth)
    const angle = Math.random() * Math.PI * 2
    const speedJitter = 0.3 + Math.random() * 0.7

    data[o++] = Math.random()
    data[o++] = Math.random()
    data[o++] = depth
    data[o++] = Math.random() * Math.PI * 2

    data[o++] = Math.cos(angle) * speed * speedJitter
    data[o++] = Math.sin(angle) * speed * speedJitter

    data[o++] = color[0]
    data[o++] = color[1]
    data[o++] = color[2]

    data[o++] = CONFIG.baseSize * (0.6 + Math.random() * 0.9)
  }

  particleBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
}

function setupGL() {
  bgProgram = createProgram(VERT_QUAD, FRAG_BG)
  if (!bgProgram) return false
  attribs.bg.aPos = gl.getAttribLocation(bgProgram, 'aPos')
  uniforms.bg.uResolution = gl.getUniformLocation(bgProgram, 'uResolution')
  uniforms.bg.uPixelRatio = gl.getUniformLocation(bgProgram, 'uPixelRatio')
  uniforms.bg.uMouse = gl.getUniformLocation(bgProgram, 'uMouse')
  uniforms.bg.uMouseActive = gl.getUniformLocation(bgProgram, 'uMouseActive')
  uniforms.bg.uBaseColor = gl.getUniformLocation(bgProgram, 'uBaseColor')
  uniforms.bg.uAmbientColor = gl.getUniformLocation(bgProgram, 'uAmbientColor')
  uniforms.bg.uAmbientIntensity = gl.getUniformLocation(bgProgram, 'uAmbientIntensity')
  uniforms.bg.uLightColor = gl.getUniformLocation(bgProgram, 'uLightColor')
  uniforms.bg.uLightIntensity = gl.getUniformLocation(bgProgram, 'uLightIntensity')
  uniforms.bg.uLightRadius = gl.getUniformLocation(bgProgram, 'uLightRadius')
  uniforms.bg.uVignette = gl.getUniformLocation(bgProgram, 'uVignette')
  uniforms.bg.uGrain = gl.getUniformLocation(bgProgram, 'uGrain')
  uniforms.bg.uGrainTick = gl.getUniformLocation(bgProgram, 'uGrainTick')

  quadBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW)

  particleProgram = createProgram(VERT_PARTICLE, FRAG_PARTICLE)
  if (!particleProgram) return false
  attribs.particle.aSeed = gl.getAttribLocation(particleProgram, 'aSeed')
  attribs.particle.aVelocity = gl.getAttribLocation(particleProgram, 'aVelocity')
  attribs.particle.aColor = gl.getAttribLocation(particleProgram, 'aColor')
  attribs.particle.aSize = gl.getAttribLocation(particleProgram, 'aSize')

  uniforms.particle.uTime = gl.getUniformLocation(particleProgram, 'uTime')
  uniforms.particle.uResolution = gl.getUniformLocation(particleProgram, 'uResolution')
  uniforms.particle.uMouse = gl.getUniformLocation(particleProgram, 'uMouse')
  uniforms.particle.uMouseNorm = gl.getUniformLocation(particleProgram, 'uMouseNorm')
  uniforms.particle.uMouseActive = gl.getUniformLocation(particleProgram, 'uMouseActive')
  uniforms.particle.uRevealRadius = gl.getUniformLocation(particleProgram, 'uRevealRadius')
  uniforms.particle.uPixelRatio = gl.getUniformLocation(particleProgram, 'uPixelRatio')
  uniforms.particle.uFlowAmp = gl.getUniformLocation(particleProgram, 'uFlowAmp')
  uniforms.particle.uParallaxBase = gl.getUniformLocation(particleProgram, 'uParallaxBase')
  uniforms.particle.uParallaxDepth = gl.getUniformLocation(particleProgram, 'uParallaxDepth')

  buildParticleBuffer()
  return true
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !gl) return
  dpr = Math.min(window.devicePixelRatio || 1, CONFIG.pixelRatioCap)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  gl.viewport(0, 0, canvas.width, canvas.height)
}

function render(now) {
  rafId = requestAnimationFrame(render)
  if (!running || !gl) return

  mouse.x += (mouse.tx - mouse.x) * CONFIG.mouseFollow
  mouse.y += (mouse.ty - mouse.y) * CONFIG.mouseFollow

  const time = (now - startTime) / 1000
  const grainTick = Math.floor(now / 41.66)

  const mouseActiveValue = mouse.active ? 1.0 : 0.0
  const mouseNormX = mouse.active ? (mouse.x / width) * 2 - 1 : 0
  const mouseNormY = mouse.active ? (mouse.y / height) * 2 - 1 : 0

  gl.disable(gl.BLEND)
  gl.useProgram(bgProgram)
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.enableVertexAttribArray(attribs.bg.aPos)
  gl.vertexAttribPointer(attribs.bg.aPos, 2, gl.FLOAT, false, 0, 0)

  gl.uniform2f(uniforms.bg.uResolution, width, height)
  gl.uniform1f(uniforms.bg.uPixelRatio, dpr)
  gl.uniform2f(uniforms.bg.uMouse, mouse.x, mouse.y)
  gl.uniform1f(uniforms.bg.uMouseActive, mouseActiveValue)
  gl.uniform3fv(uniforms.bg.uBaseColor, CONFIG.baseColor)
  gl.uniform3fv(uniforms.bg.uAmbientColor, CONFIG.ambientColor)
  gl.uniform1f(uniforms.bg.uAmbientIntensity, CONFIG.ambientIntensity)
  gl.uniform3fv(uniforms.bg.uLightColor, CONFIG.lightColor)
  gl.uniform1f(uniforms.bg.uLightIntensity, CONFIG.lightIntensity)
  gl.uniform1f(uniforms.bg.uLightRadius, CONFIG.lightRadius)
  gl.uniform1f(uniforms.bg.uVignette, CONFIG.vignetteStrength)
  gl.uniform1f(uniforms.bg.uGrain, CONFIG.grainStrength)
  gl.uniform1f(uniforms.bg.uGrainTick, grainTick)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.useProgram(particleProgram)
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)

  const stride = 10 * 4
  let off = 0
  gl.enableVertexAttribArray(attribs.particle.aSeed)
  gl.vertexAttribPointer(attribs.particle.aSeed, 4, gl.FLOAT, false, stride, off); off += 4 * 4
  gl.enableVertexAttribArray(attribs.particle.aVelocity)
  gl.vertexAttribPointer(attribs.particle.aVelocity, 2, gl.FLOAT, false, stride, off); off += 2 * 4
  gl.enableVertexAttribArray(attribs.particle.aColor)
  gl.vertexAttribPointer(attribs.particle.aColor, 3, gl.FLOAT, false, stride, off); off += 3 * 4
  gl.enableVertexAttribArray(attribs.particle.aSize)
  gl.vertexAttribPointer(attribs.particle.aSize, 1, gl.FLOAT, false, stride, off)

  gl.uniform1f(uniforms.particle.uTime, time)
  gl.uniform2f(uniforms.particle.uResolution, width, height)
  gl.uniform2f(uniforms.particle.uMouse, mouse.x, mouse.y)
  gl.uniform2f(uniforms.particle.uMouseNorm, mouseNormX, mouseNormY)
  gl.uniform1f(uniforms.particle.uMouseActive, mouseActiveValue)
  gl.uniform1f(uniforms.particle.uRevealRadius, CONFIG.revealRadius)
  gl.uniform1f(uniforms.particle.uPixelRatio, dpr)
  gl.uniform1f(uniforms.particle.uFlowAmp, CONFIG.flowAmplitude)
  gl.uniform1f(uniforms.particle.uParallaxBase, CONFIG.parallaxBase)
  gl.uniform1f(uniforms.particle.uParallaxDepth, CONFIG.parallaxDepth)

  gl.drawArrays(gl.POINTS, 0, particleCount)
}

function onPointerMove(e) {
  mouse.tx = e.clientX
  mouse.ty = e.clientY
  if (!mouse.active) {
    mouse.x = mouse.tx
    mouse.y = mouse.ty
    mouse.active = true
  }
}

function onVisibilityChange() {
  running = !document.hidden
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  }) || canvas.getContext('experimental-webgl')

  if (!gl || !setupGL()) {
    gl = null
    return
  }

  resize()
  startTime = performance.now()

  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)

  if (prefersReducedMotion) {
    render(performance.now())
    return
  }

  rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('visibilitychange', onVisibilityChange)

  if (gl) {
    if (particleBuffer) gl.deleteBuffer(particleBuffer)
    if (quadBuffer) gl.deleteBuffer(quadBuffer)
    if (bgProgram) gl.deleteProgram(bgProgram)
    if (particleProgram) gl.deleteProgram(particleProgram)
  }
  gl = null
})
</script>

<style scoped>
.cinematic-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  display: block;
}
</style>
