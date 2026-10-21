import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export async function fetchProducts(params = {}) {
  const { data } = await axios.get(`${API}/products`, { params });
  return data;
}

export async function fetchProduct(slug) {
  const { data } = await axios.get(`${API}/products/${slug}`);
  return data;
}

export async function fetchProjects(params = {}) {
  const { data } = await axios.get(`${API}/projects`, { params });
  return data;
}

export async function fetchProject(slug) {
  const { data } = await axios.get(`${API}/projects/${slug}`);
  return data;
}

export async function sendEnquiry(payload) {
  const { data } = await axios.post(`${API}/enquiries`, payload);
  return data;
}

export async function sendChat(payload) {
  const { data } = await axios.post(`${API}/chat`, payload);
  return data;
}
