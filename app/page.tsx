import prisma from '@/lib/prisma';
import PostCard from './components/PostCard';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q;

  const posts = await prisma.post.findMany({
    where: q ? {
      title: {
        contains: q,
      }
    } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  return (
    <div className="w-[90%] md:w-[60%] mx-auto pt-8">
      {posts.length === 0 ? (
        <div className="text-center py-24 text-zinc-500 border border-dashed border-zinc-200">
          <p>No posts yet. Wait for the amazing content!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-24">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
