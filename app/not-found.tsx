import type { Metadata } from 'next';
import { OPEN_GRAPH_IMAGE, SITE_URL } from '@/lib/metadata';
import css from './not-found.module.css';

const title = '404 - Page not found | NoteHub';
const description = 'Sorry, the page you are looking for does not exist.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/404`,
    images: [OPEN_GRAPH_IMAGE],
  },
};

export default function NotFound() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </main>
  );
}
