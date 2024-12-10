import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  IconButton,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { UserServices } from '@/services';
import { toTitleCase } from '@/utils/functions.helper';
import {
  BackwardIcon,
  CheckCircleIcon,
  ForwardIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { showConfirmDialog, showToast } from '@/utils/alerts';
import EditUserDialog from '@/widgets/dialogs/edit-user';
import { Roles } from '@/utils/roles';

export function ListUsers() {
  const [pagination, setPagination] = useState({
    total: 0,
    nroPages: 1,
    page: 1,
    data: [],
  });
  const itemsPerPage = 5;
  const [editUser, setEditUser] = useState(null);

  const getListOfUsers = async (page) => {
    try {
      const token = localStorage.getItem('token');
      const res = await UserServices.List(token, page, itemsPerPage);
      setPagination({
        nroPages: res.nroPages,
        total: res.total,
        page,
        data: res.data,
      });
    } catch (error) {
      showToast('error', error?.message);
    }
  };

  useEffect(() => {
    getListOfUsers(1);
  }, []);

  const handlePageChange = async (page) => {
    await getListOfUsers(page);
  };

  const updateUser = async (user) => {
    try {
      setEditUser(null);
      const usuario = `${toTitleCase(user.name)} ${toTitleCase(user.lastname)}`;
      showConfirmDialog({
        icon: 'error',
        title: `¿Desea editar el usuario ${usuario}?`,
        onConfirm: async () => {
          try {
            const token = localStorage.getItem('token');
            await UserServices.Edit(token, user.id, user);
            await getListOfUsers(pagination.page);
            showToast('success', `Se editó el usuario ${usuario}`);
          } catch (error) {
            showToast('error', error?.message);
          }
        },
        onClose: () => {
          setEditUser(user);
        },
      });
    } catch (error) {
      showToast('error', error?.message);
    }
  };

  const deleteUser = async (user) => {
    const usuario = `${toTitleCase(user.name)} ${toTitleCase(user.lastname)}`;
    showConfirmDialog({
      icon: 'error',
      title: `¿Desea eliminar el usuario ${usuario}?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          await UserServices.Delete(token, user.id);
          await getListOfUsers(pagination.page);
          showToast('success', `Se eliminó usuario ${usuario}`);
        } catch (error) {
          showToast('error', error?.message);
        }
      },
    });
  };

  const enableUser = async (user) => {
    const usuario = `${toTitleCase(user.name)} ${toTitleCase(user.lastname)}`;
    showConfirmDialog({
      icon: 'success',
      title: `¿Desea habilitar el usuario ${usuario}?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          await UserServices.Enable(token, user.id);
          await getListOfUsers(pagination.page);
          showToast('success', `Se habilitó usuario ${usuario}`);
        } catch (error) {
          showToast('error', error?.message);
        }
      },
    });
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Listado de Usuarios
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  'Nombre',
                  'Correo',
                  'Teléfono',
                  'Rol',
                  'Tienda',
                  'Estado',
                  '',
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagination.data.map((user, key) => {
                const className = `py-3 px-5 ${
                  key === pagination.data.length - 1
                    ? ''
                    : 'border-b border-blue-gray-50'
                }`;

                return (
                  <tr key={user.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold titlecase"
                        >
                          {toTitleCase(user.name)} {toTitleCase(user.lastname)}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-600"
                      >
                        {user.email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="mb-1 block gap-6 font-medium text-blue-gray-600"
                      >
                        {user.phone}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="mb-1 gap-6 font-medium text-blue-gray-600"
                        as={'div'}
                      >
                        {user.role === Roles.ADMIN ? (
                          <Chip
                            variant="filled"
                            value="Administrador"
                            color="deep-orange"
                            className="justify-center flex"
                          />
                        ) : user.role === Roles.VENDOR ? (
                          <Chip
                            variant="filled"
                            value="Vendedor"
                            color="indigo"
                            className="justify-center flex"
                          />
                        ) : (
                          <Chip
                            variant="filled"
                            value="Comprador"
                            color="teal"
                            className="justify-center flex"
                          />
                        )}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-600 w-10/12"
                      >
                        {user.shop?.name || ''}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="mb-1 block gap-6 font-medium text-blue-gray-600"
                        as={'div'}
                      >
                        {user.status ? (
                          <Chip
                            variant="filled"
                            value="Disponible"
                            color="green"
                            className="justify-center flex"
                          />
                        ) : (
                          <Chip
                            variant="filled"
                            value="Inactivo"
                            color="red"
                            className="justify-center flex"
                          />
                        )}
                      </Typography>
                    </td>
                    <td className={`${className} flex gap-2`}>
                      <IconButton
                        variant="gradient"
                        color="blue"
                        onClick={() => {
                          setEditUser(user);
                        }}
                        disabled={!user.status}
                      >
                        <PencilSquareIcon className="h-5 w-5 text-blue" />
                      </IconButton>
                      {user.status ? (
                        <IconButton
                          variant="gradient"
                          color="red"
                          onClick={() => deleteUser(user)}
                        >
                          <TrashIcon className="h-5 w-5 text-red" />
                        </IconButton>
                      ) : (
                        <IconButton
                          variant="gradient"
                          color="green"
                          onClick={() => enableUser(user)}
                        >
                          <CheckCircleIcon className="h-5 w-5 text-green" />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-2 mx-4">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <BackwardIcon strokeWidth={2} className="h-5 w-5 text-inherit" />
            </button>
            <div>
              <span className="text-sm text-gray-600">
                Página {pagination.page} de {pagination.nroPages}
              </span>
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.nroPages}
            >
              <ForwardIcon strokeWidth={2} className="h-5 w-5 text-inherit" />
            </button>
          </div>
        </CardBody>
      </Card>
      <EditUserDialog
        editUser={editUser}
        setEditUser={setEditUser}
        updateUser={updateUser}
      />
    </div>
  );
}

export default ListUsers;
