import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ReactionsPanel from '@/app/components/ReactionsPanel';
import CommentForm from '@/app/components/CommentForm';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id },
    include: {
      comments: { orderBy: { createdAt: 'desc' } },
      _count: { select: { likes: true } },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/" className="text-sm font-medium text-zinc-900 hover:text-zinc-900 mb-8 inline-block transition-colors">
        &larr; Back to posts
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl mb-6">
          {post.title}
        </h1>
        <time dateTime={post.createdAt.toISOString()} className="flex items-center text-sm text-red-700">
          <span className="h-4 w-0.5 rounded-full dark:bg-zinc-5000 mr-3" />
          {format(post.createdAt, 'MMMM d, yyyy • h:mm a')}
        </time>
      </header>

      {post.imageUrl && (
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden bg-zinc-500">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="prose prose-zinc max-w-none text-zinc-800 leading-relaxed text-lg whitespace-pre-wrap">
        {post.content}
      </div>

      <ReactionsPanel postId={post.id} initialLikes={post._count.likes} />

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Comments ({post.comments.length})
        </h2>

        <CommentForm postId={post.id} />

        <div className="space-y-6 mt-8">
          {post.comments.length === 0 ? (
            <p className="text-zinc-500 italic">No comments yet. Be the first!</p>
          ) : (
            post.comments.map((comment: any) => (
              <div key={comment.id} className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-sm text-zinc-900">Anonymous visitor</div>
                  <time className="text-xs text-zinc-500">
                    {format(comment.createdAt, 'MMM d, h:mm a')}
                  </time>
                </div>
                <p className="text-zinc-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}
