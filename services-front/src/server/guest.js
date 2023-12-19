//
const getAllServices = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/service/`);
  return response.json();
};

//
const getSingleService = async (serviceID) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/service/${serviceID}`);
  return response.json();
};

//
const getAllCategories = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/`);
  return response.json();
};

//
const addJoinRequest = async (data) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join/`, {
    method: 'POST',
    body: data,
  });
  return response.json();
};

//
const searchForServicesOrCompanies = async (search) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/search?search=${search}`);
  return response.json();
};

//
const getCompanyByID = async (companyID) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/company/${companyID}`);
  return response.json();
};

export {
  getAllServices,
  getAllCategories,
  getSingleService,
  addJoinRequest,
  searchForServicesOrCompanies,
  getCompanyByID,
};
