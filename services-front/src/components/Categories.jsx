import { useEffect, useState } from 'react';
import { getAllCategories } from '../server/guest';

const Categories = ({ handleFilter }) => {
  const [categories, setCategories] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      setCategories(response.data.categories)
      setSearchResult(response.data.categories)

    }
    fetchCategories()
  }, []);

  const [check, setCheck] = useState('all');
  useEffect(() => {
    handleFilter(check);
  }, [check]);


  const handleChange = (query) => {
    setSearchResult(categories.filter(category => category.name.includes(query)))
  }


  return (
    <div className="sticky w-[90%] mx-auto  px-2 md:w-[25%]  shadow-xs  text-gray-600 dark:text-gray-400  ">
      <h1 className="md:rounded-full border border-indigo-600 md:rounded-r-none px-12 py-1 text-2xl font-medium text-indigo-600 text-center hidden lg:block">
        الفئات
      </h1>

      <ul className=" rounded-lg  shadow-xs dark:bg-gray-900 text-center font-bold w-full py-8  ">
        <li
          key={'all'}
          onClick={() => setCheck('all')}
          className={`w-full flex justify-between items-center p-1 mb-3 cursor-pointer transition-all ease-in duration-50 dark:hover:bg-cool-gray-900 hover:bg-cool-gray-300  hover:rounded-lg hover:shadow-md ${check === 'all'
            ? 'text-green-400 dark:bg-cool-gray-900 bg-cool-gray-100 rounded-lg shadow-md  '
            : 'text-gray-500'
            }`}
        >
          <span className="w-4/5 cursor-pointer">الكل</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 transition duration-300 ease-in-out stroke-none ${check === 'all' ? 'fill-green-400 ' : 'fill-gray-500'
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm-5.049 10.386 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
              fillRule="nonzero"
            />
          </svg>
        </li>
        <input
          className="w-full my-5 pr-8 pl-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border border-gray-500 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
          type="text"
          placeholder=" ابحث عن فئة"
          onKeyUp={(e) => {
            handleChange(e.target.value)
          }}
        />
        {searchResult &&
          searchResult.map((category, index) => {
            return index < 2 ? (

              <li
                key={category._id}
                onClick={() => setCheck(category._id)}
                className={`w-full flex justify-between items-center mb-3 cursor-pointer p-1 transition-all ease-in duration-50 dark:hover:bg-cool-gray-900 hover:bg-cool-gray-300 hover:rounded-lg hover:shadow-md ${check === category._id
                  ? 'text-green-400 dark:bg-cool-gray-900 bg-cool-gray-100 rounded-lg shadow-md '
                  : 'fill-gray-500'
                  }`}
              >
                <span className="w-4/5 cursor-pointer">{category.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-8 transition duration-300 ease-in-out stroke-none ${check === category._id ? 'fill-green-400 ' : 'fill-gray-500'
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm-5.049 10.386 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
                    fillRule="nonzero"
                  />
                </svg>
              </li>
            ) : '';
          })}
      </ul>
    </div>
  );
};

export default Categories;
