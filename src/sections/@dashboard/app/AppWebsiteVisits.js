import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
   title: PropTypes.string,
   subheader: PropTypes.string,
   chartData: PropTypes.array.isRequired,
   chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, cbdcSum, rtgsAmount, ...other }) {
   const chartOptions = useChart({
      plotOptions: { bar: { columnWidth: '100%' } },
      fill: { type: chartData.map((i) => i.fill) },
      labels: chartLabels,
      xaxis: { type: 'datetime' },
      tooltip: {
         shared: true,
         intersect: false,
         y: {
            formatter: (y) => {
               if (typeof y !== 'undefined') {
                  return `${y.toFixed(0)} balance`;
               }
               return y;
            },
         },
      },
   });

   return (
      <Card {...other}>
         <div>
            <CardHeader title={title} subheader={subheader} />
         </div>

         <div style={{ display: 'flex' }}>
            <div>
               <h1 className="second-header" style={{ fontWeight: 'lighter', marginRight: '250px', marginLeft: '25px', fontSize: '1.5em' }}>Total CBDC</h1>
               <div style={{ marginTop: '-35px', display: 'flex', position: 'relative' }}>
                  <h1 style={{ marginLeft: '30px', fontSize: '1.5em' }}>IDR 15,236 <span style={{ fontWeight: 'normal', fontSize: '.65em' }}>89.5% of 20,000 Total</span></h1>
               </div>
            </div>
            <div>
               <h1 className="second-header" style={{ fontWeight: 'lighter', fontSize: '1.5em' }}>Total RTGS</h1>
               <div style={{ marginTop: '-35px', display: 'flex', position: 'relative' }}>
                  <h1 style={{ fontSize: '1.5em' }}>IDR 753,098 <span style={{ fontWeight: 'normal', fontSize: '.65em' }}>10.5% of 20,000 Total</span></h1>
               </div>
            </div>
         </div>
         <Box sx={{ p: 3, pb: 1 }} dir="ltr">
            <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
         </Box>
      </Card >
   );
}


