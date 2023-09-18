import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import RegisterPage from './pages/RegisterPage';
import CBRecentTransactionPage from './pages/CB-RecentTransactions';
import CBValidatorsPage from './pages/CB-Validators';
import CBUsersPage from './pages/CB-Users';
import CBActivationPage from './pages/CB-Activation';
import CBDashboardPage from './pages/CB-Dashboard';
import IMDashboardPage from './pages/IM-Dashboard';
import IMRecentTransactionPage from './pages/IM-RecentTransaction';
import IMAccountPage from './pages/IM-Account';
import IMRedeemExchangeList from './pages/IM-ExchangeRequestList';

// ----------------------------------------------------------------------

export default function Router() {
   const routes = useRoutes([
      {
         path: 'auth',
         children: [
            { path: 'login', element: <LoginPage />, index: true },
            { path: 'register', element: <RegisterPage /> },
         ]
      },
      {
         path: '/central-bank',
         element: <DashboardLayout />,
         children: [
            { path: 'dashboard', element: <CBDashboardPage />, index: true },
            { path: 'validators', element: <CBValidatorsPage /> },
            { path: 'rtgs', element: <ProductsPage /> },
            { path: 'users', element: <CBUsersPage /> },
            { path: 'activation', element: <CBActivationPage /> }
         ],
      },
      {
         path: '/intermediaries',
         element: <DashboardLayout />,
         children: [
            { path: 'dashboard', element: <IMDashboardPage />, index: true },
            { path: 'account', element: <IMAccountPage /> },
            { path: 'recent-transaction', element: <IMRecentTransactionPage    /> },
            { path: 'issuing', element: <ProductsPage /> },
         ],
      },
      {
         element: <SimpleLayout />,
         children: [
            { element: <Navigate to="/auth/login" />, index: true },
            { path: '404', element: <Page404 /> },
            { path: '*', element: <Navigate to="/404" /> },
         ],
      },
      {
         path: '*',
         element: <Navigate to="/404" replace />,
      },
   ]);

   return routes;
}
