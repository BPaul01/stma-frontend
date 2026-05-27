import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

// Initialize Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REST_API_GATEWAY_INVOKE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Cognito token
apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    // API Gateway Cognito Authorizers usually use the ID Token
    const token = session.tokens?.idToken?.toString();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to fetch auth session:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface CreateTaskPayload {
  userId: string;
  title: string;
  body: string;
  deadlineTime: string;
  deadlineHour: string;
}

export const createTask = async (payload: CreateTaskPayload) => {
  const response = await apiClient.post('/tasks', payload);
  console.log('Full Axios response for createTask:', response);
  return response.data;
};

export const getTasks = async () => {
  const response = await apiClient.get('/tasks');
  console.log('Full Axios response for getTasks:', response);
  return response.data;
};