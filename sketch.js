let theShader;

function preload() {
    theShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

function setup() {
    pixelDensity(1);
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
}

function draw() {
    theShader.setUniform('iResolution', [width, windowHeight]);
    theShader.setUniform('iTime', millis()/1000);
    shader(theShader);
    rect(0,0,windowWidth, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}