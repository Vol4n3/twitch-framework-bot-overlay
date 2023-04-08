#version 300 es
#include ../utils/hash;
uniform int numVerts;
uniform float time;

void main() {
    float u = float(gl_VertexID) / float(numVerts);  // goes from 0 to 1
    float off = floor(time + u) / 1000.0;            // changes once per second per vertex
    float x = hash(u + off) * 2.0 - 1.0;             // random position
    float y = fract(time + u) * -2.0 + 1.0;          // 1.0 ->  -1.0

    gl_Position = vec4(x, y, 0, 1);
    gl_PointSize = 2.0;
}