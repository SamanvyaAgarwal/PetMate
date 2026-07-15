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

export const getProfile = () => {
    return api.get("/user/profile");
};

export const completeProfile = (data) => {
    return api.post("/user/complete-profile", data);
};

export const updateProfile = (data) => {
    return api.post("/user/complete-profile", data);
};
export const uploadProfileImage = (formData) => {
    return api.post("/user/upload-profile-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};