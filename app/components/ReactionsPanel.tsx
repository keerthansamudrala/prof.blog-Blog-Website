'use client';

import { useState } from 'react';
import { Heart, Share2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReactionsPanelProps {
  postId: string;
  initialLikes: number;
}

export default function ReactionsPanel({ postId, initialLikes }: ReactionsPanelProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (hasLiked) return;
    
    // Optimistic UI update
    setLikes((prev) => prev + 1);
    setHasLiked(true);

    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      router.refresh();
    } catch (e) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SuperBlog',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  return (
    <div className="flex items-center gap-4 py-6 border-y border-zinc-200 my-8">
      <button
        onClick={handleLike}
        disabled={hasLiked}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
          hasLiked 
            ? 'bg-rose-50 border-rose-200 text-rose-600' 
            : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
        }`}
      >
        <Heart size={18} className={hasLiked ? 'fill-current' : ''} />
        <span className="font-medium text-sm">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-all"
      >
        {copied ? (
          <>
            <Check size={18} className="text-green-500" />
            <span className="font-medium text-sm text-green-500">Copied</span>
          </>
        ) : (
          <>
            <Share2 size={18} />
            <span className="font-medium text-sm">Share</span>
          </>
        )}
      </button>
    </div>
  );
}
