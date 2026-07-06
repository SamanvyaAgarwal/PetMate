import api from "./axios";

export const sendSignupOTP = (data) => {
    return api.post("/auth/send-email-otp", data);
};

export const verifySignupOTP = (data) => {
    return api.post("/auth/verify-email-otp", data);
};

export const sendLoginOTP = (data) => {
    return api.post("/auth/send-login-otp", data);
};

export const verifyLoginOTP = (data) => {
    return api.post("/auth/verify-login-otp", data);
};