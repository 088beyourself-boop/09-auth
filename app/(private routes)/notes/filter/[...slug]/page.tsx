import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api/serverApi';
import { OPEN_GRAPH_IMAGE, SITE_URL } from '@/lib/metadata';
import type { NoteTag } from '@/types/note';

const NOTES_PER_PAGE = 12;
const noteTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

function isNoteTag(value: string): value is NoteTag {
  return noteTags.some((tag) => tag === value);
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedFilter = slug[0];

  if (
    slug.length !== 1 ||
    (selectedFilter !== 'all' && !isNoteTag(selectedFilter))
  ) {
    notFound();
  }

  const filterName = selectedFilter === 'all' ? 'All' : selectedFilter;
  const title = `${filterName} notes | NoteHub`;
  const description =
    selectedFilter === 'all'
      ? 'Browse all your notes in NoteHub.'
      : `Browse your notes tagged ${selectedFilter} in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${selectedFilter}`,
      images: [OPEN_GRAPH_IMAGE],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const selectedFilter = slug[0];

  if (
    slug.length !== 1 ||
    (selectedFilter !== 'all' && !isNoteTag(selectedFilter))
  ) {
    notFound();
  }

  const tag = selectedFilter === 'all' ? undefined : selectedFilter;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () => fetchNotes({ page: 1, perPage: NOTES_PER_PAGE, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? 'all'} tag={tag} />
    </HydrationBoundary>
  );
}
