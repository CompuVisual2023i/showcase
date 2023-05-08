precision mediump float;

uniform vec2 uResolution;
uniform sampler2D uTexture;


void main() {
  vec2 st = gl_FragCoord.xy / uResolution;
  vec4 color = texture2D(uTexture, st);
  color.rgb = 1.0 - color.rgb; // Invertir los colores
  gl_FragColor = color;
}