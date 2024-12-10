import { UserCircleIcon, BuildingLibraryIcon, TableCellsIcon } from '@heroicons/react/24/solid';
import { Roles } from '../utils/roles';
import ListUsers from '@/pages/dashboard/list-users';
import ListStores from '@/pages/dashboard/list-stores';
import ListProduct from '@/pages/dashboard/list-products';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

const routesUser = {
  [Roles.ADMIN]: [
    {
      icon: <UserCircleIcon {...icon} />,
      name: 'Listado de Usuarios',
      path: '/usuarios',
      element: <ListUsers />,
    },
    {
      icon: <BuildingLibraryIcon {...icon} />,
      name: 'Listado de Tiendas',
      path: '/tiendas',
      element: <ListStores />,
    },
  ],
  [Roles.VENDOR]: [
    {
      icon: <TableCellsIcon {...icon} />,
      name: 'Listado de Productos',
      path: '/productos',
      element: <ListProduct />,
    },
  ],
};

const getRoutesByRole = (role) => {
  const routes = routesUser[role];
  if (!routes) return [];
  return routes;
};

export { getRoutesByRole };
