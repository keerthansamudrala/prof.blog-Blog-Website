'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Manage state
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchPosts();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setError('Admin passcode is required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const isEditing = !!editingId;
      const url = isEditing ? `/api/posts/${editingId}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, title, content, imageUrl }),
      });

      if (res.ok) {
        const post = await res.json();
        if (!isEditing) {
          router.push(`/post/${post.id}`);
        } else {
          setSuccessMsg('Post updated successfully!');
          resetForm();
          setActiveTab('manage');
        }
      } else {
        const data = await res.json();
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} post`);
      }
    } catch (err) {
      setError(`An error occurred while ${editingId ? 'updating' : 'creating'} the post`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!passcode) {
      setError('Admin passcode is required to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
        setSuccessMsg('Post deleted successfully');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete post');
      }
    } catch (err) {
      setError('An error occurred while deleting the post');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl || '');
    setActiveTab('create');
    setError('');
    setSuccessMsg('');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setImageUrl('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-yellow-500">
          Admin Dashboard
        </h1>
        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('create');
              if (!editingId) resetForm();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'create'
              ? 'bg-red dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
          >
            {editingId ? 'Edit Blog' : 'Create Blog'}
          </button>
          <button
            onClick={() => {
              setActiveTab('manage');
              resetForm();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'manage'
              ? 'bg-red dark:bg-zinc-900 text-zinc-500 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-white dark:hover:text-zinc-100'
              }`}
          >
            Manage Posts
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <label htmlFor="global-passcode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Admin Passcode (Required for all actions)
        </label>
        <input
          type="password"
          id="global-passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter admin passcode"
          className="block w-full max-w-md rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 dark:bg-red-500/10 p-4 border border-red-200 dark:border-red-500/20">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{error}</h3>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 rounded-md bg-green-50 dark:bg-green-500/10 p-4 border border-green-200 dark:border-green-500/20">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-400">{successMsg}</h3>
        </div>
      )}

      {activeTab === 'create' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="An interesting title..."
              className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Content
            </label>
            <textarea
              id="content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your beautiful story here..."
              className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm resize-y"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Cancel Edit
              </button>
            ) : <div />}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-100 px-8 py-3 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (editingId ? 'Saving...' : 'Publishing...') : (editingId ? 'Save Changes' : 'Publish Post')}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {isLoadingPosts ? (
            <div className="text-center py-8 text-zinc-500">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
              No posts found. Create one to get started.
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 truncate mt-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href={`/post/${post.id}`}
                    target="_blank"
                    className="flex-1 sm:flex-none text-center px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
