import {
  Table as AdmiralTable,
  Button,
  Column,
  IconButton,
  InputField,
  ModalButtonPanel,
  ModalContent,
  ModalTitle,
  TableRow,
  TextButton
} from '@admiral-ds/react-ui'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { ICONS } from 'src/constants/icon'
import { DatabaseHelper } from 'src/helpers/database'
import { RequestMethod, fetchJson } from 'src/helpers/request'
import { useNotification } from 'src/hooks/useNotification'
import { withLoading } from 'src/hooks/withLoading'
import { withModal } from 'src/hooks/withModal'
import { RequestPayload } from 'src/types/request'
import { Status } from 'src/types/status'

export type TableProps = {
  items: Array<TableRow>
  tableName: string
}

export type AddButtonProps = {
  tableName: string
  handleAdd: (values: object) => void
  columnList: Array<Column>
}

export type EditButtonProps = {
  tableName: string
  columnList: Array<Column>
  item: TableRow
}

const EXCLUDE_COLUMNS_NAMES_ARRAY: Array<string> = ['id', 'created_at', 'updated_at', 'actions']

const AddButton = withModal<AddButtonProps>(({ handleOpenModal }) => {
  return <TextButton dimension="m" icon={<ICONS.PlusOutline />} onClick={handleOpenModal} text="Add" />
})(({ handleCloseModal, handleAdd, columnList, tableName }) => {
  const [values, setValues] = useState<Record<string, string>>({})

  const handleChangeField = (field: string, value: string) => {
    setValues({
      ...values,
      [field]: value
    })
  }

  const handleSubmit = () => {
    const data = columnList.reduce((acc, column) => {
      if (values[column.name]) {
        acc[column.name] = String(values[column.name])
      }

      return acc
    }, {} as Record<string, string>)

    handleAdd(data)
    handleCloseModal()
  }

  return (
    <>
      <ModalTitle>{`Add data for Table ${tableName}`}</ModalTitle>
      <ModalContent>
        {columnList.map(column => {
          if (!EXCLUDE_COLUMNS_NAMES_ARRAY.includes(column.name)) {
            return (
              <InputField
                dimension="s"
                style={{
                  width: 320
                }}
                label={column.name}
                onChange={event => {
                  const value = event.target.value
                  handleChangeField(column.name, value)
                }}
              />
            )
          }

          return <></>
        })}
      </ModalContent>
      <ModalButtonPanel>
        <Button appearance="primary" dimension="m" onClick={handleSubmit}>
          Добавить
        </Button>
        <Button appearance="secondary" dimension="m" onClick={handleCloseModal}>
          Отменить
        </Button>
      </ModalButtonPanel>
    </>
  )
})

const EditButton = withModal<EditButtonProps>(({ handleOpenModal }) => {
  return (
    <IconButton dimension="s" onClick={handleOpenModal}>
      <ICONS.EditOutline />
    </IconButton>
  )
})(({ handleCloseModal, item, columnList, tableName }) => {
  const [values, setValues] = useState<Record<string, string>>(item as unknown as Record<string, string>)
  const notification = useNotification()

  const { refetch } = useQuery(`table-${tableName}`)

  const handleChangeField = (field: string, value: string) => {
    setValues({
      ...values,
      [field]: value
    })
  }

  const handleSubmit = async () => {
    const data = columnList.reduce((acc, column) => {
      if (values[column.name] && !EXCLUDE_COLUMNS_NAMES_ARRAY.includes(column.name)) {
        acc[column.name] = String(values[column.name])
      }

      return acc
    }, {} as Record<string, string>)

    const request: RequestPayload<void> = await fetchJson('/api/query', RequestMethod.POST, {
      query: DatabaseHelper.updateTableQuery(tableName, data, values.id)
    })

    if (request.status === Status.ERROR) {
      notification({
        status: 'error',
        message: `Не удалось обновить данные для таблицы ${tableName}`,
        isProgress: true
      })
    }

    if (request.status === Status.SUCCESS) {
      await refetch()
      notification({
        status: 'success',
        message: `Данные для таблицы ${tableName} успешно обновлены`,
        isProgress: true
      })
    }

    handleCloseModal()
  }

  return (
    <>
      <ModalTitle>{`Add data for Table ${tableName}`}</ModalTitle>
      <ModalContent>
        {columnList.map(column => {
          if (!EXCLUDE_COLUMNS_NAMES_ARRAY.includes(column.name)) {
            return (
              <InputField
                dimension="s"
                style={{
                  width: 320
                }}
                value={values[column.name]}
                label={column.name}
                onChange={event => {
                  const value = event.target.value
                  handleChangeField(column.name, value)
                }}
              />
            )
          }

          return <></>
        })}
      </ModalContent>
      <ModalButtonPanel>
        <Button appearance="primary" dimension="m" onClick={handleSubmit}>
          Добавить
        </Button>
        <Button appearance="secondary" dimension="m" onClick={handleCloseModal}>
          Отменить
        </Button>
      </ModalButtonPanel>
    </>
  )
})

