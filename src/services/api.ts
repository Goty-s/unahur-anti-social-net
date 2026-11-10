import type { User, Post, Tag, PostComment, PostImage } from "../types/index";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers:{
      "Content-Type": "application/json",
      ...options?.headers,
    }
  })

  const data = await response.json().catch(()=> null);
  if(!response.ok) throw new Error(data?.message ?? `Error de la API: (${response.status})`);
  return data as T;
}

export const getUsers = () =>request<User[]>("/users");
export const getTags = () =>request<Tag[]>("/tags");
export const getPosts = () =>request<Post[]>("/posts");
export const getPostComments = (postId: number) =>request<PostComment[]>(`/comments/post/${postId}`);
export const getPostImages = (postId: number) =>request<PostImage[]>(`/postimages/post/${postId}`);