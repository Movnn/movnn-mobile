import api from "./apiConfig";

const orderApi = {

  calculatePreOrder: (data) =>
    api.post("/calculate-pre-order", {
      p_lat: data.pickupLocation.latitude.toString(),
      p_lon: data.pickupLocation.longitude.toString(),
      d_lat: data.deliveryLocation.latitude.toString(),
      d_lon: data.deliveryLocation.longitude.toString(),
      engine: data.vehicleType || "bike",
    }),


  createOrder: (data) =>
    api.post("/create-order", {
      user_id: data.userId,
      user_type: "user",
      p_lat: data.pickupLocation.latitude.toString(),
      p_lon: data.pickupLocation.longitude.toString(),
      d_lat: data.deliveryLocation.latitude.toString(),
      d_lon: data.deliveryLocation.longitude.toString(),
      engine: data.vehicleType || "bike",
      message: data.notes || "",
      promotion_code: "movnnabj", 
    }),

};

export default orderApi;
