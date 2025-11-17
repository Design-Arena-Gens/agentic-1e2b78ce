"use client"

import { useMemo, useState } from 'react'
import type { Post } from '@/lib/types'
import { useApp } from '@/lib/store'
import { timeAgo } from '@/lib/utils'

export function PostCard({ post }: { post: Post }) {
  const { state, toggleLike, addComment } = useApp()
  const meId = state.currentUserId
  const author = state.users[post.userId]
  const hasLiked = post.likeUserIds.includes(meId)
  const [comment, setComment] = useState('')

  const likeText = useMemo(() => {
    const n = post.likeUserIds.length
    if (n === 0) return 'Be the first to like this'
    if (n === 1) return '1 like'
    return `${n} likes`
  }, [post.likeUserIds.length])

  return (
    <article className="mb-6 overflow-hidden rounded-md border bg-white">
      <header className="flex items-center gap-3 px-4 py-3">
        <img
          src={author.avatarUrl || `https://api.dicebear.com/9.x/thumbs/svg?seed=${author.username}`}
          alt={author.username}
          className="size-8 rounded-full border"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">{author.name}</span>
          <span className="text-xs text-gray-500">@{author.username} ? {timeAgo(post.createdAt)}</span>
        </div>
      </header>
      <div className="bg-gray-100">
        <img src={post.imageUrl} alt={post.caption} className="w-full object-cover max-h-[560px]" />
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleLike(post.id, meId)}
            className={`text-sm font-medium ${hasLiked ? 'text-brand' : 'text-gray-700'}`}
            aria-pressed={hasLiked}
          >
            {hasLiked ? '? Liked' : '? Like'}
          </button>
          <span className="text-sm text-gray-500">{likeText}</span>
        </div>
        {post.caption && (
          <p className="mt-2 text-sm">
            <span className="font-semibold mr-2">@{author.username}</span>
            {post.caption}
          </p>
        )}
        {post.comments.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.comments.slice(-3).map((c) => {
              const u = state.users[c.userId]
              return (
                <div key={c.id} className="text-sm">
                  <span className="font-semibold mr-2">@{u.username}</span>
                  <span>{c.text}</span>
                </div>
              )
            })}
            {post.comments.length > 3 && (
              <div className="text-xs text-gray-500">View all {post.comments.length} comments</div>
            )}
          </div>
        )}
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            addComment(post.id, comment, meId)
            setComment('')
          }}
        >
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded border px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={!comment.trim()}>
            Post
          </button>
        </form>
      </div>
    </article>
  )
}
