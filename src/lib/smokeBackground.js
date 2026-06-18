/**
 * Fondo de humo de color con simulación de fluidos en WebGL2 (Navier–Stokes).
 *
 * Dos "luces" son emisores de tinta de color (terracota y salvia) que alimentan
 * humo continuamente. El campo de velocidad se resuelve con advección,
 * proyección de presión y confinamiento de vorticidad, así que el humo fluye y
 * se arremolina con vida propia. Al mover el mouse se inyecta velocidad LOCAL:
 * cortás/empujás el humo como si pasaras la mano por agua, y se disipa solo
 * (sin rebote ni hundimiento, sin mover todo el entorno junto).
 *
 * Requiere WebGL2 + render a float. Si no está disponible degrada al degradé
 * CSS estático de .hero__bg.
 */

const VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const ADVECT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  fragColor = texture(uSource, coord) / (1.0 + uDissipation * uDt);
}
`

const SPLAT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;
void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}
`

const DIVERGENCE = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float T = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`

const PRESSURE = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float div = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}
`

const GRADIENT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel -= 0.5 * vec2(R - L, T - B);
  fragColor = vec4(vel, 0.0, 1.0);
}
`

const CURL = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).y;
  float R = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).y;
  float B = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).x;
  fragColor = vec4(0.5 * ((R - L) - (T - B)), 0.0, 0.0, 1.0);
}
`

const VORTICITY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexel;
uniform float uCurlStrength;
uniform float uDt;
void main() {
  float L = texture(uCurl, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uCurl, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uCurl, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uCurl, vUv + vec2(0.0, uTexel.y)).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 1e-4;
  force *= uCurlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy;
  fragColor = vec4(vel + force * uDt, 0.0, 1.0);
}
`

const NOISE_FORCE = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform float uTime;
uniform float uDt;
uniform float uAmount;
uniform float uAspect;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}
void main() {
  // Curl de un campo de ruido => turbulencia que arremolina e invade toda la
  // pantalla, sin dirección dominante (no se nota la fuente del humo).
  vec2 p = vec2(vUv.x * uAspect, vUv.y) * 3.0 + vec2(0.0, uTime * 0.12);
  float e = 0.02;
  float n1 = fbm(p + vec2(0.0, e));
  float n2 = fbm(p - vec2(0.0, e));
  float n3 = fbm(p + vec2(e, 0.0));
  float n4 = fbm(p - vec2(e, 0.0));
  vec2 curl = vec2(n1 - n2, -(n3 - n4)) / (2.0 * e);
  vec2 vel = texture(uVelocity, vUv).xy + curl * uAmount * uDt;
  fragColor = vec4(vel, 0.0, 1.0);
}
`

