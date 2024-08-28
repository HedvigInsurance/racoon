import { lazy, Suspense } from 'react'
import * as React from 'react'
import { Route, Routes } from 'react-router-dom'

const MainPage = lazy(() => import('./MainPage'))

export const SOSPageRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Suspense>
  )
}
