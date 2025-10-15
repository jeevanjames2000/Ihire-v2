export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    // window.localStorage.setItem('token', token);
  }
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // return window.localStorage.getItem('token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    // window.localStorage.removeItem('token');
  }
};