import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PostProvider } from '@/contexts/PostContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { CommunityProvider } from '@/contexts/CommunityContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PostProvider>
            <CommunityProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </CommunityProvider>
          </PostProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
