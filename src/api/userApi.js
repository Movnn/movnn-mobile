import api from './apiConfig';

 const userApi = {
  getUserDash: () => api.get('/user/user-dash'),
  getUserOrders: userUuid => api.get(`/user/user-orders/${userUuid}`),
  addQuickSend: data => api.post('/user/quick-send', data),
  modifyQuickSend: (id, data) => api.patch(`/user/quick-send/${id}`, data),
  getQuickSend: id => api.get(`/user/quick-send/${id}`),
  createWallet: id => api.post(`/create-wallet/${id}`),
  cancelRequest: orderUuid => api.post(`/cancel/request/${orderUuid}`),
  payOrder: (orderUuid, data) => api.post(`/pay/order/${orderUuid}`, data),
  creditAccount: (userUuid, amount) =>
    api.post(`/user-dash/credit-account/${userUuid}/${amount}`),
  rateDriver: (orderUuid, rate) =>
    api.get(`/user-dash/rate/${orderUuid}/${rate}`),
 };

 export  default userApi;


