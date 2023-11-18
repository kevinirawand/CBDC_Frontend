import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
   AppTasks,
   AppNewsUpdate,
   AppOrderTimeline,
   AppCurrentVisits,
   AppWebsiteVisits,
   AppTrafficBySite,
   AppWidgetSummary,
   AppCurrentSubject,
   AppConversionRates,
   StableCoins
} from '../sections/@dashboard/app';
import CBRecentTransactionPage from './CB-RecentTransactions';

// ----------------------------------------------------------------------

export default function CBDashboardPage() {
   const [user, setUser] = useState([]);

   const theme = useTheme();

   const handleUser = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      const response = await fetch(`http://localhost:1337/api/v1/user/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const userJson = await response.json();
      setUser(userJson)
   }

   useEffect(() => {
      handleUser()
   }, [])

   return (
      <>
         <Helmet>
            <title> Dashboard | CBDC ITB </title>
         </Helmet>

         <Container maxWidth="auto">
            <Typography variant="h4" sx={{ mb: 5 }}>
               Dashboard
            </Typography>

            <Grid container spacing={3}>
               <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="Validator" total={32.451} icon={'ant-design:android-filled'} floatingPL={'+14.00(+0.50%)'} />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="RTGS" total={15.236} color="info" icon={'ant-design:apple-filled'} floatingPL={'+138.97(+0.54%)'} />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="Issued CBDC" total={7.688} color="warning" icon={'ant-design:windows-filled'} floatingPL={'+57.62(+0.76%)'} />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="Orders" total={1.553} color="error" icon={'ant-design:bug-filled'} floatingPL={'+138.97(+0.54%)'} />
               </Grid>

               <Grid item xs={12} md={6} lg={8}>
                  <AppWebsiteVisits
                     title="Issuance Records"
                     subheader="Record of CBDC Issued during period"
                     secondTitle="Total Issued"
                     chartLabels={[
                        '01/01/2023',
                        '02/01/2023',
                        '03/01/2023',
                        '04/01/2023',
                        '05/01/2023',
                        '06/01/2023',
                        '07/01/2023',
                        '08/01/2023',
                        '09/01/2023',
                        '10/01/2023',
                        '11/01/2023',
                        '12/01/2023',
                     ]}
                     chartData={[
                        {
                           name: 'Issued',
                           type: 'line',
                           fill: 'solid',
                           data: [1000, 1001, 2200, 2007, 1003, 2002, 3070, 2001, 4040, 2020, 3000, 4000],
                        },
                        {
                           name: 'RTGS',
                           type: 'line',
                           fill: 'solid',
                           data: [4040, 5005, 4001, 6007, 2020, 4030, 2010, 4001, 5006, 2070, 4030, 1040],
                        }
                     ]}
                  />
               </Grid>

               <Grid item xs={12} md={6} lg={4}>
                  <AppCurrentSubject
                     title="Validator Activity Profile"
                     chartLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']}
                     chartData={[
                        { name: 'Sales', data: [80, 50, 30, 40, 100, 20, 73, 21] },
                        { name: 'Orders', data: [20, 30, 40, 80, 20, 80, 34, 51] }
                     ]}
                     chartColors={[...Array(20)].map(() => theme.palette.text.secondary)}
                  />
               </Grid>

               <Grid item xs={12} md={6} lg={6}>
                  <StableCoins
                     title="Total Issued"
                     amount="184.82"
                     plus="+1.37"
                     colors="#964FFF"
                     chartLabels={[
                        '01/01/2023',
                        '02/01/2023',
                        '03/01/2023',
                        '04/01/2023',
                        '05/01/2023',
                        '06/01/2023',
                        '07/01/2023',
                        '08/01/2023',
                        '09/01/2023',
                        '10/01/2023',
                        '11/01/2023',
                        '12/01/2023',
                     ]}
                     chartData={[
                        {
                           name: 'CBDC',
                           type: 'area',
                           fill: 'solid',
                           data: [1000, 1001, 2200, 2007, 1003, 2002, 3070, 2001, 4040, 2020, 3000, 4000],
                        }
                     ]}
                  />
               </Grid>

               <Grid item xs={12} md={6} lg={6}>
                  <StableCoins
                     title="Transactions"
                     amount="149.7"
                     plus="-2.87"
                     colors="#FA3252"
                     chartLabels={[
                        '01/01/2023',
                        '02/01/2023',
                        '03/01/2023',
                        '04/01/2023',
                        '05/01/2023',
                        '06/01/2023',
                        '07/01/2023',
                        '08/01/2023',
                        '09/01/2023',
                        '10/01/2023',
                        '11/01/2023',
                        '12/01/2023',
                     ]}
                     chartData={[
                        {
                           name: 'CBDC',
                           type: 'area',
                           fill: {
                              type: 'line',
                              colors: '#FA3252'
                           },
                           data: [1000, 1001, 2200, 2007, 1003, 2002, 3070, 2001, 4040, 2020, 3000, 4000],
                        }
                     ]}
                  />
               </Grid>

               <Grid item xs={12} md={12} lg={12}>
                  <CBRecentTransactionPage />
               </Grid>
            </Grid>
         </Container>
      </>
   );
}
