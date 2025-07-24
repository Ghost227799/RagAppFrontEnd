/**
 * API utilities for interacting with RAG backend endpoints.
 */

import { API_BASE_URL } from "./baseUrl";

/**
 * API utilities for interacting with RAG backend endpoints.
 */

function getAuthHeader() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadPdf(file: File): Promise<Response> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/rag/upload-pdf`, {
    method: "POST",
    body: formData,
    headers: {
      ...getAuthHeader(),
    } as HeadersInit,
  });

  return response;
}

export async function searchRag(query: string): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/rag/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    } as HeadersInit,
    body: JSON.stringify({ query }),
  });

  return response;
}
