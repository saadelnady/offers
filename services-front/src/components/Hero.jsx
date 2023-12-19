import React from 'react';

const Hero = ({ company }) => {
  return (
    <div className="relative  flex items-center overflow-hidden bg-white dark:bg-gray-800">
      <div className="container relative flex px-6 py-16 mx-auto  gap-10 ">
        <div className="relative hidden sm:block sm:w-1/3 lg:w-2/5 rounded-md shadow-xl py-5 ">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/user/${company?.image?.[0]} `}
            className="max-w-xs m-auto md:max-w-sm h-56 object-contain  "
          />
        </div>
        <div className="relative  flex flex-col sm:w-2/3 lg:w-3/5">
          <span className="w-20 h-2 mb-5 bg-purple-500 dark:bg-purple-600"></span>
          <h1 className="flex flex-col mb-12 text-2xl font-black leading-none text-gray-800 uppercase font-bebas-neue  dark:text-white">
            {company?.full_name}
          </h1>
          <p className="text-sm text-gray-700 sm:text-base dark:text-white">
            تُعد شركتنا الرائدة في مجال تقديم خدمات متميزة تلبي احتياجات عملائنا بشكل فعّال وموثوق. نحن نسعى دائمًا
            لتقديم أفضل الحلول والخدمات لعملائنا، حيث تمثل رضاهم هدفنا الأسمى. تمتلك الشركة فريقًا من المحترفين
            المتخصصين في مجموعة متنوعة من القطاعات والصناعات، مما يجعلنا قادرين على تلبية احتياجات عملائنا بكفاءة عالية
            وفعالية. نقدم مجموعة واسعة من الخدمات{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
