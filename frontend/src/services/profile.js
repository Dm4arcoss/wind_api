import api from './api';

export default {
  getProfile() {
    return api.get('/profile');
  }
};
