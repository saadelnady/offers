import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addJoinRequest } from '../server/guest';
import { toast } from 'react-toastify';
import { Spinner } from '../components';

const JoinRequest = () => {
  const [loading, setLoading] = useState(false);
  // class names
  const inputClasses =
    ' text-md text-purple-500 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-purple-500 dark:focus:shadow-outline-gray form-input bg-gray-100 mt-2';

  // formik Configuration
  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      image: '',
      phone_number: '',
      username: '',
      social_links: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
      },
    },
    validationSchema: Yup.object({
      full_name: Yup.string()
        .required('مطلوب')
        .max(24, 'يجب الا يزيد الاسم عن 24 حرفا')
        .min(3, 'يجب الا بقل الاسم عن 3 احرف على الاقل'),
      email: Yup.string().email('البريد الالكتروني يجب أن يكون صحيح ').required('مطلوب'),
      phone_number: Yup.string()
        .required('مطلوب')
        .matches(/^(?:(\+2015|\+2011|\+2012|\+2010|011|012|010|015)[0-9]{8})$/, 'برجاء ادخال رقم مصرى مكون من 11رقم'),
      username: Yup.string()
        .required('مطلوب')
        .max(24, 'يجب الا يزيد الاسم عن 24 حرفا')
        .min(3, 'يجب الا بقل الاسم عن 3 احرف على الاقل')
        .matches(/^[a-zA-Z0-9_-]{3,16}$/, 'يجب ان يكون اسم المستخدم باللغه الانجليزية والارقام  و - _ '),

      social_links: Yup.object().shape({
        facebook: Yup.string().url('رابط فيسبوك يجب أن يكون رابط صحيح'),
        twitter: Yup.string().url('رابط تويتر يجب أن يكون رابط صحيح'),
        instagram: Yup.string().url('رابط انستجرام يجب أن يكون رابط صحيح'),
        youtube: Yup.string().url('رابط يوتيوب يجب أن يكون رابط صحيح'),
      }),

      image: Yup.mixed()
        .required('برجاء رفع الصورة')
        .test('fileType', 'الملف غير صالح. يجب أن يكون صورة', (file) => {
          if (file) {
            // Allow any image MIME type
            console.log(file);
            return ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'].includes(file[0].type);
          }
          return true; // No file selected, so no type to check
        }),
    }),
    onSubmit: (values) => {
      setLoading(true);
      console.log('values: ', values);
      const formData = new FormData();
      formData.append('full_name', values.full_name);
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('phone_number', values.phone_number);

      // formData.append('image', values.image);
      // Append social_links to the FormData
      Object.keys(values.social_links).forEach((key) => {
        formData.append(`social_links.${key}`, values.social_links[key]);
      });

      const imageFiles = values.image;
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('image', imageFiles[i]);
      }

      console.log('formData: ', formData);

      addJoinRequest(formData)
        .then((res) => {
          console.log(res);
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
          if (res.status === 'Error') {
            toast.error(res.message, {
              position: toast.POSITION.TOP_LEFT,
            });
          }
          if (res.data) {
            toast.success('تم ارسال طلبك بنجاح', {
              position: toast.POSITION.TOP_LEFT,
            });
            formik.resetForm();
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setLoading(false);
        });
    },
  });

  // render
  return (
    <form onSubmit={formik.handleSubmit} className="w-[95%] md:w-[90%] mx-auto  py-10">
      <div className="companyDetails flex flex-col md:flex-row py-1 ">
        <h4 className="mb-4 md:w-[30%]  text-md	 font-semibold text-gray-600 dark:text-gray-300">تفاصيل عن الشركة</h4>
        <div className="form md:w-2/3 flex flex-col  px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800  dark:text-gray-300">
          {/* full_name */}
          <label htmlFor="name" className="text-md">
            اسم الشركة
          </label>
          <input {...formik.getFieldProps('full_name')} id="name" type="text" className={inputClasses} />
          {formik.touched.full_name && formik.errors.full_name ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.full_name}</div>
          ) : null}
          {/* username */}
          <label htmlFor="name" className="text-md mt-5">
            اسم المستخدم
          </label>
          <input {...formik.getFieldProps('username')} id="username" type="text" className={inputClasses} />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.username}</div>
          ) : null}

          {/* Email */}
          <label htmlFor="email" className="text-md mt-5">
            بريد الكتروني
          </label>
          <input {...formik.getFieldProps('email')} id="email" type="email" className={inputClasses} />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.email}</div>
          ) : null}

          {/* image */}
          <div className="logo flex items-center	mt-3 ">
            <label htmlFor="image" className="text-md font-bold">
              شعار
            </label>
            <label htmlFor="image" className="flex gap-2 items-center  ">
              <label
                htmlFor="image"
                className=" py-2  font-medium leading-5  transition-colors     border border-transparent rounded-md   focus:outline-none   px-4 mr-6 cursor-pointer placeholder: ease-in duration-300
                 placeholder:ease-in  hover:text-purple-600 hover:border-purple-400 focus:border-purple-400 focus:shadow-outline-purple text-gray-300 dark:text-gray-300hover:border-purple-600  bg-purple-600 hover:bg-transparent border-purple-600
          text-md"
              >
                رفع صوره
              </label>
              <input
                onChange={(event) => {
                  formik.setFieldValue('image', event.currentTarget.files);
                }}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="hidden"
              />

              <div>
                {formik.values?.image?.[0] && (
                  <img
                    src={URL.createObjectURL(formik.values?.image?.[0])}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
              </div>
            </label>
            {formik.touched.image && formik.errors.image ? (
              <div className="text-red-700 text-md mb-5">{formik.errors.image}</div>
            ) : null}
          </div>
          {/* Phone Number */}
          <label htmlFor="phone_number" className="mt-5 text-md">
            رقم الهاتف
          </label>
          <input {...formik.getFieldProps('phone_number')} id="phone_number" type="text" className={inputClasses} />
          {formik.touched.phone_number && formik.errors.phone_number ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.phone_number}</div>
          ) : null}
        </div>
      </div>

      {/*  */}
      {/* Social Media */}
      {/*  */}
      <div className="companyLinks flex flex-col md:flex-row py-2 ">
        <h4 className="mb-4 md:w-[30%]  text-md	 font-semibold text-gray-600 dark:text-gray-300"> سوشيال ميديا</h4>
        <div className="form md:w-2/3 w-full flex flex-col  px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800  dark:text-gray-300">
          {/* Facebook */}
          <label htmlFor="companyName" className="text-md">
            رابط فيسبوك
          </label>
          <input
            name="social_links.facebook"
            {...formik.getFieldProps('social_links.facebook')}
            id="companyName"
            type="text"
            className={inputClasses}
          />
          {formik.touched.social_links?.facebook && formik.errors.social_links?.facebook ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.social_links?.facebook}</div>
          ) : null}
          {/* Youtube */}
          <label htmlFor="youtube" className="text-md mt-5">
            رابط يوتيوب
          </label>
          <input
            name="social_links.youtube"
            {...formik.getFieldProps('social_links.youtube')}
            id="youtube"
            type="text"
            className={inputClasses}
          />
          {formik.touched.social_links?.youtube && formik.errors.social_links?.youtube ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.social_links?.youtube}</div>
          ) : null}

          {/* Twitter */}
          <label htmlFor="twitter" className="text-md mt-5">
            رابط تويتر
          </label>
          <input
            name="social_links.twitter"
            {...formik.getFieldProps('social_links.twitter')}
            id="twitter"
            type="text"
            className={inputClasses}
          />
          {formik.touched.social_links?.twitter && formik.errors.social_links?.twitter ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.social_links?.twitter}</div>
          ) : null}

          {/* Instagram */}
          <label htmlFor="instagram" className="text-md mt-5">
            رابط انستجرام
          </label>
          <input
            name="social_links.instagram"
            {...formik.getFieldProps('social_links.instagram')}
            id="instagram"
            type="text"
            className={inputClasses}
          />
          {formik.touched.social_links?.instagram && formik.errors.social_links?.instagram ? (
            <div className="text-red-700 text-md mb-5">{formik.errors.social_links?.instagram}</div>
          ) : null}
        </div>
      </div>
      {/*  */}
      {/* Submit */}
      {/*  */}
      <button
        type="submit"
        // disabled={ }
        className="block  px-5 py-2 ease-in  cursor-pointer placeholder:ease-in  hover:text-purple-600 hover:border-purple-400 focus:border-purple-400 focus:shadow-outline-purple text-gray-300 dark:text-gray-300hover:border-purple-600  bg-purple-600 hover:bg-transparent border-purple-600
        text-md  mr-auto	me-10  "
      >
        {loading ? <Spinner /> : 'إرسال الطلب'}
      </button>
    </form>
  );
};

export default JoinRequest;
