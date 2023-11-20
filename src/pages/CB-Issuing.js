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

export default function CBIssuing() {
   const [CBDC, setCBDC] = useState(0);
   const [issuingAmount, setIssuingAmount] = useState(0);

   const handleIssuing = async (amount) => {

      console.info(amount)
      const token = localStorage.getItem('token')

      const response = await fetch(`http://103.13.206.208:1337/api/v1/transaction/issuing`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         },
         body: JSON.stringify({ amount: parseInt(amount) })
      })

      const issuing = await response.json();
      handleGetCBDC();
      return issuing
   }

   const handleGetCBDC = async () => {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://103.13.206.208:1337/api/v1/transaction/issuing`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const asset = await response.json();
      setCBDC(asset.data.cbdcAmount);
      return asset.data.cbdcAmount;
   }

   useEffect(() => {
      handleGetCBDC()
   }, [])

   const color = 'primary'

   return (
      <>
         <Helmet>
            <title> Dashboard | CBDC ITB </title>
         </Helmet>

         <Container maxWidth="auto">
            <Typography variant="h4" sx={{ mb: 5 }}>
               Issuing
            </Typography>

            <Grid container spacing={3}>
               <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="CBDC" total={CBDC == 0 ? '0' : CBDC} icon={'ant-design:android-filled'} isAsset={true} />
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
                        Issuing
                     </Typography>
                     <Stack style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography>
                           Increase CBDC
                        </Typography>
                     </Stack>

                     <TextField
                        type="number"
                        name="amount"
                        label="Amount"
                        onChange={(e) => setIssuingAmount(e.target.value)}
                        style={{ display: 'flex', marginTop: '10px', marginBottom: '10px' }}
                     />

                     <Stack style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                        <Button style={{ backgroundColor: '#068FFF' }} variant="contained" startIcon={<Iconify icon="fluent-mdl2:accept" />} onClick={() => { handleIssuing(issuingAmount) }}>
                           Confirm
                        </Button>

                        <Button style={{ backgroundColor: '#FE0000' }} variant="contained" startIcon={<Iconify icon="octicon:x-12" />}>
                           Cancel
                        </Button>
                     </Stack>

                  </Card>
               </Grid>
            </Grid>
         </Container>
      </>
   );
}
