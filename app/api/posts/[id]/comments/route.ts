import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        postId: resolvedParams.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
