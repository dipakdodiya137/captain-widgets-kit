import Dashboard from '../pages/home/Home.jsx';
import Setting from '../pages/setting/setting.jsx';
// import WidgetEdit from '../pages/widgets/edit/widget-edit.jsx';

const routes = [
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/home',
    element: <Dashboard />
  },
  {
    path: '/setting',
    element: <Setting />
  },
];

export default routes;
