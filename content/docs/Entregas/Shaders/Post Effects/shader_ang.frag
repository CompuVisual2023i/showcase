precision mediump float;

uniform vec2 uResolution;

uniform sampler2D uTexture;

void main() {
  vec2 st = vec2((gl_FragCoord.x / uResolution.x)-0.02, 1.0 - gl_FragCoord.y / uResolution.y);
  vec4 r = texture2D(uTexture, st);
  vec2 st2 = vec2((gl_FragCoord.x / uResolution.x)+0.02, 1.0 - gl_FragCoord.y / uResolution.y);
  vec4 gb = texture2D(uTexture, st2);
  gl_FragColor = vec4(r.r, gb.g, gb.b, 1.0);
}