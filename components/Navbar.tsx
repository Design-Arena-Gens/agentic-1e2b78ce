"use client"

import Link from 'next/link'
import { useApp } from '@/lib/store'

export function Navbar() {
  const { state } = useApp()
  const me = state.users[state.currentUserId]
  const profileHref = `/profile/${encodeURIComponent(me.username)}`
  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
      <div className="container-narrow flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          InstaLite
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href={profileHref} className="inline-flex items-center gap-2">
            <img
              src={me.avatarUrl || `https://api.dicebear.com/9.x/thumbs/svg?seed=${me.username}`}
              alt={me.username}
              className="size-6 rounded-full border"
            />
            <span>@{me.username}</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
