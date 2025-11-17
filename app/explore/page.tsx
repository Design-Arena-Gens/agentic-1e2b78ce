"use client"

import { useApp } from '@/lib/store'

export default function ExplorePage() {
  const { state } = useApp()
  const posts = [...state.posts].sort((a, b) => b.createdAt - a.createdAt)
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Explore</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {posts.map((p) => (
          <div key={p.id} className="relative overflow-hidden rounded border bg-white">
            <img src={p.imageUrl} alt={p.caption} className="aspect-square w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
