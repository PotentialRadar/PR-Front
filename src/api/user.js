// src/api/user.js
import axios from './axios';

const BASE_URL = '/users';
const AUTH_BASE_URL = '';

export const sendVerificationCode = email =>
  axios.post(`${BASE_URL}/send-code`, { email });

export const verifyEmailCode = (email, code) =>
  axios.post(`${BASE_URL}/verify-code`, { email, code });

export const checkNickname = nickname =>
  axios.get(`${BASE_URL}/check-nickname`, { params: { nickname } });

export const signUp = payload => axios.post(`${AUTH_BASE_URL}/signup`, payload);

export const getFavoriteProjects = userId =>
  axios.get(`${BASE_URL}/${userId}/likes/projects`);

export const removeFavoriteProject = (userId, projectId) =>
  axios.delete(`${BASE_URL}/${userId}/likes/projects/${projectId}`);
