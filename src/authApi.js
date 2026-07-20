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

export const getMyPets = () => {
    return api.get("/pets");
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
export const uploadPetImage = (formData) => {
    return api.post("/pets/upload-pet-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const getBanners = () => {
    return api.get("/banners");
};

export const getPetById = (petId) => {
    return api.get(`/pets/${petId}`);
};

export const deletePet = (petId) => {
    return api.delete(`/pets/${petId}`);
};


export const updatePet = (petId, data) => {
    return api.put(`/pets/${petId}`, data);
};

export const addVaccine = (petUid, data) =>
    api.post(`/pets/${petUid}/vaccines`, data);

export const getVaccines = (petUid) => {
    return api.get(`/pets/${petUid}/vaccines`);
};
// export const deleteVaccine = (petUid, vaccineId) =>
//     api.delete(`/pets/${petUid}/vaccines/${vaccineId}`);
export const deleteVaccine = (id) =>
    api.delete(`/vaccines/${id}`);

export const updateVaccine = (id, data) =>
    api.put(`/vaccines/${id}`, data);