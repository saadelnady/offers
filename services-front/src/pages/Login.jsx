import { useState, useRef, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/Auth';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const Login = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { login } = useContext(AuthContext);

  const logInUser = async (url, data) => {
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
      console.error('An error occurred:', error);
      setMessage(JSON.stringify(error));
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      logInUser(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, values)
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
      email: Yup.string().required('مطلوب'),
      password: Yup.string().required('مطلوب'),
    }),
  });

  return (
    <section id="Login">
      {/* {message && (
        <div className={`message ${message.includes('Error') ? 'bg-red-500' : 'bg-green-600'}`}>{message}</div>
      )} */}

      <div className="flex justify-center items-center min-h-[92vh] ">
        <div className="w-5/6 md:w-2/3 lg:w-2/5">
          <h1 className="text-4xl mb-4 inline-flex items-center text-gray-600 dark:text-gray-400">تسجيل الدخول</h1>
          <form ref={formRef} onSubmit={formik.handleSubmit} className="w-full">
            <input
              id="email"
              name="email"
              placeholder="البريد الإلكتروني"
              disabled={loading}
              {...formik.getFieldProps('email')}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input  border-gray-300 border-2"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.email}</div>
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
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2 "
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

export default Login;
