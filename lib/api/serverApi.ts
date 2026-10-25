import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import { api } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface SessionResponse {
  success: boolean;
}

async function getCookieHeader(cookieHeader?: string): Promise<string> {
  if (cookieHeader !== undefined) return cookieHeader;

  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: { Cookie: await getCookieHeader() },
  });
  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: await getCookieHeader() },
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/users/me', {
    headers: { Cookie: await getCookieHeader() },
  });
  return response.data;
}

export async function checkSession(
  cookieHeader?: string,
): Promise<AxiosResponse<SessionResponse>> {
  return api.get<SessionResponse>('/auth/session', {
    headers: { Cookie: await getCookieHeader(cookieHeader) },
  });
}
