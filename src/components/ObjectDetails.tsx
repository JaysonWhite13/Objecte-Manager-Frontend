// src/components/ObjectDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { getObject } from "../lib/api";

interface ObjectType {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function ObjectDetail({ id }: { id: string }) {
  const [object, setObject] = useState<ObjectType | null>(null);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const res = await getObject(id);
        setObject(res.data);
      } catch (error) {
        console.error("Failed to fetch object:", error);
      }
    };
    fetchObject();
  }, [id]);

  if (!object) return <p>Loading object...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow">
      <img
        src={object.imageUrl}
        alt={object.title}
        className="w-full h-64 object-cover rounded mb-2"
      />
      <h2 className="text-2xl font-bold">{object.title}</h2>
      <p className="mb-2">{object.description}</p>
      <p className="text-sm text-gray-500">
        Created at: {new Date(object.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
