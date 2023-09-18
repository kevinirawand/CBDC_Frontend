import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Grid, Container, Typography, Stack, Card, Button, TextField } from '@mui/material';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import Iconify from '../components/iconify';
import IMRecentTransactionPage from './IM-RecentTransaction';
import IMRedeemRequestList from './IM-RedeemRequestList';
import IMExchangeRequestList from './IM-ExchangeRequestList';


// ----------------------------------------------------------------------

export default function IMAccountPage() {
   const [redeemAmount, setRedeemAmount] = useState();
   const [exchangeAmount, setExchangeAmount] = useState();
   const [user, setUser] = useState();

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

   const handleRedeem = async (amount) => {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://localhost:1337/api/v1/transaction/redeem/request`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         },
         body: JSON.stringify({ amount: amount })
      })

      const redeemJson = await response.json();
      console.info(redeemJson)
      handleUser()
      return redeemJson
   }

   const handleExchange = async (amount) => {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://localhost:1337/api/v1/transaction/redeem/interbank/`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         },
         body: JSON.stringify({ amount: amount })
      })

      const redeemJson = await response.json();
      handleUser()
      return redeemJson
   }

   useEffect(() => {
      handleUser()
   }, [])

   const color = 'primary'

   return (
      <>
         <Helmet>
            <title> Dashboard | CBDC ITB </title>
         </Helmet>

         <Container maxWidth="auto">
            <Typography variant="h4" sx={{ mb: 5 }}>
               Account
            </Typography>

            <Grid container spacing={3}>
               <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="CBDC Balance" total={user?.data?.wallet?.ganeshaPoint == 0 ? '0' : user?.data?.wallet?.ganeshaPoint} icon={'ant-design:android-filled'} floatingPL={'+14.00(+0.50%)'} />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="RTGS  Balance" total={user?.data?.wallet?.rupiahBalance == '0' ? 0 : user?.data?.wallet?.rupiahBalance} color="info" icon={'ant-design:apple-filled'} floatingPL={'+138.97(+0.54%)'} />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                     py: 5,
                     px: 5,
                     boxShadow: 0,
                     textAlign: 'center',
                     color: (theme) => theme.palette[color].darker,
                     bgcolor: (theme) => theme.palette[color].lighter,
                     width: '100%'

                  }} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                     <Typography style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        Request Redeem
                     </Typography>
                     <Stack style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography>
                           From account : CBDC
                        </Typography>
                        <Typography>
                           Balance : {user?.data?.wallet?.ganeshaPoint}
                        </Typography>
                     </Stack>

                     <Stack style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography>
                           To account : RTGS
                        </Typography>
                        <Typography>
                           Balance : {user?.data?.wallet?.rupiahBalance}
                        </Typography>
                     </Stack>

                     <TextField
                        type="number"
                        name="amount"
                        label="Amount"
                        onChange={(e) => setRedeemAmount(e.target.value)}
                        style={{ display: 'flex', marginTop: '10px', marginBottom: '10px' }}
                     />

                     <Stack style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                        <Button style={{ backgroundColor: '#068FFF' }} variant="contained" startIcon={<Iconify icon="fluent-mdl2:accept" />} onClick={() => { handleRedeem(redeemAmount) }}>
                           Confirm
                        </Button>

                        <Button style={{ backgroundColor: '#FE0000' }} variant="contained" startIcon={<Iconify icon="octicon:x-12" />}>
                           Cancel
                        </Button>
                     </Stack>

                  </Card>
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                     py: 5,
                     px: 5,
                     boxShadow: 0,
                     textAlign: 'center',
                     color: (theme) => theme.palette[color].darker,
                     bgcolor: (theme) => theme.palette[color].lighter,
                     width: '100%'

                  }} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                     <Typography style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                        Request Exchange
                     </Typography>
                     <Stack style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography>
                           From account : RTGS
                        </Typography>
                        <Typography>
                           Balance : {user?.data?.wallet?.rupiahBalance}
                        </Typography>
                     </Stack>

                     <Stack style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography>
                           To account : CBDC
                        </Typography>
                        <Typography>
                           Balance : {user?.data?.wallet?.ganeshaPoint}
                        </Typography>
                     </Stack>

                     <TextField
                        type="number"
                        name="amount"
                        label="Amount"
                        onChange={(e) => setExchangeAmount(e.target.value)}
                        style={{ display: 'flex', marginTop: '10px', marginBottom: '10px' }}
                     />

                     <Stack style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                        <Button style={{ backgroundColor: '#068FFF' }} variant="contained" startIcon={<Iconify icon="fluent-mdl2:accept" />} onClick={() => { handleExchange(exchangeAmount) }}>
                           Confirm
                        </Button>

                        <Button style={{ backgroundColor: '#FE0000' }} variant="contained" startIcon={<Iconify icon="octicon:x-12" />}>
                           Cancel
                        </Button>
                     </Stack>

                  </Card>
               </Grid>

               <Grid item xs={12} md={12} lg={6}>
                  <IMRedeemRequestList />
               </Grid>

               <Grid item xs={12} md={12} lg={6}>
                  <IMExchangeRequestList />
               </Grid>
            </Grid>
         </Container>
      </>
   );
}
