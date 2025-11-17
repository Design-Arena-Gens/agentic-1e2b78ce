"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import type { AppState, Post, User } from './types'
import { generateId } from './utils'

const STORAGE_KEY = 'agentic-instagram-state-v1'

type Action =
  | { type: 'SEED'; payload: AppState }
  | { type: 'ADD_POST'; payload: { imageUrl: string; caption: string } }
  | { type: 'TOGGLE_LIKE'; payload: { postId: string; userId: string } }
  | { type: 'ADD_COMMENT'; payload: { postId: string; text: string; userId: string } }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SEED':
      return action.payload
    case 'ADD_POST': {
      const post: Post = {
        id: generateId('post'),
        userId: state.currentUserId,
        imageUrl: action.payload.imageUrl,
        caption: action.payload.caption,
        createdAt: Date.now(),
        likeUserIds: [],
        comments: [],
      }
      return { ...state, posts: [post, ...state.posts] }
    }
    case 'TOGGLE_LIKE': {
      const posts = state.posts.map((p) => {
        if (p.id !== action.payload.postId) return p
        const hasLiked = p.likeUserIds.includes(action.payload.userId)
        return {
          ...p,
          likeUserIds: hasLiked
            ? p.likeUserIds.filter((id) => id !== action.payload.userId)
            : [...p.likeUserIds, action.payload.userId],
        }
      })
      return { ...state, posts }
    }
    case 'ADD_COMMENT': {
      const posts = state.posts.map((p) => {
        if (p.id !== action.payload.postId) return p
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: generateId('cmt'),
              userId: action.payload.userId,
              text: action.payload.text,
              createdAt: Date.now(),
            },
          ],
        }
      })
      return { ...state, posts }
    }
    default:
      return state
  }
}

function seedState(): AppState {
  const u1: User = {
    id: 'u1',
    username: 'you',
    name: 'You',
    avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=you`,
  }
  const u2: User = {
    id: 'u2',
    username: 'alex',
    name: 'Alex',
    avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=alex`,
  }
  const posts: Post[] = [
    {
      id: generateId('post'),
      userId: 'u2',
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      caption: 'Morning vibes ??',
      createdAt: Date.now() - 1000 * 60 * 60 * 6,
      likeUserIds: ['u1'],
      comments: [],
    },
    {
      id: generateId('post'),
      userId: 'u1',
      imageUrl: 'https://images.unsplash.com/photo-1532635026-8fe0b757fb13?q=80&w=1600&auto=format&fit=crop',
      caption: 'Weekend getaway ???',
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      likeUserIds: ['u2'],
      comments: [],
    },
  ]
  return {
    currentUserId: 'u1',
    users: { [u1.id]: u1, [u2.id]: u2 },
    posts,
  }
}

const AppContext = createContext<{
  state: AppState
  addPost: (imageUrl: string, caption: string) => void
  toggleLike: (postId: string, userId: string) => void
  addComment: (postId: string, text: string, userId: string) => void
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as AppState)

  // load / seed
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        dispatch({ type: 'SEED', payload: parsed })
      } else {
        dispatch({ type: 'SEED', payload: seedState() })
      }
    } catch {
      dispatch({ type: 'SEED', payload: seedState() })
    }
  }, [])

  // persist
  useEffect(() => {
    if (!state) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  const addPost = useCallback((imageUrl: string, caption: string) => {
    dispatch({ type: 'ADD_POST', payload: { imageUrl, caption } })
  }, [])

  const toggleLike = useCallback((postId: string, userId: string) => {
    dispatch({ type: 'TOGGLE_LIKE', payload: { postId, userId } })
  }, [])

  const addComment = useCallback((postId: string, text: string, userId: string) => {
    if (!text.trim()) return
    dispatch({ type: 'ADD_COMMENT', payload: { postId, text: text.trim(), userId } })
  }, [])

  const value = useMemo(
    () => ({ state, addPost, toggleLike, addComment }),
    [state, addPost, toggleLike, addComment]
  )

  if (!state) return null

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
