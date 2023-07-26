// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const intermediariesConfig = [
   {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: icon('ic_analytics'),
   },
   {
      title: 'validator',
      path: '/dashboard/user',
      icon: icon('ic_lock'),
   },
   {
      title: 'RTGS',
      path: '/dashboard/products',
      icon: icon('ic_cart'),
   },
];

export default intermediariesConfig;
