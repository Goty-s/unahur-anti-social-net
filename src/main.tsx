import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./App.css"
import { AuthProvider } from './context/userContext.tsx'
import { NotificationProvider } from './context/notificationContext.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import { LoginProvider } from './context/LoginContext.tsx'
import { PostProvider } from './context/PostContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoginProvider>
          <PostProvider>
            <NotificationProvider>
              <ScrollToTop />
              <App />
            </NotificationProvider>
          </PostProvider>
        </LoginProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)