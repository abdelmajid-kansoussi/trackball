export function multiply_matrices(matrix1, matrix2) {
  // computes A * B
  const A_rows_num = matrix1.length;
  const A_cols_num = matrix1[0].length;
  const B_rows_num = matrix2.length;
  const B_cols_num = matrix2[0].length;
  if (A_cols_num != B_rows_num) return;
  let result = [];
  for (let i = 0; i < A_rows_num; i++) {
    let row = [];
    for (let j = 0; j < B_cols_num; j++) {
      let c = 0;
      for (let k = 0; k < A_cols_num; k++) c += matrix1[i][k] * matrix2[k][j];
      row.push(c);
    }
    result.push(row);
  }
  return result;
}

export function multiply_matrix_vector(matrix, vec) {
  // result = matrix * vec
  const matrix_rows_num = matrix.length;
  const matrix_cols_num = matrix[0].length;
  if (matrix_cols_num != vec.length) return;
  let result = [];
  for (let i = 0; i < matrix_rows_num; i++) {
    let c = 0;
    for (let j = 0; j < matrix_cols_num; j++) {
      c += matrix[i][j] * vec[j];
    }
    result.push(c);
  }
  return result;
}

export function cross_product(vec1, vec2) {
  // compute vec1 ^ vec2
  if (vec1.length != vec2.length) return;
  const x = vec1[1] * vec2[2] - vec1[2] * vec2[1];
  const y = vec1[2] * vec2[0] - vec1[0] * vec2[2];
  const z = vec1[0] * vec2[1] - vec1[1] * vec2[0];
  return [x, y, z, 1];
}

export function dot_product(vec1, vec2) {
  if (vec1.length != vec2.length) return;
  return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
}

export function compute_vector_length(vec) {
  return Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2);
}

export function normalize_vector(vec) {
  const vec_len = compute_vector_length(vec);
  return [vec[0] / vec_len, vec[1] / vec_len, vec[2] / vec_len, 1];
}

export function compute_angle_between_vectors(vec1, vec2) {
  const vec1_len = compute_vector_length(vec1);
  const vec2_len = compute_vector_length(vec2);
  return Math.acos(dot_product(vec1, vec2) / (vec1_len * vec2_len));
}
