"use client";

import { useEffect, useState } from "react";
import { getObject } from "../../../lib/api";
import { useParams } from "next/navigation";

export default function ObjectDetail() {
  const params = useParams(); // 🔥 récupère id
  const id = params?.id as string;

  const [object, setObject] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchObject = async () => {
      try {
        const res = await getObject(id);
        setObject(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchObject();
  }, [id]); // ✅ maintenant stable

  if (!object) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={object.imageUrl}
        alt={object.title}
        className="w-full h-[400px] object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{object.title}</h1>
      <p className="mb-4">{object.description}</p>
    </div>
  );
}