const DISPLAY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDye;
uniform float uAspect;
uniform float uIntensity;
uniform float uTime;
uniform vec2 uResolution;
const vec3 INK = vec3(0.078, 0.078, 0.086);
const vec3 GLOW_A = vec3(0.72, 0.27, 0.13); // terracota (izquierda)
const vec3 GLOW_B = vec3(0.30, 0.36, 0.28); // salvia (derecha)
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
void main() {
  vec3 dye = texture(uDye, vUv).rgb;
  vec2 q = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);

  // Dos luces base SIEMPRE presentes, una de cada lado (respiran suave).
  vec2 ca = vec2((0.28 - 0.5) * uAspect, 0.05 + sin(uTime * 0.3) * 0.03);
  vec2 cb = vec2((0.72 - 0.5) * uAspect, -0.02 + cos(uTime * 0.27) * 0.03);
  float ga = exp(-dot(q - ca, q - ca) * 1.5);
  float gb = exp(-dot(q - cb, q - cb) * 1.8);

  vec3 col = INK;
  col += GLOW_A * ga * 0.6;
  col += GLOW_B * gb * 0.45;
  col += dye; // humo en movimiento encima

  // ── Profundidad: sombreado volumétrico del humo ──
  // Normal falsa a partir del gradiente de densidad => relieve 3D.
  vec2 off = 1.6 / uResolution;
  float dens = lum(dye);
  float dxl = lum(texture(uDye, vUv - vec2(off.x, 0.0)).rgb);
  float dxr = lum(texture(uDye, vUv + vec2(off.x, 0.0)).rgb);
  float dyb = lum(texture(uDye, vUv - vec2(0.0, off.y)).rgb);
  float dyt = lum(texture(uDye, vUv + vec2(0.0, off.y)).rgb);
  vec3 normal = normalize(vec3(dxl - dxr, dyb - dyt, 0.55));
  // Luz direccional que deriva lento (da relieve y dirección).
  vec3 lightDir = normalize(vec3(cos(uTime * 0.16) * 0.7, sin(uTime * 0.16) * 0.7, 0.85));
  float diff = clamp(dot(normal, lightDir), 0.0, 1.0);
  col += vec3(1.0, 0.82, 0.62) * pow(diff, 1.5) * dens * 0.5; // realce en crestas
  col *= 0.9 + 0.18 * diff;                                   // sombra/luz suave

  // Resplandor de luz que se filtra por el humo (fuente que deriva = profundidad).
  vec2 lp = vec2(0.5 + sin(uTime * 0.09) * 0.22, 0.55 + cos(uTime * 0.12) * 0.12);
  vec2 lq = vec2((vUv.x - lp.x) * uAspect, vUv.y - lp.y);
  float spot = exp(-dot(lq, lq) * 2.2);
  col += vec3(0.95, 0.58, 0.36) * spot * 0.10 * (0.35 + dens);

  // Viñeta suave.
  col *= 0.55 + 0.45 * smoothstep(1.35, 0.2, length(q));

  col *= uIntensity;
  col = vec3(1.0) - exp(-col * 1.3); // tonemap => sin blanco quemado

  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  fragColor = vec4(col + dither, 1.0);
}
`

// Paleta de marca (normalizada).
const TERRA = [0.855, 0.349, 0.2]
const SAGE = [0.42, 0.5, 0.4]

export function createSmokeBackground(canvas, hitArea) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    // Movimiento reducido: dejamos el degradé CSS estático de .hero__bg.
    return { destroy() {} }
  }

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
  })

  if (!gl || !gl.getExtension('EXT_color_buffer_float')) {
    return { destroy() {} } // sin WebGL2/float => fallback CSS
  }
  gl.getExtension('OES_texture_float_linear')

  // ── Compilación ──────────────────────────────────────────────
  function compile(type, src) {
    const sh = gl.createShader(type)
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('Smoke shader error:', gl.getShaderInfoLog(sh), src)
      return null
    }
    return sh
  }

  const vs = compile(gl.VERTEX_SHADER, VERT)

  function program(fragSrc) {
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc)
    const p = gl.createProgram()
    gl.attachShader(p, vs)
    gl.attachShader(p, fs)
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('Smoke link error:', gl.getProgramInfoLog(p))
      return null
    }
    const uniforms = {}
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i).name
      uniforms[name] = gl.getUniformLocation(p, name)
    }
    return { program: p, uniforms }
  }

  const progAdvect = program(ADVECT)
  const progSplat = program(SPLAT)
  const progDivergence = program(DIVERGENCE)
  const progPressure = program(PRESSURE)
  const progGradient = program(GRADIENT)
  const progCurl = program(CURL)
  const progVorticity = program(VORTICITY)
  const progNoise = program(NOISE_FORCE)
  const progDisplay = program(DISPLAY)

  if (!vs || !progDisplay) return { destroy() {} }

  // ── Quad a pantalla completa ─────────────────────────────────
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  // ── Framebuffers ─────────────────────────────────────────────
  const SIM_TARGET = 220 // resolución de la sim (lado corto)
  const PRESSURE_ITERATIONS = 18

  function createFBO(w, h) {
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    gl.viewport(0, 0, w, h)
    gl.clear(gl.COLOR_BUFFER_BIT)
    let unit = 0
    return {
      tex,
      fbo,
      width: w,
      height: h,
      attach(id) {
        gl.activeTexture(gl.TEXTURE0 + id)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        unit = id
        return id
      },
    }
  }

  function createDoubleFBO(w, h) {
    let a = createFBO(w, h)
    let b = createFBO(w, h)
    return {
      width: w,
      height: h,
      get read() {
        return a
      },
      get write() {
        return b
      },
      swap() {
        const t = a
        a = b
        b = t
      },
    }
  }

  let simW, simH, texelX, texelY
  let velocity, dye, divergence, pressure, curl

  function initFramebuffers() {
    const dw = gl.drawingBufferWidth
    const dh = gl.drawingBufferHeight
    let aspect = dw / dh
    if (aspect < 1) aspect = 1 / aspect
    const min = SIM_TARGET
    const max = Math.round(SIM_TARGET * aspect)
    if (dw > dh) {
      simW = max
      simH = min
    } else {
      simW = min
      simH = max
    }
    texelX = 1 / simW
    texelY = 1 / simH

    velocity = createDoubleFBO(simW, simH)
    dye = createDoubleFBO(simW, simH)
    divergence = createFBO(simW, simH)
    pressure = createDoubleFBO(simW, simH)
    curl = createFBO(simW, simH)
  }

  function blit(target) {
    if (target == null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    } else {
      gl.viewport(0, 0, target.width, target.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  // ── Tamaño / DPR ─────────────────────────────────────────────
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  function resize() {
    const rect = hitArea.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width * dpr))
    const h = Math.max(1, Math.round(rect.height * dpr))

    // En móvil, scrollear muestra/oculta la barra de URL y cambia la altura del
    // viewport (100dvh) constantemente. Reasignar canvas.width/height borra el
    // drawing buffer y reinicializar los framebuffers limpia el humo a negro =>
    // parpadeo al scrollear. Sólo reaccionamos a cambios de ANCHO (orientación /
    // resize real de ventana); los cambios sólo de alto los absorbe el CSS
    // estirando el canvas (el humo se estira de forma imperceptible), sin tocar
    // el buffer ni los framebuffers, así que no hay parpadeo.
    if (canvas.width === w) return

    canvas.width = w
    canvas.height = h
    initFramebuffers()
    warmup()
  }

  // ── Splats (inyección de color y fuerza) ─────────────────────
  function aspect() {
    return canvas.width / canvas.height
  }

  function splatVelocity(x, y, dx, dy, radius) {
    gl.useProgram(progSplat.program)
    gl.uniform1i(progSplat.uniforms.uTarget, velocity.read.attach(0))
    gl.uniform1f(progSplat.uniforms.uAspect, aspect())
    gl.uniform2f(progSplat.uniforms.uPoint, x, y)
    gl.uniform3f(progSplat.uniforms.uColor, dx, dy, 0)
    gl.uniform1f(progSplat.uniforms.uRadius, radius)
    blit(velocity.write)
    velocity.swap()
  }

  function splatDye(x, y, color, strength, radius) {
    gl.useProgram(progSplat.program)
    gl.uniform1i(progSplat.uniforms.uTarget, dye.read.attach(0))
    gl.uniform1f(progSplat.uniforms.uAspect, aspect())
    gl.uniform2f(progSplat.uniforms.uPoint, x, y)
    gl.uniform3f(
      progSplat.uniforms.uColor,
      color[0] * strength,
      color[1] * strength,
      color[2] * strength
    )
    gl.uniform1f(progSplat.uniforms.uRadius, radius)
    blit(dye.write)
    dye.swap()
  }

  // ── Estado del puntero ───────────────────────────────────────
  const pointer = { x: 0.5, y: 0.55, px: 0.5, py: 0.55, moved: false, inside: false }

  function onPointerMove(e) {
    const rect = hitArea.getBoundingClientRect()
    if (!rect.width) return
    pointer.x = (e.clientX - rect.left) / rect.width
    pointer.y = 1 - (e.clientY - rect.top) / rect.height
    pointer.moved = true
    pointer.inside = true
  }
  function onPointerLeave() {
    pointer.inside = false
  }

  // ── Loop de simulación ───────────────────────────────────────
  const FORCE = 4200 // fuerza del mouse
  const VEL_DISSIPATION = 0.8 // el movimiento se calma con el tiempo
  const DYE_DISSIPATION = 0.32 // disipación lenta => el humo llena y permanece
  const CURL_STRENGTH = 20 // confinamiento de vorticidad (remolinos)
  const NOISE_AMOUNT = 11 // turbulencia ambiente que invade la pantalla
  const DYE_RADIUS = 0.05 // emisores grandes y blandos (sin chorro)
  const MOUSE_RADIUS = 0.0022

  function emitters(t) {
    // Dos luces que respiran y derivan suavemente, una de cada lado.
    const ax = 0.3 + Math.sin(t * 0.21) * 0.03
    const ay = 0.55 + Math.cos(t * 0.27) * 0.04
    const bx = 0.7 + Math.cos(t * 0.19) * 0.03
    const by = 0.5 + Math.sin(t * 0.24) * 0.04
    return { ax, ay, bx, by }
  }

  function feed(t, dt) {
    const { ax, ay, bx, by } = emitters(t)
    // Tinta de color (las dos luces) — emisión amplia y suave, sin dirección.
    // El movimiento lo aporta la turbulencia (NOISE_FORCE), no un empuje, así no
    // se nota de dónde sale el humo. Densidad de equilibrio ≈ rate / DYE_DISSIPATION.
    splatDye(ax, ay, TERRA, 0.16 * dt, DYE_RADIUS)
    splatDye(bx, by, SAGE, 0.13 * dt, DYE_RADIUS)
  }

  function step(dt, t) {
    gl.disable(gl.BLEND)
    const texel = [texelX, texelY]

    // Vorticidad (remolinos).
    gl.useProgram(progCurl.program)
    gl.uniform2f(progCurl.uniforms.uTexel, texel[0], texel[1])
    gl.uniform1i(progCurl.uniforms.uVelocity, velocity.read.attach(0))
    blit(curl)

    gl.useProgram(progVorticity.program)
    gl.uniform2f(progVorticity.uniforms.uTexel, texel[0], texel[1])
    gl.uniform1i(progVorticity.uniforms.uVelocity, velocity.read.attach(0))
    gl.uniform1i(progVorticity.uniforms.uCurl, curl.attach(1))
    gl.uniform1f(progVorticity.uniforms.uCurlStrength, CURL_STRENGTH)
    gl.uniform1f(progVorticity.uniforms.uDt, dt)
    blit(velocity.write)
    velocity.swap()

    // Turbulencia ambiente (curl-noise) => el humo invade toda la pantalla.
    gl.useProgram(progNoise.program)
    gl.uniform1i(progNoise.uniforms.uVelocity, velocity.read.attach(0))
    gl.uniform1f(progNoise.uniforms.uTime, t)
    gl.uniform1f(progNoise.uniforms.uDt, dt)
    gl.uniform1f(progNoise.uniforms.uAmount, NOISE_AMOUNT)
    gl.uniform1f(progNoise.uniforms.uAspect, simW / simH)
    blit(velocity.write)
    velocity.swap()

    // Divergencia.
    gl.useProgram(progDivergence.program)
    gl.uniform2f(progDivergence.uniforms.uTexel, texel[0], texel[1])
    gl.uniform1i(progDivergence.uniforms.uVelocity, velocity.read.attach(0))
    blit(divergence)

    // Presión (Jacobi).
    gl.useProgram(progPressure.program)
    gl.uniform2f(progPressure.uniforms.uTexel, texel[0], texel[1])
    gl.uniform1i(progPressure.uniforms.uDivergence, divergence.attach(0))
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(progPressure.uniforms.uPressure, pressure.read.attach(1))
      blit(pressure.write)
      pressure.swap()
    }

    // Restar gradiente => velocidad sin divergencia.
    gl.useProgram(progGradient.program)
    gl.uniform2f(progGradient.uniforms.uTexel, texel[0], texel[1])
    gl.uniform1i(progGradient.uniforms.uPressure, pressure.read.attach(0))
    gl.uniform1i(progGradient.uniforms.uVelocity, velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    // Advección de la velocidad.
    gl.useProgram(progAdvect.program)
    gl.uniform2f(progAdvect.uniforms.uTexel, texel[0], texel[1])
    gl.uniform1f(progAdvect.uniforms.uDt, dt)
    gl.uniform1i(progAdvect.uniforms.uVelocity, velocity.read.attach(0))
    gl.uniform1i(progAdvect.uniforms.uSource, velocity.read.attach(0))
    gl.uniform1f(progAdvect.uniforms.uDissipation, VEL_DISSIPATION)
    blit(velocity.write)
    velocity.swap()

    // Advección de la tinta (el humo se mueve con el fluido).
    gl.uniform1i(progAdvect.uniforms.uVelocity, velocity.read.attach(0))
    gl.uniform1i(progAdvect.uniforms.uSource, dye.read.attach(1))
    gl.uniform1f(progAdvect.uniforms.uDissipation, DYE_DISSIPATION)
    blit(dye.write)
    dye.swap()
  }

  function render(t) {
    gl.useProgram(progDisplay.program)
    gl.uniform1i(progDisplay.uniforms.uDye, dye.read.attach(0))
    gl.uniform1f(progDisplay.uniforms.uAspect, aspect())
    gl.uniform1f(progDisplay.uniforms.uIntensity, intensity)
    gl.uniform1f(progDisplay.uniforms.uTime, t)
    gl.uniform2f(progDisplay.uniforms.uResolution, canvas.width, canvas.height)
    blit(null)
  }

  // Pre-cargamos humo para que ya invada la pantalla (al iniciar y tras un
  // reinit por cambio de tamaño real), evitando un arranque en negro.
  function warmup() {
    for (let i = 0; i < 120; i++) {
      feed(i * 0.016, 0.016)
      step(0.016, i * 0.016)
    }
  }

  // ── Arranque ─────────────────────────────────────────────────
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(hitArea)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  hitArea.addEventListener('pointerleave', onPointerLeave)

  let intensity = 0
  let last = performance.now()
  let raf = 0
  let running = true

  function frame(now) {
    if (!running) return
    let dt = (now - last) / 1000
    last = now
    if (dt > 0.033) dt = 0.033 // clamp (evita saltos tras pausa)
    const t = now / 1000

    feed(t, dt)

    // Fuerza local del mouse: empuja/corta el humo donde te movés.
    if (pointer.moved && pointer.inside) {
      const dx = (pointer.x - pointer.px) * FORCE
      const dy = (pointer.y - pointer.py) * FORCE
      splatVelocity(pointer.x, pointer.y, dx, dy, MOUSE_RADIUS)
      pointer.moved = false
    }
    pointer.px = pointer.x
    pointer.py = pointer.y

    step(dt, t)

    intensity += (1 - intensity) * 0.05
    render(t)

    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  // Pausa cuando el hero sale de viewport.
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!entry.isIntersecting) {
        running = false
        cancelAnimationFrame(raf)
      }
    },
    { threshold: 0 }
  )
  io.observe(hitArea)

  return {
    destroy() {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      hitArea.removeEventListener('pointerleave', onPointerLeave)
      ro.disconnect()
      io.disconnect()
      const ext = gl.getExtension('WEBGL_lose_context')
      if (ext) ext.loseContext()
    },
  }
}
