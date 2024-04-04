import { multiply_matrix_vector, multiply_matrices, cross_product } from "./linear-algebra.js";
import { normalize_vector, compute_angle_between_vectors } from "./linear-algebra.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
const fov = 90;
const near = -100;
const far = 100;
const aspect_ratio = width / height;
const eye = [0, 0, -400];
const sphere_radius = 300;

let counter = 0;
let vec1 = null;
let vec2 = null;
let is_dragging = false;
let rotation_matrix = null;

const perspective_matrix = [
  [1 / (aspect_ratio * Math.tan(fov / 2)), 0, 0, 0],
  [0, 1 / Math.tan(fov / 2), 0, 0],
  [0, 0, (far + near) / (near - far), (2 * far * near) / (far - near)],
  [0, 0, 1, 0],
];

const camera_matrix = [
  [1, 0, 0, -eye[0]],
  [0, 1, 0, -eye[1]],
  [0, 0, 1, -eye[2]],
  [0, 0, 0, 1],
];

const viewport_matrix = [
  [width / 2, 0, 0, 0],
  [0, height / 2, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

let transform_matrix = multiply_matrices(multiply_matrices(viewport_matrix, perspective_matrix), camera_matrix);

const points = [
  [-100, -100, -100, 1],
  [100, -100, -100, 1],
  [100, 100, -100, 1],
  [-100, 100, -100, 1],
  [-100, -100, 100, 1],
  [100, -100, 100, 1],
  [100, 100, 100, 1],
  [-100, 100, 100, 1],
];

function update() {
  counter += 10;

  if (counter >= 20) {
    // clear the canvas
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // rotate the points
    if (rotation_matrix != null) {
      for (let i = 0; i < points.length; i++) {
        points[i] = multiply_matrix_vector(rotation_matrix, points[i]);
      }
    }

    //  copy the points and transform the copies
    let points_copy = [];
    for (let i = 0; i < points.length; i++) {
      points_copy.push(multiply_matrix_vector(transform_matrix, points[i]));
    }

    // draw the cube
    for (let i = 0; i < 4; i++) {
      connect(i, (i + 1) % 4, points_copy);
      connect(i + 4, ((i + 1) % 4) + 4, points_copy);
      connect(i, i + 4, points_copy);
    }
    counter = 0;
  }
  requestAnimationFrame(update);
}

function connect(i, j, points) {
  const [x1, y1, z1, w1] = points[i];
  const [x2, y2, z2, w2] = points[j];
  context.strokeStyle = "white";
  context.beginPath();
  context.moveTo(x1 / w1, y1 / w1);
  context.lineTo(x2 / w2, y2 / w2);
  context.stroke();
}

canvas.addEventListener("mousedown", (event) => {
  is_dragging = true;

  // compute vec1
  const x = event.clientX - width * 0.5;
  const y = event.clientY - height * 0.5;
  const z = -Math.sqrt(sphere_radius ** 2 - x ** 2 - y ** 2);
  vec1 = [x, y, z, 1];
});

canvas.addEventListener("mousemove", (event) => {
  if (!is_dragging) return;

  // compute vec2
  const x = event.clientX - width * 0.5;
  const y = event.clientY - height * 0.5;
  const z = -Math.sqrt(sphere_radius ** 2 - x ** 2 - y ** 2);
  vec2 = [x, y, z, 1];

  // compute the angle between vec1 and vec2
  const theta = compute_angle_between_vectors(vec1, vec2);

  // construct an orthonormal basis from vec1 and vec2
  const w = normalize_vector(cross_product(vec1, vec2));
  const u = normalize_vector(cross_product(vec1, w));
  const v = cross_product(w, u);

  // construct the matrix of rotation around the vector w with angle theta
  const matrix_1 = [
    [u[0], v[0], w[0], 0],
    [u[1], v[1], w[1], 0],
    [u[2], v[2], w[2], 0],
    [0, 0, 0, 1],
  ];
  const matrix_2 = [
    [Math.cos(theta), -Math.sin(theta), 0, 0],
    [Math.sin(theta), Math.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  const matrix_3 = [
    [u[0], u[1], u[2], 0],
    [v[0], v[1], v[2], 0],
    [w[0], w[1], w[2], 0],
    [0, 0, 0, 1],
  ];

  rotation_matrix = multiply_matrices(matrix_1, multiply_matrices(matrix_2, matrix_3));

  vec1 = vec2;
});

window.addEventListener("mouseup", (event) => {
  vec1 = null;
  vec2 = null;
  is_dragging = false;
  rotation_matrix = null;
});

// set the canvas width and height
canvas.height = height;
canvas.width = width;

// Translate the coordinate system to the center of the canvas
context.translate(width * 0.5, height * 0.5);

requestAnimationFrame(update);
