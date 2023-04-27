import { Home } from 'src/router/Home'
import { Route, Routes } from 'src/types/routes'

export const useRoutes = (): Route[] => [
  {
    path: Routes.HOME,
    element: <Home />,
    title: 'HOME',
    isRouteEnabled: true
  }
]
