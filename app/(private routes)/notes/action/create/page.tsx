import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import { OPEN_GRAPH_IMAGE, SITE_URL } from '@/lib/metadata';
import css from './CreateNote.module.css';

const title = 'Create note | NoteHub';
const description = 'Create a new note and save it to your NoteHub collection.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/notes/action/create`,
    images: [OPEN_GRAPH_IMAGE],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
