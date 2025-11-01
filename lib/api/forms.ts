import axios from 'axios';
import { Form, Response, FormAnalytics } from '@/types/forms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Form APIs
export const getAllForms = async () => {
  return api.get<Form[]>('/forms');
};

export const getForm = async (id: number) => {
  return api.get<Form>(`/forms/${id}`);
};

export const createForm = async (form: Partial<Form>) => {
  return api.post<Form>('/forms', form);
};

export const updateForm = async (id: number, form: Partial<Form>) => {
  return api.put<Form>(`/forms/${id}`, form);
};

export const deleteForm = async (id: number) => {
  return api.delete(`/forms/${id}`);
};

export const getFormByLink = async (shareableLink: string) => {
  return api.get<Form>(`/forms/share/${shareableLink}`);
};

// Response APIs
export const submitResponses = async (formId: number, responses: Partial<Response>[]) => {
  return api.post(`/forms/${formId}/responses`, responses);
};

export const getResponses = async (formId: number) => {
  return api.get<Response[]>(`/forms/${formId}/responses`);
};

export const getFormAnalytics = async (formId: number) => {
  return api.get<FormAnalytics>(`/forms/${formId}/analytics`);
};

export default api;