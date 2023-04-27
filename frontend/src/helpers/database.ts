import { RowId } from '@admiral-ds/react-ui'

const getTableQuery = (tableName: string) => `SELECT * FROM ${tableName}`
const removeTableQuery = (tableName: string, ids: Array<RowId>) =>
  `DELETE FROM ${tableName} WHERE id IN (${ids.join(',')})`
const addTableQuery = (tableName: string, values: object) => {
  const tableKeys = Object.keys(values).join(',')
  const tableValues = Object.values(values)
    .map(value => `'${value}'`)
    .join(',')
  return `INSERT INTO ${tableName} (${tableKeys}) values(${tableValues});`
}
const updateTableQuery = (tableName: string, values: object, id: string) => {
  const updationFields = Object.entries(values).map(([key, value]) => `${key}='${value}'`)
  return `UPDATE ${tableName} SET ${updationFields.join(',')} WHERE id=${id}`
}

export const DatabaseHelper = {
  getTableQuery,
  removeTableQuery,
  addTableQuery,
  updateTableQuery
}
