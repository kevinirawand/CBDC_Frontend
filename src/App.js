import { BrowserRouter, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {

   if (!localStorage.getItem('token')) {
      <Navigate to="/auth/login" />
   }
   return (
      <HelmetProvider>
         <BrowserRouter>
            <ThemeProvider>
               <ScrollToTop />
               <StyledChart />
               <Router />
            </ThemeProvider>
         </BrowserRouter>
      </HelmetProvider>
   );
}
