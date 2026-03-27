// src/components/ObjectForm.tsx
"use client";

import { useState } from "react";
import { createObject } from "../lib/api";

export default function ObjectForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", file);

    await createObject(formData);
    setTitle("");
    setDescription("");
    setFile(null);
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="file"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Object
      </button>
    </form>
  );
}
