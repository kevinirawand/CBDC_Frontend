// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const centralBankConfig = [
   {
      title: 'Dashboard',
      path: '/central-bank/dashboard',
      icon: icon('ic_analytics')
   },
   {
      title: 'Validators',
      path: '/central-bank/validators',
      icon: icon('ic_lock'),
   },
   {
      title: 'Users',
      path: '/central-bank/users',
      icon: icon('ic_cart'),
   },
   {
      title: 'Issuing',
      path: '/central-bank/issuing',
      icon: icon('ic_cart'),
   },
   {
      title: 'Activation',
      path: '/central-bank/activation',
      icon: icon('ic_cart'),
   },
];

export default centralBankConfig;
