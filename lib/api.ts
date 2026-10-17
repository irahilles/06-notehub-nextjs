import axios from "axios";
import type {Note} from '@/types/notes';
import type { InitialValuesProps } from "@/components/NoteForm/NoteForm";

const URL = 'https://notehub-public.goit.study/api/notes';
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

interface FetchNotesProps{
    notes: Note[];
    totalPages: number;
}

export async function fetchNotes(query: string, page = 1, perPage = 12): Promise<FetchNotesProps>{
    const response = await axios.get<FetchNotesProps>(URL, {
        params: {
            search: query,
            page: page,
            perPage: perPage,
        },
        headers: {
            Authorization: `Bearer ${myKey}`,
        }
    })
    return {
        notes: response.data.notes,
        totalPages: response.data.totalPages,
    };
}


export async function createNote(values: InitialValuesProps): Promise<Note> {
    const response = await axios.post<Note>(URL, values, {
        headers: {
            Authorization: `Bearer ${myKey}`,
        },
    })
    return response.data;
}

export async function deleteNote(id: string) {
    const response = await axios.delete<Note>(`${URL}/${id}`, { headers: { Authorization: `Bearer ${myKey}` } })
    return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data;
}