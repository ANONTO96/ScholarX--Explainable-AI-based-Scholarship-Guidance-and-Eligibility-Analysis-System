import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { router } from './routes/Routes'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <RouterProvider router={router}></RouterProvider>
  </GoogleOAuthProvider>,
  )