precision mediump float;

uniform vec2 uResolution;

uniform float resolution;

uniform sampler2D uTexture;

uniform sampler2D nTexture;

void main() {
    vec2 stepCoord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    stepCoord *= resolution;
    stepCoord = floor(stepCoord);
    stepCoord /= resolution;
    vec2 coord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    float factorS = 1.0 / resolution;
    coord = vec2(mod(coord.x, factorS) / factorS,(mod(coord.y, factorS) / factorS));

    gl_FragColor = texture2D(uTexture, coord);
}