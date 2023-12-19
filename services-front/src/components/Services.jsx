import React, { useEffect, useState } from 'react';

import Categories from './Categories';

import { getAllServices } from '../server/guest';
import ServiceCard from './ServiceCard';
import { Spinner } from '.';
import { useLocation } from 'react-router-dom';

const Services = ({ servicesProp, withCategory = false }) => {
  const { pathname } = useLocation();
  const [myArray, setMyArray] = useState([]);
  const [services, setServices] = useState(null);

  useEffect(() => {
    setMyArray(servicesProp);
    setServices(servicesProp);
  }, [pathname, servicesProp]);

  const handleFilter = (categoryID) => {
    if (categoryID === 'all') return setServices(myArray);
    const filteredArray = myArray?.filter((service) => {
      return service?.category?._id === categoryID;
    });
    setServices(filteredArray);
  };

  if (!services)
    return (
      <div className=" h-screen w-screen flex justify-center items-center ">
        <Spinner />
      </div>
    );

  return (
    <>
      {/* services */}
      <div className=" w-[95%] mx-auto flex flex-col md:flex-row justify-start items-start  gap-10 py-5 bg-gray-50	dark:bg-gray-900">
        {withCategory && <Categories handleFilter={handleFilter} />}

        <div className="w-full grid  lg:grid-cols-3 sm:grid-cols-2 gap-2  text-gray-600 dark:text-gray-400">
          {services && services.map((service) => <ServiceCard key={service._id} service={service} />)}
        </div>
      </div>
    </>
  );
};

export default Services;
