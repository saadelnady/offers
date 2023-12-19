import React, { useEffect, useState } from 'react';
import { Services } from '../components';
import { getAllServices } from '../server/guest';

const AllServices = () => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const response = await getAllServices();
      const data = response.data;
      setServices(data?.services);
    };
    getData();
  }, []);

  return <Services servicesProp={services} withCategory />;
};

export default AllServices;
