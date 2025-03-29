import api from "./apiConfig";

const warehouseApi = {
  getItems: () => api.get("/warehouse/items"),
  sendItem: (data) => api.post("/warehouse/send-item", data),
  getLocations: () => api.get("/warehouse/locations"),
};
export default warehouseApi;
