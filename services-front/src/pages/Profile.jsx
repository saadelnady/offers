import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts';
import { useEffect } from 'react';
import { getUserProfileData, updateUserProfile } from '../server/user';
import { Spinner } from '../components';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

const Profile = ({ isCompany = false }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [success, setSuccess] = useState(false);

  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const getProfile = async () => {
      const response = user && (await getUserProfileData(user?.user?.id, user?.token));

      if (response.status === 401) return logout();

      const res = await response.json();
      setProfileData(res?.data?.user);
      console.log('res?.data?.user: ', res?.data?.user);

      profileForm.setFieldValue('full_name', res?.data?.user.full_name);
      profileForm.setFieldValue('email', res?.data?.user.email);
      profileForm.setFieldValue('phone_number', res?.data?.user.phone_number);
      profileForm.setFieldValue('username', res?.data?.user.username);
      profileForm.setFieldValue('social_links.facebook', res?.data?.user.social_links?.facebook);
      profileForm.setFieldValue('social_links.twitter', res?.data?.user.social_links?.twitter);
      profileForm.setFieldValue('social_links.instagram', res?.data?.user.social_links?.instagram);
      profileForm.setFieldValue('social_links.youtube', res?.data?.user.social_links?.youtube);
    };
    getProfile();
  }, [user, success]);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Africa/Cairo',
  };

  const inputClasses =
    ' block w-full  placeholder: text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input bg-gray-100 my-5 ';

  const profileForm = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      image: '',
      phone_number: '',
      username: '',
      password: null,
      social_links: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
      },
    },
    validationSchema: Yup.object({
      full_name: Yup.string()
        .min(3, 'الاسم يجب ان يحتوي علي 3 احرف او اكثر')
        .max(24, 'يجب الا يزيد الاسم عن 24حرف')
        .optional(),
      email: Yup.string().email('البريد الالكتروني يجب أن يكون صحيح ').optional(),
      phone_number: Yup.string()
        .optional()
        .matches(/^(?:(\+2015|\+2011|\+2012|\+2010|011|012|010|015)[0-9]{8})$/, 'برجاء ادخال رقم مصرى مكون من 11رقم'),

      username: Yup.string()
        .required('مطلوب')
        .max(24, 'يجب الا يزيد الاسم عن 24 حرفا')
        .min(3, 'يجب الا بقل الاسم عن 3 احرف')
        .matches(/^[a-zA-Z0-9_-]{3,16}$/, 'يجب ان يكون اسم المستخدم باللغه الانجليزية والارقام  و - _ '),
      image: Yup.mixed()
        .optional()
        .test('fileType', 'الملف غير صالح. يجب أن يكون صورة', (file) => {
          if (file) {
            // Allow any image MIME type
            return ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'].includes(file[0].type);
          }
          return true; // No file selected, so no type to check
        }),

      social_links: Yup.object().shape({
        facebook: Yup.string().url('رابط فيسبوك يجب أن يكون رابط صحيح'),
        twitter: Yup.string().url('رابط تويتر يجب أن يكون رابط صحيح'),
        instagram: Yup.string().url('رابط انستجرام يجب أن يكون رابط صحيح'),
        youtube: Yup.string().url('رابط يوتيوب يجب أن يكون رابط صحيح'),
      }),
    }),
    onSubmit: (values) => {
      console.log('values: ', values);
      setLoading(true);
      const formData = new FormData();
      values.full_name && formData.append('full_name', values.full_name);
      values.username && formData.append('username', values.username);
      values.email && formData.append('email', values.email);
      formData.append('phone_number', values.phone_number);
      // formData.append('image', values.image);
      // Append social_links to the FormData
      Object.keys(values.social_links).forEach((key) => {
        formData.append(`social_links.${key}`, values.social_links[key]);
      });

      const imageFiles = values.image;

      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          imageFiles[i] && imageFiles[i] && formData.append('image', imageFiles[i]);
        }
      }

      updateUserProfile(formData, user?.token, user?.user?.id)
        .then((res) => {
          console.log('res: ', res);
          if (res.errors) {
            res.errors.forEach((error) =>
              toast.error(error.msg, {
                position: toast.POSITION.TOP_LEFT,
              })
            );
          } else if (res.status === 'failed') {
            toast.error(res.message, {
              position: toast.POSITION.TOP_LEFT,
            });
          } else if (res.status === 'Error') {
            toast.error(res.message, {
              position: toast.POSITION.TOP_LEFT,
            });
          } else if (res.data) {
            toast.success('تم تغير البيانات بنجاح', {
              position: toast.POSITION.TOP_LEFT,
            });
            setSuccess(!success);
          } else {
            toast.success('تم تغير البيانات بنجاح', {
              position: toast.POSITION.TOP_LEFT,
            });
            setSuccess(!success);
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

  if (!profileData)
    return (
      <div className="h-[90vh] w-full flex justify-center items-center ">
        <Spinner />
      </div>
    );

  return (
    <form
      autoComplete="off"
      onSubmit={profileForm.handleSubmit}
      className="profile flex flex-col lg:flex-row gap-3 justify-evenly p-5 bg-gray-100 min-h-[92vh] dark:bg-gray-900 "
    >
      <div className="info p-2 py-5 text-center w-full  lg:w-1/5  bg-white   dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded mb-sm-2 ">
        <h3 className="userName mb-5  font-bold text-2xl"> {profileData.full_name} </h3>
        <p className="mb-4 text-sm">{profileData.username}@</p>
        <div className="text-center mb-10 ">
          <img
            src={
              (profileForm.values?.image && URL.createObjectURL(profileForm.values?.image?.[0])) ||
              `${import.meta.env.VITE_API_BASE_URL}/uploads/user/${profileData.image?.[0]}`
            }
            alt=""
            className="w-56 h-56 md:w-20 md:h-20  mx-auto rounded-full"
          />
        </div>

        {/* image */}
        <div className="logo flex items-center	mt-3 justify-center ">
          <label htmlFor="image">
            <label
              htmlFor="image"
              className=" py-2  font-medium leading-5  transition-colors border border-transparent rounded-md   focus:outline-none w-full  px-2  placeholder: ease-in duration-300
              cursor-pointer placeholder:ease-in  hover:text-purple-600 hover:border-purple-400 focus:border-purple-400 focus:shadow-outline-purple text-gray-300 dark:text-gray-300hover:border-purple-600  bg-purple-600 hover:bg-transparent border-purple-600
          text-md"
            >
              {isCompany ? 'ارفع شعار' : '   ارفع صورة'}{' '}
            </label>
            <input
              onChange={(event) => {
                profileForm.setFieldValue('image', event.currentTarget.files);
              }}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="hidden"
            />
          </label>
          {profileForm.touched.image && profileForm.errors.image ? (
            <div className="text-red-700 text-md mb-5">{profileForm.errors.image}</div>
          ) : null}
        </div>

        <p className="flex flex-col">
          <span className="mt-5 font-bold text-xs ">{isCompany ? 'شركة منذ' : 'مستخدم منذ '}</span>
          {profileData.createdAt && new Intl.DateTimeFormat('ar-EG', options).format(new Date(profileData.createdAt))}
        </p>
      </div>
      {/* section - 2 */}
      <div className="edit-info info px-10 py-3 w-full   lg:w-4/5  bg-white   dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
        <h1 className=" font-bold text-lg">{isCompany ? ' تعديل بيانات الشركة' : '    تعديل الملف الشخصي'}</h1>
        <div className="form w-full flex flex-wrap flex-col lg:flex-row justify-between  py-8 mb-8 bg-white rounded-lg  dark:bg-gray-800  dark:text-gray-300">
          <div className="w-full lg:w-2/5">
            <label htmlFor="fullName" className="text-md">
              {isCompany ? ' اسم الشركة' : 'الاسم بالكامل'}
            </label>
            <input {...profileForm.getFieldProps('full_name')} id="name" type="text" className={inputClasses} />
            {profileForm.touched.full_name && profileForm.errors.full_name ? (
              <div className="text-red-700 text-md mb-5">{profileForm.errors.full_name}</div>
            ) : null}
          </div>
          <div className="w-full lg:w-2/5">
            <label htmlFor="userName" className="text-md">
              اسم المستخدم
            </label>
            <input {...profileForm.getFieldProps('username')} id="username" type="text" className={inputClasses} />
            {profileForm.touched.username && profileForm.errors.username ? (
              <div className="text-red-700 text-md mb-5">{profileForm.errors.username}</div>
            ) : null}
          </div>
          {/* <div className="w-full lg:w-2/5">
            <label htmlFor="password" className="text-md">
              الرقم السري
            </label>
            <input id="password" type="password" className={inputClasses} />
          </div> */}
          <div className="w-full lg:w-2/5">
            <label htmlFor="email" className="text-md">
              البريد الالكترونى
            </label>
            <input {...profileForm.getFieldProps('email')} id="email" type="email" className={inputClasses} />
            {profileForm.touched.email && profileForm.errors.email ? (
              <div className="text-red-700 text-md mb-5">{profileForm.errors.email}</div>
            ) : null}
          </div>
          <div className="w-full lg:w-2/5">
            <label htmlFor="phone" className="text-md">
              رقم الهاتف
            </label>
            <input
              {...profileForm.getFieldProps('phone_number')}
              id="phone_number"
              type="text"
              className={inputClasses}
            />
            {profileForm.touched.phone_number && profileForm.errors.phone_number ? (
              <div className="text-red-700 text-md mb-5">{profileForm.errors.phone_number}</div>
            ) : null}
          </div>
        </div>
        {isCompany ? (
          <div className="companyLinks flex flex-col   ">
            <h4 className="mb-8 md:w-[30%] text-md font-semibold text-gray-600 dark:text-gray-300">سوشيال ميديا</h4>
            <div className="form w-full flex flex-col md:flex-row   justify-between flex-wrap  bg-white rounded-lg  dark:bg-gray-800 dark:text-gray-300">
              {/* Facebook */}
              <div className="w-full lg:w-2/5 mb-5">
                <label htmlFor="facebook" className="text-md">
                  رابط فيسبوك
                </label>
                <input
                  name="social_links.facebook"
                  {...profileForm.getFieldProps('social_links.facebook')}
                  id="companyName"
                  type="text"
                  className={inputClasses}
                />
                {profileForm.touched.social_links?.facebook && profileForm.errors.social_links?.facebook ? (
                  <div className="text-red-700 text-md mb-5">{profileForm.errors.social_links?.facebook}</div>
                ) : null}
              </div>
              <div className="w-full lg:w-2/5 mb-5">
                {' '}
                {/* Youtube */}
                <label htmlFor="youtube" className="text-md mt-5">
                  رابط يوتيوب
                </label>
                <input
                  name="social_links.youtube"
                  {...profileForm.getFieldProps('social_links.youtube')}
                  id="youtube"
                  type="text"
                  className={inputClasses}
                />
                {profileForm.touched.social_links?.youtube && profileForm.errors.social_links?.youtube ? (
                  <div className="text-red-700 text-md mb-5">{profileForm.errors.social_links?.youtube}</div>
                ) : null}
              </div>
              <div className="w-full lg:w-2/5 mb-5">
                {' '}
                {/* Twitter */}
                <label htmlFor="twitter" className="text-md mt-5">
                  رابط تويتر
                </label>
                <input
                  name="social_links.twitter"
                  {...profileForm.getFieldProps('social_links.twitter')}
                  id="twitter"
                  type="text"
                  className={inputClasses}
                />
                {profileForm.touched.social_links?.twitter && profileForm.errors.social_links?.twitter ? (
                  <div className="text-red-700 text-md mb-5">{profileForm.errors.social_links?.twitter}</div>
                ) : null}
              </div>
              <div className="w-full lg:w-2/5 mb-5">
                {/* Instagram */}
                <label htmlFor="instagram" className="text-md mt-5">
                  رابط انستجرام
                </label>
                <input
                  name="social_links.instagram"
                  {...profileForm.getFieldProps('social_links.instagram')}
                  id="instagram"
                  type="text"
                  className={inputClasses}
                />
                {profileForm.touched.social_links?.instagram && profileForm.errors.social_links?.instagram ? (
                  <div className="text-red-700 text-md mb-5">{profileForm.errors.social_links?.instagram}</div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        <button
          type="submit"
          className="py-2 mb-4 font-medium leading-5 transition-colors border border-transparent rounded-md focus:outline-none px-4  cursor-pointer placeholder:ease-in duration-300 hover:text-purple-600 hover:border-purple-400 focus:border-purple-400 focus:shadow-outline-purple text-gray-300 dark:text-gray-300hover:border-purple-600  bg-purple-600 hover:bg-transparent border-purple-600 text-md"
        >
          {loading ? <Spinner /> : ' تحديث البيانات'}
        </button>
      </div>
    </form>
  );
};

export default Profile;
