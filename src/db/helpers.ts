export function createUpdate(table: string, id: number, data: { [key: string]: any }) {
  const keys = Object
    .keys(data)
    .filter((k) => data[k] !== undefined);
  const names = keys.map((k, index) =>
    k + ' = $' + (index + 1)
  ).join(', ');
  const values = keys.map((k) => data[k]);
  values.push(id);
  return {
    query: `UPDATE ${table} SET ${names} WHERE id = $${values.length} RETURNING *`,
    values
  };
}
