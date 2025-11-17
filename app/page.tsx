"use client"

import { useApp } from '@/lib/store'
import { CreatePost } from '@/components/CreatePost'
import { PostCard } from '@/components/PostCard'

export default function HomePage() {
  const { state } = useApp()
  const posts = [...state.posts].sort((a, b) => b.createdAt - a.createdAt)
  return (
    <div>
      <CreatePost />
      <div>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}
