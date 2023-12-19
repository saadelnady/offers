import { useState, useRef, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/Auth';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const Register = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { login } = useContext(AuthContext);

  const registerUser = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setMessage('Error: ' + response.status);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      setMessage(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      full_name: '',
      username: '',
      email: '',
      phone_number: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      registerUser(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, values)
        .then((res) => {
          if (res.errors) {
            setMessage('Error');
            res.errors.forEach((error) =>
              toast.error(error.msg, {
                position: toast.POSITION.TOP_LEFT,
              })
            );
          }
          if (res.status === 'failed') {
            setMessage('Error');
            toast.error(res.message, {
              position: toast.POSITION.TOP_LEFT,
            });
          }
          if (res.data) {
            login(res.data);
            setMessage(`success`);
            toast.success('تم انشاء الحساب', {
              position: toast.POSITION.TOP_LEFT,
            });
            setMessage(`success`);
            toast.success('تم تسجيل الدخول بنجاح', {
              position: toast.POSITION.TOP_LEFT,
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          setMessage(JSON.stringify(err));
          toast.error(err.msg, {
            position: toast.POSITION.TOP_LEFT,
          });
        });
    },
    validationSchema: Yup.object({
      full_name: Yup.string()
        .required('مطلوب')
        .max(24, 'يجب الا يزيد الاسم عن 24 حرفا')
        .min(3, 'يجب الا بقل الاسم عن 3 احرف على الاقل'),
      username: Yup.string()
        .required('مطلوب')
        .max(24, 'يجب الا يزيد الاسم عن 24 حرفا')
        .min(3, 'يجب الا بقل الاسم عن 3 احرف على الاقل')
        .matches(/^[a-zA-Z0-9_-]{3,16}$/, 'يجب ان يكون اسم المستخدم باللغه الانجليزية والارقام  و - _ '),
      password: Yup.string().required('مطلوب'),
      email: Yup.string().email('عنوان بريد إلكتروني غير صالح').required('مطلوب'),
      phone_number: Yup.string()
        .required('مطلوب')
        .matches(/^(?:(\+2015|\+2011|\+2012|\+2010|011|012|010|015)[0-9]{8})$/, 'برجاء ادخال رقم مصرى مكون من 11رقم'),
    }),
  });

  return (
    <section id="Register">
      <div className="flex justify-center items-center min-h-[92vh]">
        <div className="w-5/6 md:w-2/3 lg:w-2/5">
          <h1 className="text-4xl mb-4 inline-flex items-center text-gray-600 dark:text-gray-400">التسجيل</h1>
          <form ref={formRef} onSubmit={formik.handleSubmit} className="w-full">
            <input
              id="full_name"
              name="full_name"
              placeholder="الاسم بالكامل"
              disabled={loading}
              {...formik.getFieldProps('full_name')}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input  border-gray-300 border-2 "
            />
            {formik.touched.full_name && formik.errors.full_name ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.full_name}</div>
            ) : (
              <div className="h-6 text-xs text-red-600 dark:text-red-400"></div>
            )}
            <input
              id="username"
              name="username"
              placeholder="اسم المستخدم"
              disabled={loading}
              {...formik.getFieldProps('username')}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input  border-gray-300 border-2 "
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.username}</div>
            ) : (
              <div className="h-6 text-xs text-red-600 dark:text-red-400"></div>
            )}
            <input
              id="email"
              name="email"
              type="email"
              placeholder="البريد الإلكتروني"
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input  border-gray-300 border-2 "
              disabled={loading}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.email}</div>
            ) : (
              <div className="h-6 text-xs text-red-600 dark:text-red-400"></div>
            )}

            <input
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="رقم الهاتف"
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input  border-gray-300 border-2 "
              disabled={loading}
              {...formik.getFieldProps('phone_number')}
            />
            {formik.touched.phone_number && formik.errors.phone_number ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.phone_number}</div>
            ) : (
              <div className="h-6 text-xs text-red-600 dark:text-red-400"></div>
            )}
            <input
              id="password"
              name="password"
              type="password"
              placeholder="كلمه المرور"
              disabled={loading}
              {...formik.getFieldProps('password')}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input  border-gray-300 border-2"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.password}</div>
            ) : (
              <div className="h-6 text-xs text-red-600 dark:text-red-400"></div>
            )}

            <button
              type="submit"
              id="submitBtn"
              className="w-full px-4 py-2 text-md font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
