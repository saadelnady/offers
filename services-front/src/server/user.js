//
const placeOrder = async (data, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

//
const getUserProfileData = async (userID, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${userID}`, {
    method: 'GET',
    headers: {
      token: token,
    },
  });
  return response;
};

//
const updateUserProfile = async (data, token, userID) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${userID}`, {
    method: 'PATCH',
    headers: {
      token: token,
    },
    body: data,
  });
  return response.json();
};

export { placeOrder, getUserProfileData, updateUserProfile };
