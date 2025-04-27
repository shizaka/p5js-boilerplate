#ifdef GL_ES
precision mediump float;
#endif

// uniforms passed from sketch.js
uniform vec2 iResolution;
uniform float iTime;

// cosine based palette, 4 vec3 params
// https://iquilezles.org/articles/palettes/
// See also https://github.com/thi-ng/color/blob/master/src/gradients.org
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.283185*(c*t+d) );
}

void main() {

//    // position of the pixel divided by resolution, to get normalized positions on the canvas
//    vec2 uv = gl_FragCoord.xy/iResolution.xy;
//    // make the center of the canvas 0,0
//    uv = uv - 0.5;
//    // make the borders of the canvas -1.0 to 1.0
//    uv = uv * 2.0;
//    // multiply x by the aspect ratio to prevent distortions in any ratio
//    uv.x *= iResolution.x / iResolution.y;
    // Combine all of the above
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;

    vec2 uv0 = uv; // Copy the value of uv before we modify it. We will use it for the color gradient, so it will cover the entire canvas instead of being repeated.

    vec3 finalColor = vec3(0.);

    // each iteration creates more complexity, set to 1.0 for the original pattern without iteration.
    // When increasing the number of iterations, it is advisable to reduce the time coefficient in the color calculation to make the result less overwhelming.
    for (float i = 0.0; i < 4.0; i++) {
        //    uv *= 2.;
        //    uv = fract(uv); // fract() return the fractional part of the input (i.e. the part after the comma). fract(1.38) = .38. Since our canvas goes from -1 to 1 on both axis, this splits it in 4 equal parts.
        //    // By multiplying uv by 2 first, and substracting 0.5 afterwards, we split in in 16 part and allow the following operation to center the coordinates in each part.
        //    uv -= 0.5;

        // The 3 lines above can be shorten as such:
//        uv = fract(uv * 2.) - 0.5;

        // Multiplying by 2.0 creates perfect repetitions. Offseting this multiplicator breaks the repetitions and adds more variety.
        uv = fract(uv * 1.5) - 0.5;

//        // calculate the distance between the center (0,0) and the current pixel's position
//        // length() calculates the magnitude of the given vector, i.e. the distance between the vector and its origin.
//        float d = length(uv);

        float d = length(uv) * exp(-length(uv0)); // Adding an exp() coefficient adds more variation in each fragment.

        //    d -= 0.5; // length(uv) - r is a signed distance function (SDF) for a disc of r. Values are positive outside of the disc, 0 at the border and negative inside. Example SDFs: https://iquilezles.org/articles/distfunctions2d/
        //    d = abs(d); // Setting the color to vec4(d,d,d,1.0); will now draw a blurry ring : more black near the circle border (where d is close to zero) and more white in the center and further away from the border.
        //    d = step(0.5, d); // step(0.5, d) returns 0 for values less than 0.5 and 1 for values above 0.5. This makes a ring shape with sharp edges. smoothstep(a, b, d) returns 0 for value below the first threshold (a), 1 above the second threshold (b), and an interpolated range of values from 0 to 1 for values between the thresholds. This gives control over the sharpness of the edges/transition.

        //    d = sin(d*8.)/8.; // The sin() function creates repetition. sin(x) when x is between 0 and 1 is very close to x, so this would result in a single dot. Increasing the frequency of the input creates concentric rings. It also stretches the space, so we divide the result by the same factor, eg sin(d*8)/8.
        
        //    vec3 col = vec3(2., 1., 0.5); // This vec3 will serve as a base RGB color. Values higher than 1.0 can be used to make the color "brighter" (i.e. thicker bright neon part before visible falloff in this case)

        vec3 cola = vec3(0.5, 0.5, 0.5);
        vec3 colb = vec3(0.5, 0.5, 0.5);
        vec3 colc = vec3(1.0, 1.0, 1.0);
        vec3 cold = vec3(0.263,0.416,0.557);

//        vec3 col = palette(length(uv0) + iTime*.5, cola, colb, colc, cold);
        vec3 col = palette(length(uv0) + iTime*.4 + i*.4, cola, colb, colc, cold); // Adding i to the calculation to offset the color for each iteration.


        d = sin(d*8. + iTime)/8.; // By additionally using a time parameter to offset the input before applying sin, we now have infinite animated circles growing from or shrinking to the center.

        d = abs(d);

        //    d = smoothstep(0., 0.1, d); // Blurry concentric rings
//        d = 0.01 / d; // The 1/x falloff accurately mimics a neon glow. It is always higher than 1 for values below 1 though. d went though sin() and abs() so it is between 0 and 1. So we're using a fraction of it to have most of the falloff for our values of d between 0 and 1.
        d = pow(0.01 / d, 1.5); // pow() additionally makes lower values even lower, accentuating the dark areas, while values closer to 1 are closer to the original.


        //    gl_FragColor = vec4(d,d,d,1.0); // At this point, we have concentric neon-glowing white rings
        finalColor += col * d;
    }

    gl_FragColor = vec4(finalColor,1.0); // R,G,B,A
}

