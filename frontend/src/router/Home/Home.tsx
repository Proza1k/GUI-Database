import { T, TabMenu, TabProps, TableRow, useToast } from '@admiral-ds/react-ui'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Table } from 'src/components/Table/Table'
import { DATABASE_CONSTANTS } from 'src/constants/database'
import { DatabaseHelper } from 'src/helpers/database'
import { RequestMethod, fetchJson } from 'src/helpers/request'
import { useNotification } from 'src/hooks/useNotification'
import { withLoading } from 'src/hooks/withLoading'
import { RequestPayload } from 'src/types/request'
import { Status } from 'src/types/status'

export type ContentProps = {
  title: string
  items: Array<TabProps>
}

const Content = withLoading(({ title, items }: ContentProps) => {
  const [activeTab, setActiveTab] = useState(items[0]?.id)

  return (
    <>
      <T font="Header/H1">{title}</T>
      <TabMenu
        style={{
          marginTop: 20
        }}
        tabs={items}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <TabContent tableName={activeTab} />
    </>
  )
})

const TabContent = ({ tableName }: { tableName: string }) => {
  const notification = useNotification()
  const { data, isLoading } = useQuery(`table-${tableName}`, async () => {
    const request: RequestPayload<Array<TableRow>> = await fetchJson('/api/query', RequestMethod.POST, {
      query: DatabaseHelper.getTableQuery(tableName)
    })

    if (request.status === Status.ERROR) {
      notification({
        status: 'error',
        message: `Не удалось загрузить данные с таблицы ${tableName}`,
        isProgress: true
      })
    }

    if (request.payload) {
      return request.payload
    }

    return []
  })

  return <Table tableName={tableName} items={data as Array<TableRow>} loading={isLoading} />
}

export const Home = () => {
  const notification = useNotification()
  const { data, isLoading } = useQuery('tables', async () => {
    const request: RequestPayload<Array<{ table_name: string }>> = await fetchJson('/api/query', RequestMethod.POST, {
      query: DATABASE_CONSTANTS.GET_TABLE
    })

    if (request.status === Status.ERROR) {
      notification({
        status: 'error',
        message: `Не удалось загрузить данные с базы ${DATABASE_CONSTANTS.NAME}`,
        isProgress: true
      })
    }

    if (request.payload) {
      return request.payload.map(table => ({
        id: table.table_name,
        content: table.table_name
      }))
    }

    return []
  })

  return <Content title={DATABASE_CONSTANTS.NAME} items={data as TabProps[]} loading={isLoading} />
}
