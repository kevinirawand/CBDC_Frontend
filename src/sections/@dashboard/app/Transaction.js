import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

StableCoins.propTypes = {
   title: PropTypes.string,
   subheader: PropTypes.string,
   chartData: PropTypes.array.isRequired,
   chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function StableCoins({ title, subheader, chartLabels, chartData, cbdcSum, rtgsAmount, amount, plus, ...other }) {
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
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <CardHeader title={title} subheader={subheader} />
            <p style={{ fontWeight: 'bold', marginRight: '30px' }}>+{plus}%</p>
         </div>

         <h1 style={{ fontSize: '1.5em', marginLeft: '30px' }}>{amount}K</h1>
         <Box sx={{ p: 3, pb: 1 }} dir="ltr">
            <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
         </Box>
      </Card >
   );
}


