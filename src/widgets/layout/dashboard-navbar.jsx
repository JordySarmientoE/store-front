import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react';
import {
  Bars3Icon,
  XCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { useControllerProvider, setOpenSidenav } from '@/context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { toTitleCase } from '@/utils/functions.helper';

export function DashboardNavbar() {
  const [controller, dispatchSidenav] = useControllerProvider();
  const { openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split('/').filter((el) => el !== '');
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const logOut = () => {
    dispatch(logout());
    localStorage.clear();
    navigator('/sign-in');
  };

  return (
    <Navbar
      color="white"
      className={`rounded-xl transition-all "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"`}
      fullWidth
      blurred={true}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs className={`bg-transparent p-0 transition-all mt-1`}>
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center justify-end">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatchSidenav, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="border-0 p-0 m-0">
              <MenuItem
                className="flex justify-center items-center gap-1"
                disabled
              >
                {toTitleCase(user.name)} {toTitleCase(user.lastname)}
              </MenuItem>
              <MenuItem
                className="flex justify-center items-center gap-1"
                onClick={logOut}
              >
                <XCircleIcon className="h-5 w-5 text-blue-gray-500" />
                Cerrar Sesión
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = '/src/widgets/layout/dashboard-navbar.jsx';

export default DashboardNavbar;
