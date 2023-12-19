import React, { useEffect, useState } from 'react';
import Services from '../components/Services';
import { useLocation, useParams } from 'react-router-dom';
import { getServices } from '../server/company';
import { CompanyFooter, Hero, Spinner } from '../components';
import { getCompanyByID } from '../server/guest';

const CompanyDetails = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [services, setServices] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const response = await getServices(id);
      const data = response.data;
      setServices(data?.services);

      const companyResponse = await getCompanyByID(id);
      setCompany(companyResponse?.data.company);
    };
    getData();
  }, [pathname]);

  if (!company)
    return (
      <div className="h-screen w-screen flex justify-center items-center ">
        <Spinner />
      </div>
    );

  return (
    <div>
      <div className="">
        <Hero company={company} />
      </div>
      <div className="mx-auto w-[fit-content] my-5 text-5xl font-black leading-none text-purple-800 uppercase font-bebas-neue  dark:text-white">
        الخدمات
      </div>
      <div className="max-w-6xl mx-auto ">
        <Services servicesProp={services} />
      </div>

      <CompanyFooter company={company} />
    </div>
  );
};

export default CompanyDetails;
