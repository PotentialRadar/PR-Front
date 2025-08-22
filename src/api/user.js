// src/api/user.js
import api from "./axios";

export const signUp = (payload) => api.post("/signup", payload);

export const login = ({ email, password }) =>
  api.post("/login", { email, password });

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

export const getTechTags = () => api.get("/search/tags");

export const getTechParts = () => api.get("/tech-parts");
