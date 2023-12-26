import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:3000',
});

client.interceptors.request.use((value) => {
  return value;
});

client.interceptors.response.use(
  (value) => {
    try {
      if (value.status == 403)
        if (!window?.location?.href.includes('/auth/login'))
          window.location.href = '/auth/login'

    } catch (error) { }

    return value;
  },
  error => {
    try {
      if (error.response.status == 403)
        if (!window?.location?.href.includes('/auth/login'))
          window.location.href = '/auth/login'

    } catch (error) { }

    return error;
  }
);