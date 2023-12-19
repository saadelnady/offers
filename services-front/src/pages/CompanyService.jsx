import React, { useContext, useEffect, useState } from 'react';
import defaultImage from '../assets/service.png';
import { AuthContext } from '../contexts/Auth';
import { deleteService, getServices } from '../server/company';
import { Link } from 'react-router-dom';
import { Spinner } from '../components';
import { toast } from 'react-toastify';

const CompanyService = () => {
  const [data, setData] = useState(null);
  const [deleteServiceState, setDeleteServiceState] = useState(false);
  const { user } = useContext(AuthContext);

  const services = data?.data?.services;

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
    getServices(user.user.id).then((response) => {
      setData(response);
    });
  }, [deleteServiceState]);

  const handleDelete = async (serviceId) => {
    const response = await deleteService(user.token, serviceId);
    if (response.status === 204) {
      toast.success('تم حذف الخدمة بنجاح', {
        position: toast.POSITION.TOP_CENTER,
      });
      setDeleteServiceState((prev) => !prev);
    }
  };

  if (!services)
    return (
      <div className="w-full min-h-[80vh] overflow-x-auto flex justify-center items-center  pt-5">
        <Spinner />
      </div>
    );

  if (services?.length === 0)
    return (
      <div className="w-full min-h-[80vh] text-3xl overflow-x-auto flex justify-center items-center  pt-5">
        لا توجد بيانات
      </div>
    );

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs mt-5">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-right text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th className="px-4 py-3">الخدمة</th>
              <th className="px-4 py-3">السعر</th>
              {/* <th className="px-4 py-3">الوصف</th> */}
              <th className="px-4 py-3 hidden sm:block"> اخر تعديل</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {services &&
              services.map((service) => {
                return (
                  <tr key={service._id} className="text-gray-700 dark:text-gray-400">
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        {/* <!-- Avatar with inset shadow --> */}
                        <div className="relative hidden w-12 h-12 ml-3  md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src={
                              service.images[0]
                                ? `${import.meta.env.VITE_API_BASE_URL}/uploads/service/${service.images[0]}`
                                : defaultImage
                            }
                            alt=""
                            loading="lazy"
                          />
                          <div className="absolute inset-0 shadow-inner"></div>
                        </div>
                        <div>
                          <p className="font-semibold">{service.title}</p>
                          {/* <p className="text-xs text-gray-600 dark:text-gray-400">10x Developer</p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{service.price} جنيه </td>
                    <td className="px-4 py-3 text-sm hidden sm:block">
                      {new Intl.DateTimeFormat('ar-EG', options).format(new Date(service.updatedAt))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col lg:flex-row items-center lg:space-x-4 text-sm gap-2">
                        <Link
                          to={`/dashboard/service/${service._id}`}
                          className="py-1 px-2 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                        >
                          عرض
                        </Link>
                        <Link
                          to={`/dashboard/service/edit/${service._id}`}
                          className="py-1 px-2 flex justify-center items-center  bg-yellow-400 hover:bg-yellow-600 focus:ring-yellow-500 focus:ring-offset-yellow-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="py-1 px-2 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                        >
                          مسح
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyService;
