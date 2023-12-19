const addCompany = async (data, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
    method: 'POST',
    headers: {
      token: token,
    },
    body: data,
  });
  return response.json();
};

const getJoinRequests = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join`, {
    headers: {
      token: token,
    },
  });
  return response.json();
};

const deleteJoinRequests = async (token, requestId) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join/${requestId}`, {
    method: 'DELETE',
    headers: {
      token: token,
    },
  });
  return response.json();
};
const acceptJoinRequests = async (token, requestId) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join/${requestId}`, {
    method: 'POST',
    headers: {
      token: token,
    },
  });
  return response.json();
};

const getAllUsers = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
    headers: {
      token: token,
    },
  });
  return response.json();
};
const deleteUser = async (token, id) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${id}`, {
    method: 'DELETE',
    headers: {
      token: token,
    },
  });
  return response.json();
};

export { addCompany, getJoinRequests, deleteJoinRequests, acceptJoinRequests, getAllUsers, deleteUser };
