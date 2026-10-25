'use client';

import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

const NOTE_TAGS: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const createMutation = useMutation({
    mutationFn: createNote,
  });

  const handleSubmit = async (formData: FormData): Promise<void> => {
    const title = formData.get('title');
    const content = formData.get('content');
    const tag = formData.get('tag');

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof tag !== 'string' ||
      !NOTE_TAGS.includes(tag as NoteTag)
    ) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        tag: tag as NoteTag,
      });
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    } catch {
      // The request error is displayed above the form fields.
    }
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDraft({ title: event.target.value });
  };

  const handleContentChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setDraft({ content: event.target.value });
  };

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setDraft({ tag: event.target.value as NoteTag });
  };

  return (
    <form action={handleSubmit} className={css.form}>
      {createMutation.isError && (
        <p className={css.error}>Could not create the note.</p>
      )}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          minLength={3}
          maxLength={50}
          required
          onChange={handleTitleChange}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          maxLength={500}
          onChange={handleContentChange}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          required
          onChange={handleTagChange}
        >
          {NOTE_TAGS.map((tag) => (
            <option value={tag} key={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          disabled={createMutation.isPending}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
