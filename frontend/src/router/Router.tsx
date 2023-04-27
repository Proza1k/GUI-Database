import { Routes, Route } from 'react-router-dom'
import { useRoutes } from 'src/hooks/routes'

export const Router = () => {
  const routes = useRoutes()

  return (
    <Routes>
      {routes.map(route => {
        return <Route key={route.path} path={route.path} element={route.element} />
      })}
    </Routes>
  )
}
