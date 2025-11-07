import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE || '/';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Post {
  id: number;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  isPublished: boolean;
  excerpt?: string;
}

export interface Category {
  slug: string;
  name: string;
  postCount?: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  subjectTpl?: string;
  bodyTpl?: string;
}

export interface SearchResult {
  html: string;
  results?: Post[];
}

export interface AboutContent {
  title: string;
  content: string;
}

// API Functions
export async function getPosts(): Promise<Post[]> {
  try {
    const { data } = await api.get('/api/posts');
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    const { data } = await api.get(`/api/posts/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function searchPosts(query: string): Promise<SearchResult> {
  try {
    const { data } = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
    return data;
  } catch (error) {
    console.error('Error searching:', error);
    return { html: '', results: [] };
  }
}

export async function getAbout(): Promise<AboutContent | null> {
  try {
    const { data } = await api.get('/api/about');
    return data;
  } catch (error) {
    console.error('Error fetching about:', error);
    return null;
  }
}

export async function sendContact(payload: ContactPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const { data } = await api.post('/api/contact', payload);
    return { success: true, ...data };
  } catch (error: any) {
    console.error('Error sending contact:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to send message' };
  }
}

export async function getArchive(month?: string, year?: string): Promise<Post[]> {
  try {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const { data } = await api.get(`/api/archive?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Error fetching archive:', error);
    return [];
  }
}

export async function getByCategory(slug: string): Promise<Post[]> {
  try {
    const { data } = await api.get(`/api/categories/${slug}`);
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return [];
  }
}

export async function getAdminMessages(): Promise<Message[]> {
  try {
    const { data } = await api.get('/api/admin/messages');
    return Array.isArray(data) ? data : (data?.messages || []);
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    return [];
  }
}

export async function deleteComment(id: string): Promise<{ success: boolean }> {
  try {
    await api.delete(`/api/admin/comments/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false };
  }
}

export async function getFileView(path: string): Promise<string> {
  try {
    const { data } = await api.get(`/api/files/view?path=${encodeURIComponent(path)}`);
    return data;
  } catch (error) {
    console.error('Error viewing file:', error);
    return '';
  }
}

export async function renderTheme(theme: string): Promise<string> {
  try {
    const { data } = await api.post('/api/themes/render', { theme });
    return data;
  } catch (error) {
    console.error('Error rendering theme:', error);
    return '';
  }
}

export async function preview(content: string): Promise<string> {
  try {
    const { data } = await api.post('/api/preview', { content });
    return data;
  } catch (error) {
    console.error('Error previewing:', error);
    return '';
  }
}

export async function validateWebhook(url: string): Promise<any> {
  try {
    const { data } = await api.post('/api/webhook/validate', { url });
    return data;
  } catch (error) {
    console.error('Error validating webhook:', error);
    return null;
  }
}

export async function getDebug(): Promise<any> {
  try {
    const { data } = await api.get('/api/debug');
    return data;
  } catch (error) {
    console.error('Error fetching debug:', error);
    return null;
  }
}

export async function getComponentsStatus(): Promise<any> {
  try {
    const { data } = await api.get('/api/components-status');
    return data;
  } catch (error) {
    console.error('Error fetching components status:', error);
    return null;
  }
}

export default api;

