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
    theShader.setUniform('u_resolution', [width, windowHeight]);
    shader(theShader);
    rect(0,0,windowWidth, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}