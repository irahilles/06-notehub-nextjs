"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";

export default function Notes() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () => fetchNotes(query, page),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button}>Create note +</button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}