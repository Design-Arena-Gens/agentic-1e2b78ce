"use client"

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useApp } from '@/lib/store'

export default function ProfilePage() {
  const params = useParams<{ username: string }>()
  const { state } = useApp()

  const user = useMemo(() => {
    const target = decodeURIComponent(params.username || '')
    const found = Object.values(state.users).find((u) => u.username.toLowerCase() === target.toLowerCase())
    return found || state.users[state.currentUserId]
  }, [params.username, state.users, state.currentUserId])

  const posts = state.posts.filter((p) => p.userId === user.id)

  return (
    <div>
      <div className="mb-6 flex items-center gap-6">
        <img
          src={user.avatarUrl || `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.username}`}
          alt={user.username}
          className="size-20 rounded-full border"
        />
        <div>
          <div className="text-xl font-semibold">{user.name}</div>
          <div className="text-gray-600">@{user.username}</div>
          <div className="mt-2 text-sm text-gray-600">{posts.length} posts</div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-sm text-gray-600">No posts yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {posts.map((p) => (
            <div key={p.id} className="overflow-hidden rounded border bg-white">
              <img src={p.imageUrl} alt={p.caption} className="aspect-square w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
