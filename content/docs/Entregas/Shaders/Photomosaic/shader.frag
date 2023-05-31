precision mediump float;

uniform vec2 uResolution;

uniform float resolution;

uniform float n;

uniform sampler2D uTexture;

uniform sampler2D nTexture;

void main() {

    vec2 stepCoord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    stepCoord *= resolution;
    stepCoord = floor(stepCoord);
    stepCoord /= resolution;

    vec4 pTexture = texture2D(uTexture,stepCoord);

    vec2 coord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    float factorS = 1.0 / resolution;
    float l = 0.2126 * pTexture.r + 0.7152 * pTexture.g + 0.0722 * pTexture.b;
    float s = floor(n*l);
    coord = vec2(((mod(coord.x, factorS)) / (factorS * n)) + (1.0/n)*s,(mod(coord.y, factorS) / factorS));


    gl_FragColor = texture2D(nTexture, coord);
}