import api from "./axios";

export const addPet = (data) => {
    return api.post("/pets", data);
};

export const getPets = () => {
    return api.get("/pets");
};

export const getPetById = (petUID) => {
    return api.get(`/pets/${petUID}`);
};

export const updatePet = (petUID, data) => {
    return api.put(`/pets/${petUID}`, data);
};

export const deletePet = (petUID) => {
    return api.delete(`/pets/${petUID}`);
};