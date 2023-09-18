// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const intermediariesConfig = [
   {
      title: 'Home',
      path: '/intermediaries/dashboard',
      icon: icon('ic_analytics'),
   },
   {
      title: 'Account',
      path: '/intermediaries/account',
      icon: icon('ic_lock'),
   },
   {
      title: 'Recent Transaction',
      path: '/intermediaries/recent-transaction',
      icon: icon('ic_lock'),
   }
];

export default intermediariesConfig;
