import Link from 'next/link';
import { format } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    _count: {
      likes: number;
      comments: number;
    }
  }
}

export default function PostCard({ post }: PostCardProps) {
  // Simple plain text excerpt
  const excerpt = post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content;

  return (
    <article className="flex flex-col items-center text-center pb-12">
      {/* Image */}
      {post.imageUrl && (
        <Link href={`/post/${post.id}`} className="w-full mb-6 block relative aspect-[4/3] overflow-hidden">
          <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        </Link>
      )}

      {/* Meta: Date and Category/Author */}
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-red-700 uppercase mb-4 mt-2">
        <time dateTime={post.createdAt.toISOString()}>
          {format(post.createdAt, "MMMM d, yyyy")}
        </time>
        <span>&bull;</span>
        <span>SANDHYA DUMPETI</span>
      </div>

      {/* Title */}
      <Link href={`/post/${post.id}`} className="group inline-block">
        <h2 className="text-3xl sm:text-4xl font-serif text-zinc-600 mb-4 transition-colors group-hover:text-zinc-900 group-hover:underline underline-offset-4 decoration-2">
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="text-base sm:text-lg text-zinc-900 max-w-3xl mx-auto mb-8 leading-relaxed">
        {excerpt}
      </p>

      {/* Footer */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-zinc-200 pt-6 gap-4">
        <Link
          href={`/post/${post.id}`}
          className="text-[11px] font-bold tracking-[0.2em] text-zinc-900 uppercase border border-red-300 py-3 px-6 hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors whitespace-nowrap"
        >
          CONTINUE READING
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px] font-bold tracking-[0.2em] text-zinc-700 uppercase">
          <span className="flex items-center gap-1.5 transition-colors">
            <Heart size={14} className="text-rose-500" />
            {post._count.likes} LIKES
          </span>
          <span className="flex items-center gap-1.5 transition-colors">
            <MessageCircle size={14} className="text-blue-500" />
            {post._count.comments} COMMENTS
          </span>
        </div>
      </div>
    </article>
  );
}
