import fragmentShaderSource from "./glsl/fragments/fragment.glsl";
import vertexShaderSource from "./glsl/vertexes/vertex.glsl";
import "./webgl.scss";
import { createProgram, createShader } from "./program-webgl";
import { m3 } from "./matrix3";

function setGeometry(gl: WebGL2RenderingContext) {
  const vertices = [0, -100, 150, 125, -175, 100];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return vertices.length / 2;
}

const container = document.getElementById("container");
function draw({
  gl,
  program,
  vao,
  matrixLocation,
  positionBuffer,
}: {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  matrixLocation: WebGLUniformLocation;
  positionBuffer: WebGLBuffer;
}) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const verticesCount = setGeometry(gl);
  const translation = [500, 500];
  const angleInRadians = 0;
  const scale = [1, 1];
  let matrix = m3.projection(gl.canvas.width, gl.canvas.height);
  matrix = m3.translate(matrix, translation[0], translation[1]);
  matrix = m3.rotate(matrix, angleInRadians);
  matrix = m3.scale(matrix, scale[0], scale[1]);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
  gl.drawArrays(gl.TRIANGLES, 0, verticesCount);
}
export async function init() {
  if (!container) throw Error();
  const canvas = document.createElement("canvas");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.appendChild(canvas);
  const gl = canvas.getContext("webgl2");
  if (!gl) throw Error();
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  if (!vertexShader || !fragmentShader) throw Error();
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) throw Error();
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  if (positionAttributeLocation < 0) throw Error();

  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  if (!matrixLocation) throw Error();

  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw Error();
  const vao = gl.createVertexArray();
  if (!vao) throw Error();

  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  const animate = () => {
    draw({
      gl,
      program,
      vao,
      matrixLocation,
      positionBuffer,
    });
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

init().then(() => {});
