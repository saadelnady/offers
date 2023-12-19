import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import React, { useContext, useState } from 'react';
import { addCompany } from '../server/admin';
import { AuthContext } from '../contexts';
import { Spinner } from '../components';

const AddNewCompany = () => {
  const [loading, setLoading] = useState(false);

  // current user (should be an admin)
  const { user } = useContext(AuthContext);

  // formik Configuration
  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      password: '',
      phone_number: '',
      username: '',
    },
    validationSchema: Yup.object({
      full_name: Yup.string().min(3, 'الاسم يجب ان يحتوي علي 3 احرف او اكثر').required('مطلوب'),
      email: Yup.string().email('البريد الالكتروني يجب أن يكون صحيح ').required('مطلوب'),
      password: Yup.string().required('مطلوب'),
      phone_number: Yup.string().required('مطلوب'),
      username: Yup.string()
        .required('مطلوب')
        .max(24, 'يجب الا يزيد الاسم عن 24 حرفا')
        .min(3, 'يجب الا بقل الاسم عن 3 احرف على الاقل')
        .matches(/^[a-zA-Z_-]+$/, 'يجب ان يكون اسم المستخدم باللغه الانجليزية فقط'),
    }),
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('full_name', values.full_name);
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('phone_number', values.phone_number);

      addCompany(formData, user.token)
        .then((res) => {
          if (res.errors) {
            res.errors.forEach((error) =>
              toast.error(error.msg, {
                position: toast.POSITION.TOP_LEFT,
              })
            );
          }
          if (res.status === 'failed') {
            toast.error(res.message, {
              position: toast.POSITION.TOP_LEFT,
            });
          }
          if (res.data) {
            toast.success('تم اضافة الشركة بنجاح', {
              position: toast.POSITION.TOP_LEFT,
            });

            formik.resetForm();
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setLoading(false);
        });
    },
  });

  const inputClasses =
    ' text-md text-purple-500 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-purple-500 dark:focus:shadow-outline-gray form-input bg-gray-100 mt-2';

  return (
    <form autoComplete={'Off'} onSubmit={formik.handleSubmit} className="mt-10">
      <div className="form w-full p-8 flex flex-wrap flex-col md:flex-row gap-x-5  py-8  bg-white rounded-lg  dark:bg-gray-800  dark:text-gray-300">
        {/* full_name */}
        <div className="w-full md:w-2/5 mb-5 flex flex-col">
          <label htmlFor="name" className="text-md">
            اسم الشركة
          </label>
          <input {...formik.getFieldProps('full_name')} id="name" type="text" className={inputClasses} />
          {formik.touched.full_name && formik.errors.full_name ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.full_name}</div>
          ) : null}
        </div>
        {/* username */}
        <div className="w-full md:w-2/5 mb-5 flex flex-col">
          <label htmlFor="name" className="text-md ">
            اسم المستخدم
          </label>
          <input {...formik.getFieldProps('username')} id="username" type="text" className={inputClasses} />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.username}</div>
          ) : null}
        </div>

        {/* Email */}
        <div className="w-full md:w-2/5 mb-5 flex flex-col">
          <label htmlFor="email" className="text-md ">
            بريد الكتروني
          </label>
          <input {...formik.getFieldProps('email')} id="email" type="email" className={inputClasses} />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.email}</div>
          ) : null}
        </div>

        {/* Password */}
        <div className="w-full md:w-2/5 mb-5 flex flex-col">
          <label htmlFor="password" className="text-md ">
            الرقم السري
          </label>
          <input
            {...formik.getFieldProps('password')}
            id="password"
            autoComplete="new-password"
            type="password"
            className={inputClasses}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.password}</div>
          ) : null}
        </div>

        {/* Phone Number */}
        <div className="w-full md:w-2/5 mb-5 flex flex-col">
          <label htmlFor="phone_number" className=" text-md">
            رقم الهاتف
          </label>
          <input {...formik.getFieldProps('phone_number')} id="phone_number" type="text" className={inputClasses} />
          {formik.touched.phone_number && formik.errors.phone_number ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.phone_number}</div>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="w-80 py-2 px-5 my-4 font-medium leading-5 transition-colors border border-transparent rounded-md focus:outline-none   cursor-pointer placeholder:ease-in duration-300 hover:text-purple-600 focus:border-purple-400 focus:shadow-outline-purple text-gray-300 dark:text-gray-300hover:border-purple-600  bg-purple-600 hover:bg-transparent border-purple-600 text-xl"
      >
        {loading ? <Spinner /> : ' إضافة شركة'}
      </button>
    </form>
  );
};

export default AddNewCompany;
