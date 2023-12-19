import React, { useContext, useEffect, useState } from 'react';
import { UserCircleIcon, PhoneIcon, MailIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/solid';
import { getOrder } from '../server/company';
import { useParams } from 'react-router';
import { AuthContext } from '../contexts';
import { Spinner } from '../components';

const CompanyOrder = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrder(id, user.token);
      setOrder(response);
    };

    fetchOrder();
  }, [id]);

  if (!order)
    return (
      <div className="w-full min-h-[80vh] overflow-x-auto flex justify-center items-center  pt-5">
        <Spinner />
      </div>
    );

  if (order?.length === 0)
    return (
      <div className="w-full min-h-[80vh] text-3xl overflow-x-auto flex justify-center items-center  pt-5">
        لا توجد بيانات
      </div>
    );

  // if(order.service)

  return (
    <div className="container mx-auto mt-8 p-8 bg-gray-50 text-black dark:bg-gray-800 dark:text-white rounded-md shadow-lg">
      {/* Customer Information */}
      <section className="mb-8">
        <h2 className="text-3xl text-purple-500 font-bold mb-4"> العميل</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-start items-center gap-5">
            <UserCircleIcon className="h-5 w-5 hidden lg:inline-block text-purple-500 dark:text-white mr-2" />
            <p className="dark:text-white "> {order.user.full_name}</p>
          </div>
          <div className="flex justify-start items-center gap-5">
            <PhoneIcon className="h-5 w-5 hidden lg:inline-block text-purple-500 dark:text-white mr-2" />
            <p className="dark:text-white ">{order.user.phone_number || 'لا يوجد'}</p>
          </div>
          <div className="flex justify-start items-center gap-5">
            <MailIcon className="h-5 w-5 hidden lg:inline-block text-purple-500 dark:text-white mr-2" />
            <p className="dark:text-white ">{order.user.email}</p>
          </div>
        </div>
      </section>

      {/* Product Information */}
      <h2 className="text-3xl text-purple-500 font-bold mb-4"> الخدمة</h2>
      {order.service ? <section className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-start items-center gap-5">
            <TagIcon className="h-5 w-5 hidden lg:inline-block text-purple-500 dark:text-white mr-2" />
            <p className="dark:text-white ">{order.service?.title}</p>
          </div>
          <div className="flex justify-start items-center gap-5">
            <CurrencyDollarIcon className="h-5 w-5 hidden lg:inline-block text-purple-500 dark:text-white mr-2" />
            <p className="dark:text-white ">{order.service?.price} جنيه</p>
          </div>
        </div>
      </section> : <div className='my-3'> تم حذف الخدمة  تأكد من حذف هذا الطلب</div>}

      {/* Extra Options */}
      <section className="mb-8">
        <h2 className="text-3xl text-purple-500 font-bold mb-4">خيارات إضافية</h2>

        {order.extra_props &&
          order.extra_props.map((prop) => (
            <div key={prop._id} className="grid grid-cols-2 gap-4 my-3">
              <div className="flex justify-start items-center gap-5">
                <TagIcon className="h-5 w-5 hidden lg:inline-block text-purple-500 dark:text-white mr-2" />
                <p className="dark:text-white ">{prop.description} </p>
              </div>
              <div className="flex justify-start items-center gap-5">
                <CurrencyDollarIcon className="h-5 w-5 hidden lg:inline-block mr-2 text-purple-500 dark:text-white" />
                <p className="dark:text-white ">{prop.price} جنيه</p>
              </div>
            </div>
          ))}
        {/* Add more options as needed */}
      </section>

      {/* Final Price */}
      <section>
        <h2 className="text-3xl text-purple-500 font-bold mb-4">السعر النهائي</h2>
        <p className="dark:text-white  font-semibold">
          <span className="flex justify-start items-center gap-5">
            <CurrencyDollarIcon className="h-5 w-5 hidden lg:inline-block mr-2 text-purple-500 dark:text-white" />
            {order.total_price} جنيه
          </span>
        </p>
      </section>
    </div>
  );
};

export default CompanyOrder;
