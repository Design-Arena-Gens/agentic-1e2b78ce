"use client"

import { useRef, useState } from 'react'
import { useApp } from '@/lib/store'

export function CreatePost() {
  const { addPost } = useApp()
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  function submit() {
    if (!preview) return
    addPost(preview, caption)
    setPreview(null)
    setCaption('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="mb-6 overflow-hidden rounded-md border bg-white">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">Create a post</h2>
      </div>
      <div className="p-4 space-y-3">
        {!preview ? (
          <label className="flex h-48 cursor-pointer items-center justify-center rounded border-2 border-dashed bg-gray-50 text-sm text-gray-600">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            Click to upload an image
          </label>
        ) : (
          <div>
            <img src={preview} alt="preview" className="max-h-96 w-full rounded object-cover" />
          </div>
        )}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="min-h-24 w-full resize-y rounded border px-3 py-2 text-sm"
        />
        <div className="flex justify-end gap-2">
          {preview && (
            <button onClick={() => setPreview(null)} className="rounded px-3 py-2 text-sm border">
              Clear
            </button>
          )}
          <button
            onClick={submit}
            disabled={!preview}
            className="rounded bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
