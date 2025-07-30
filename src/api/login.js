import axios from 'axios';

export const loginByEmail = async ({ email, password }) => {
  return await axios.post('/api/login', { email, password });
};