export const Table = withLoading(({ items, tableName }: TableProps) => {
  const [data, setData] = useState(items)
  const [selectedRows, setSelectedRows] = useState<Array<TableRow>>([])
  const { refetch } = useQuery(`table-${tableName}`)

  const notification = useNotification()

  const handleSelectionChange = (ids: Record<string | number, boolean>): void => {
    const updRows = data.map(row => ({
      ...row,
      selected: ids[row.id]
    }))
    const currentSelectedRows = [...updRows.filter(row => row.selected && !selectedRows.find(sel => sel.id === row.id))]
    setSelectedRows(currentSelectedRows)
    setData(updRows)
  }

  const handleRemoveRows = async () => {
    const request: RequestPayload<void> = await fetchJson('/api/query', RequestMethod.POST, {
      query: DatabaseHelper.removeTableQuery(
        tableName,
        selectedRows.map(row => row.id)
      )
    })

    if (request.status === Status.ERROR) {
      notification({
        status: 'error',
        message: `Не удалось обновить данные для таблицы ${tableName}`,
        isProgress: true
      })
    }

    if (request.status === Status.SUCCESS) {
      await refetch()
      notification({
        status: 'success',
        message: `Данные для таблицы ${tableName} успешно обновлены`,
        isProgress: true
      })
    }
  }

  const handleAdd = async (values: object) => {
    const request: RequestPayload<void> = await fetchJson('/api/query', RequestMethod.POST, {
      query: DatabaseHelper.addTableQuery(tableName, values)
    })

    if (request.status === Status.ERROR) {
      notification({
        status: 'error',
        message: `Не удалось обновить данные для таблицы ${tableName}`,
        isProgress: true
      })
    }

    if (request.status === Status.SUCCESS) {
      await refetch()
      notification({
        status: 'success',
        message: `Данные для таблицы ${tableName} успешно обновлены`,
        isProgress: true
      })
    }
  }

  useEffect(() => {
    setData(items)
    setSelectedRows([])
  }, [items, refetch])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: 'auto', padding: '20px 0' }}>
        <TextButton
          disabled={selectedRows.length === 0}
          dimension="m"
          icon={<ICONS.DeleteOutline />}
          onClick={handleRemoveRows}
          text="Delete"
        />
        <AddButton tableName={tableName} columnList={generateColumnList(items)} handleAdd={handleAdd} />
      </div>
      <AdmiralTable
        onRowSelectionChange={handleSelectionChange}
        displayRowSelectionColumn
        columnList={generateColumnList(items)}
        rowList={generateRowList(data, generateColumnList(items), tableName)}
      />
    </>
  )
})

const generateColumnList = (items: Array<TableRow>): Array<Column> => {
  const columnsList: Array<Column> = []
  const firstColumn = items[0]

  if (firstColumn) {
    const keysColumn = Object.keys(firstColumn)
    keysColumn.forEach(key => {
      columnsList.push({
        name: key,
        title: key,
        width: `calc(100% / ${keysColumn.length + 1})`
      })
    })
  }

  columnsList.push({
    name: 'actions',
    title: 'actions',
    width: `calc(100% / ${columnsList.length + 1})`
  })

  return columnsList
}

const generateRowList = (items: Array<TableRow>, columnList: Array<Column>, tableName: string): Array<TableRow> => {
  return items.map(item => ({
    ...item,
    actions: <EditButton item={item} tableName={tableName} columnList={columnList} />
  }))
}
