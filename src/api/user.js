// src/api/user.js
import axios from 'axios';

const BASE_URL = '/api/users';

export const sendVerificationCode = email =>
  axios.post(`${BASE_URL}/send-code`, { email });

export const verifyEmailCode = (email, code) =>
  axios.post(`${BASE_URL}/verify-code`, { email, code });

export const checkNickname = nickname =>
  axios.get(`${BASE_URL}/check-nickname`, { params: { nickname } });

export const signUp = payload => axios.post(`/api/signup`, payload);
