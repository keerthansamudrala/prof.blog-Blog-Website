import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // Basic like system: Just create a "Like" record for the post.
    const like = await prisma.like.create({
      data: {
        postId: resolvedParams.id,
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
  }
}
