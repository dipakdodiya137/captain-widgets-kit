import Dashboard from '../pages/home/Home.jsx';
import Listing from '../pages/listing/listing.jsx';
import Setting from '../pages/setting/setting.jsx';
import WidgetBuilder from '../pages/widget-builder/widget-builder.jsx';
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
    path: '/listing',
    element: <Listing />
  },
  {
    path: '/setting',
    element: <Setting />
  },
  {
    path: '/edit/:id',
    element: <WidgetBuilder />
  },
];

export default routes;
