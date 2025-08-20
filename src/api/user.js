// src/api/user.js
import api from "./axios";

export const signUp = (payload) => api.post("/signup", payload);

export const login = ({ email, password }) =>
  api.post("/login", { email, password });
const BASE_URL = '/users';
const AUTH_BASE_URL = '';

export const logout = () => api.post("/logout");

export const getUserProfile = () => api.get("/user/profile");

export const updateUserProfile = (profileData) =>
  api.put("/user/profile", profileData);

export const deleteUser = () => api.delete("/user");

export const sendVerificationCode = (email) =>
  api.post("/user/send-code", { email });

export const verifyEmailCode = (email, code) =>
  api.post("/user/verify-code", { email, code });

export const checkNickname = (nickname) =>
  api.get("/user/check-nickname", { params: { nickname } });

export const getFavoriteProjects = userId =>
  api.get(`${BASE_URL}/${userId}/likes/projects`); // Changed axios to api

export const removeFavoriteProject = (userId, projectId) =>
  api.delete(`${BASE_URL}/${userId}/likes/projects/${projectId}`); // Changed axios to api

// NEW: Project-related APIs for a user
export const getProjectsCreatedByUser = (userId) =>
  api.get(`${BASE_URL}/${userId}/created`);

export const getAppliedProjectsByUser = (userId) =>
  api.get(`${BASE_URL}/${userId}/applied`);
