// src/api/user.js
import axios from 'axios';

const BASE_URL = '/api/users';
const AUTH_BASE_URL = '/api';

export const sendVerificationCode = email =>
  axios.post(`${BASE_URL}/send-code`, { email });

export const verifyEmailCode = (email, code) =>
  axios.post(`${BASE_URL}/verify-code`, { email, code });

export const checkNickname = nickname =>
  axios.get(`${BASE_URL}/check-nickname`, { params: { nickname } });

export const signUp = payload => axios.post(`${AUTH_BASE_URL}/signup`, payload);
