import { useState, useRef, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { AuthContext } from '../contexts';
import {
  addCategory,
  addNewExtraProps,
  addNewService,
  editService,
  getCategory,
  getImage,
  getService,
} from '../server/company';
import { Spinner } from '../components';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BehaviorButton = ({ classes, svg, color, onClick, disabled, type, ...props }) => (
  <button
    className={`py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-${color}-600 border border-transparent rounded-md active:bg-${color}-600 hover:bg-${color}-700 focus:outline-none focus:shadow-outline-${color} px-4 cursor-pointer ${classes}`}
    onClick={onClick}
    disabled={disabled}
    type={type}
    {...props}
  >
    {svg}
  </button>
);

const AddService = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [descArray, setDescArray] = useState(['']);
  const [descPlusArray, setDescPlusArray] = useState([{ price: '', description: '' }]);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const token = user ? user.token : null;
  const companyId = user ? user.user.id : null;
  const [selectedImages, setSelectedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [formInfo, setFormInfo] = useState(false);
  const [renderdImgs, setRenderdImgs] = useState([]);

  let { id } = useParams();
  const navigateToSerivces = useNavigate();

  const toggleCategory = () => {
    setShowInput(!showInput);
    formik.setFieldValue('category', '');
  };

  useEffect(() => {
    getCategory()
      .then((data) => {
        const categoriesArray = data.data.categories;
        setCategories(categoriesArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    if (id) {
      getService(id)
        .then((data) => {
          let newFormInfo = data.data.service;
          setFormInfo(newFormInfo);
          const old_extra = newFormInfo.extra_props.map((prop) => ({
            price: prop.price,
            description: prop.description,
          }));

          console.log('old', old_extra);
          newFormInfo.extra_props.length && setDescPlusArray(old_extra);
          newFormInfo.props.length && setDescArray(newFormInfo.props);
          console.log(newFormInfo);
          formik.setValues({
            title: newFormInfo.title || '',
            description: newFormInfo.description || '',
            price: newFormInfo.price || '',
            category: newFormInfo.category._id || '',
            descPlusArray: old_extra,
            descArray: newFormInfo.props,
          });

          newFormInfo.images.map(async (image) => {
            console.log(renderdImgs);
            console.log(image);
            if (!renderdImgs.includes(image)) {
              const res = await getImage(`service/${image}`);
              setSelectedImages((prev) => [...prev, res]);
              setRenderdImgs((prev) => [...prev, image]);
              renderdImgs.push(image);
              console.log('inside');
              console.log(renderdImgs);
            }
          });
          console.log(selectedImages);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setDescPlusArray([{ price: '', description: '' }]);
      setDescArray(['']);
      setSelectedImages([]);

      formik.setValues({
        title: '',
        description: '',
        descArray: [''],
        descPlusArray: [{ price: '', description: '' }],
        price: '',
        images: [],
        category: '',
      });
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      descArray: descArray,
      descPlusArray: descPlusArray,
      price: '',
      images: selectedImages,
      category: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      console.log({ values });
      values.extra_props =
        typeof values.descPlusArray !== 'string'
          ? values.descPlusArray.map((item) => ({
              price: Number(item.price),
              description: item.description,
            }))
          : [];
      values.props = values.descArray.map((item) => item);
      values.images = selectedImages;
      console.log({ values });
      handleSubmit(values);
      setMessage(`success`);

      formik.resetForm();

      setMessage(null);
    },
    validationSchema: Yup.object({
      title: Yup.string().required('مطلوب'),
      // desc: Yup.string().required('مطلوب'),
      price: Yup.string().required('مطلوب'),
      description: Yup.string().required('مطلوب'),
      // picture: Yup.mixed().required('رجاء رفع صور'),

      category: Yup.string().required('مطلوب'),
    }),
  });

  const handleAddDescArray = () => {
    setDescArray([...descArray, []]);
  };

  const handleRemoveDescArray = (index) => {
    const updatedDescArray = [...descArray];
    updatedDescArray.splice(index, 1);

    setDescArray(updatedDescArray);
    formik.setFieldValue(`descArray`, updatedDescArray);
  };

  const handleAddDescriptionPlus = () => {
    setDescPlusArray([...descPlusArray, { price: '', description: '' }]);
  };

  const handleRemoveDescriptionPlus = (index) => {
    const updatedDescPlusArray = [...descPlusArray];
    updatedDescPlusArray.splice(index, 1);
    setDescPlusArray(updatedDescPlusArray);
    formik.setFieldValue(`descPlusArray`, updatedDescPlusArray);
  };

  const handleFileChange = (event) => {
    const files = event.currentTarget.files;
    setSelectedImages([...selectedImages, ...Array.from(files)]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };
  const handleSubmit = async (values) => {
    try {
      let extraPropsResponse;
      if (
        values.extra_props.length > 0 &&
        values.extra_props[0].price != 0 &&
        values.extra_props[0].description != ''
      ) {
        console.log('values.extra_props: ', values.extra_props);
        extraPropsResponse = await addNewExtraProps(values.extra_props, token);
      }

      const extraProps = extraPropsResponse?.data?.extraProps.map((item) => item._id);

      let categoryId;
      if (showInput) {
        const allCategories = await addCategory({ name: values.category }, token);
        categoryId = allCategories.data.category._id;
      } else {
        categoryId = values.category;
      }

      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price);
      // extraPropsResponse && formData.append('extra_props', extraProps);
      formData.append('category', categoryId);
      formData.append('company', companyId);
      // formData.append('images', blob);
      const imageFiles = values.images;
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }
      const props = values.descArray;
      for (let i = 0; i < props.length; i++) {
        formData.append('props[]', props[i]);
      }

      const extra_props = values.descPlusArray;
      console.log('values.extra_props: ', extra_props);
      if (values.extra_props.length && values.extra_props[0].price != 0 && values.extra_props[0].description != '') {
        console.log('values.extra_props: ', values.extra_props);
        for (let i = 0; i < extra_props.length; i++) {
          formData.append('extra_props[]', extraProps[i]);
        }
      }

      console.log(formData);
      const serviceResponse = id ? await editService(formData, token, id) : await addNewService(formData, token);
      console.log(serviceResponse);
      setLoading(false);
      setMessage('success');
      setTimeout(() => {
        formik.resetForm();
        setMessage(null);
        navigateToSerivces('/dashboard/services');
      }, 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage('Error: Something went wrong');
      toast.error('حدث خطأ يرجي المحاوله مره اخري ربما يكون اسم فئه مكرر', {
        position: toast.POSITION.TOP_LEFT,
      });
      navigateToSerivces('/dashboard/services');
    }
  };

  if (loading)
    return (
      <div className="h-[50vh] w-full flex justify-center items-center ">
        <Spinner />
      </div>
    );

  return (
    <section id="AddService">
      {/* {message && (
        <div className={`message ${message.includes('Error') ? 'afterMessage error' : 'afterMessage success'}`}>
          {message}
        </div>
      )} */}

      <div className=" mt-5 ">
        <div className="max-w-xl ">
          <h1 className="text-4xl mb-4  dark:text-gray-400">{id ? 'تعديل الخدمه' : 'اضافة خدمه جديده'}</h1>
          <form ref={formRef} onSubmit={formik.handleSubmit} className="w-full">
            {/* title */}
            <div>
              <input
                id="title"
                name="title"
                placeholder=" عنوان الخدمه"
                disabled={loading}
                {...formik.getFieldProps('title')}
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2 "
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.title}</div>
              ) : (
                ''
              )}
            </div>

            {/* category */}
            <div className="flex  gap-3 my-2">
              {id ? (
                formInfo && (
                  <Select
                    onChange={(selectedOption) => formik.setFieldValue('category', selectedOption?.value)}
                    className={`w-3/5 ${showInput ? 'hidden' : ''}  placeholder:dark:text-white`}
                    classNamePrefix="
                                
               "
                    classNames={'dark:placeholder:text-red-500'}
                    placeholder="اختار تصنيف"
                    defaultValue={{ value: formInfo?.category?._id, label: formInfo?.category?.name }}
                    isDisabled={loading || showInput}
                    isLoading={false}
                    isClearable
                    isRtl
                    isSearchable
                    id="category"
                    name="category"
                    options={
                      categories && categories.map((category) => ({ value: category._id, label: category.name }))
                    }
                  />
                )
              ) : (
                <Select
                  onChange={(selectedOption) => formik.setFieldValue('category', selectedOption?.value)}
                  className={`w-3/5 ${showInput ? 'hidden' : ''}  placeholder:dark:text-white`}
                  classNamePrefix="
                              
             "
                  classNames={'dark:placeholder:text-red-500'}
                  placeholder="اختار تصنيف"
                  isDisabled={loading || showInput}
                  isLoading={false}
                  isClearable
                  isRtl
                  isSearchable
                  id="category"
                  name="category"
                  options={categories && categories.map((category) => ({ value: category._id, label: category.name }))}
                />
              )}

              {showInput && (
                <input
                  type="text"
                  placeholder="اضافه تصنيف"
                  className="block w-full  text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2 "
                  disabled={loading}
                  {...formik.getFieldProps('category')}
                />
              )}

              <BehaviorButton
                color={showInput ? 'red' : 'purple'}
                type="button"
                onClick={toggleCategory}
                svg={showInput ? 'x' : 'تصنيف جديد'}
              />
            </div>
            {formik.touched.category && formik.errors.category ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.category}</div>
            ) : (
              <div></div>
            )}
            {/* props */}
            {descArray.map((desc, index) => {
              return (
                <div className="flex gap-2 my-2" key={`descArray-${index}`}>
                  <input
                    id={`descArray-${index}`}
                    name={`descArray[${index}]`}
                    placeholder=" وصف الخاصية"
                    disabled={loading}
                    {...formik.getFieldProps(`descArray[${index}]`)}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2 "
                  />

                  {index === 0 ? (
                    <BehaviorButton
                      color={'purple'}
                      onClick={handleAddDescArray}
                      disabled={loading}
                      type="button"
                      svg={'+'}
                    />
                  ) : (
                    <>
                      <BehaviorButton
                        color={'purple'}
                        onClick={handleAddDescArray}
                        disabled={loading}
                        type="button"
                        svg={'+'}
                      />
                      <BehaviorButton
                        color={'red'}
                        onClick={() => handleRemoveDescArray(index)}
                        disabled={loading}
                        type="button"
                        svg={'x'}
                      />
                    </>
                  )}
                </div>
              );
            })}

            {/* extra_props */}
            {descPlusArray.map((item, index) => (
              <div className="flex items-center justify-start gap-2" key={`descPlus-${index}`}>
                <div className="flex flex-col">
                  <input
                    id={`descPlus-${index}.description`}
                    name={`descPlusArray[${index}].description`}
                    placeholder=" وصف خاصيه اضافية"
                    disabled={loading}
                    {...formik.getFieldProps(`descPlusArray[${index}].description`)}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2"
                  />
                  {formik.touched[`descPlusArray[${index}].description`] &&
                  formik.errors[`descPlusArray[${index}].description`] ? (
                    <div className="h-6 text-xs text-red-600 dark:text-red-400">
                      {formik.errors[`descPlusArray[${index}].description`]}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="flex flex-col w-1/3">
                  <input
                    id={`descPlus-${index}.price`}
                    name={`descPlusArray[${index}].price`}
                    placeholder=" سعرها "
                    type="number"
                    disabled={loading}
                    {...formik.getFieldProps(`descPlusArray[${index}].price`)}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2"
                  />
                </div>
                {index === 0 ? (
                  <BehaviorButton
                    color={'purple'}
                    onClick={handleAddDescriptionPlus}
                    disabled={loading}
                    type="button"
                    svg={'+'}
                  />
                ) : (
                  <>
                    <BehaviorButton
                      color={'purple'}
                      onClick={handleAddDescriptionPlus}
                      disabled={loading}
                      type="button"
                      svg={'+'}
                    />

                    <BehaviorButton
                      color={'red'}
                      onClick={() => handleRemoveDescriptionPlus(index)}
                      disabled={loading}
                      type="button"
                      svg={'x'}
                    />
                  </>
                )}
              </div>
            ))}

            {/* image upload */}

            <div className="my-2 flex gap-2">
              <label htmlFor="picture" className="flex gap-2 items-center">
                <label
                  htmlFor="picture"
                  className="py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple px-4 cursor-pointer"
                >
                  صور الخدمه
                </label>
                <input
                  type="file"
                  id="picture"
                  name="images"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                {formik.touched.picture && formik.errors.picture ? (
                  <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.picture}</div>
                ) : (
                  ''
                )}
              </label>

              <div className="flex gap-2">
                {selectedImages.map((image, index) => (
                  <div className="flex flex-col gap-1">
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index}`}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className=" text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-md active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red px-4 cursor-pointer  h-2/6"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* description */}
            <div>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="وصف الخدمه"
                disabled={loading}
                {...formik.getFieldProps('description')}
                className="block w-full  text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2"
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.description}</div>
              ) : (
                ''
              )}
            </div>

            <div>
              <input
                id={`price`}
                name={`price`}
                type="number"
                placeholder=" سعر الخدمه"
                disabled={loading}
                {...formik.getFieldProps(`price`)}
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input border-gray-300 border-2"
              />
            </div>

            {formik.touched.price && formik.errors.price ? (
              <div className="h-6 text-xs text-red-600 dark:text-red-400">{formik.errors.price}</div>
            ) : (
              <div></div>
            )}

            {/* submit */}
            <BehaviorButton
              color={'purple'}
              disabled={loading}
              svg={loading ? <Spinner /> : id ? 'تعديل' : 'اضافه'}
              type="submit"
              id="submitBtn"
              classes="w-full mt-5 "
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddService;
