export enum Routes {
  HOME = '/'
}

export type Route = {
  path: string | Routes
  element: React.ReactElement
  isRouteEnabled: boolean
  title: string | React.ReactElement
  onClick?: () => void
}
