import { useContext, useEffect, useState } from 'react';
import { deleteUser, getAllUsers } from '../server/admin';
import { AuthContext } from '../contexts';
import { toast } from 'react-toastify';
import { Spinner } from '../components';

const Companies = () => {
  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Africa/Cairo',
  };
  useEffect(() => {
    // Use an async function to fetch and set users

    const fetchAllUsers = async () => {
      try {
        const users = await getAllUsers(user.token);
        const filteredUsers = users.data.users.filter((user) => user.role === 'Company');
        console.log(filteredUsers);
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllUsers();
  }, [deleted]);


  const handleDeletion = (id) => {
    deleteUser(user.token, id).then(res => {

      toast.success('تم حذف الشركة بنجاح', {
        position: toast.POSITION.TOP_CENTER,
      });

    }).catch(err => {
      console.log(err)
    })
    setDeleted(prev => !prev)
  }

  if (!allUsers)
    return (
      <div className="w-full min-h-[80vh] overflow-x-auto flex justify-center items-center  pt-5">
        <Spinner />
      </div>
    );

  if (allUsers?.length === 0)
    return (
      <div className="w-full min-h-[80vh] text-3xl overflow-x-auto flex justify-center items-center  pt-5">
        لا توجد بيانات
      </div>
    );


  return (
    <div className="w-full overflow-x-auto  pt-5">
      <table className="w-full whitespace-no-wrap">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-right text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            <th className="px-4 py-3"> الشركة </th>
            <th className="px-4 py-3"> البريد الاكترونى </th>
            <th className="px-4 py-3 hidden lg:block">تاريخ الانضمام</th>
            <th className="px-4 py-3">الحالة</th>
          </tr>
        </thead>

        <tbody className="bg-white dark:divide-gray-700 dark:bg-gray-800">
          {allUsers &&
            allUsers.map((user) => {
              return (
                <tr key={user._id} className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden w-12 h-12 ml-3  md:block">
                        <img className="object-cover w-full h-full rounded-full" src={`${import.meta.env.VITE_API_BASE_URL}/uploads/user/${user.image}`} loading="lazy" />

                        <div className="absolute inset-0 shadow-inner"></div>
                      </div>
                      <div>
                        <p className="font-semibold">{user.full_name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-lg"> {user.email} </td>

                  <td className="px-4 py-3 text-sm hidden lg:block">
                    {new Intl.DateTimeFormat('ar-EG', options).format(new Date(user.createdAt))}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <button
                        onClick={() => handleDeletion(user._id)}
                        className="py-1 px-2 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Companies;
