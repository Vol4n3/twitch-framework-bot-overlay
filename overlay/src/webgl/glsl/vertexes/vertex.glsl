#version 300 es
#include ../utils/test;
in vec2 a_position;
uniform mat3 u_matrix;
out vec4 v_color;
void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    v_color = gl_Position * 0.5 + test();
}