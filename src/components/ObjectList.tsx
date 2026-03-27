"use client";

import { useEffect, useState } from "react";
import { getObjects } from "../lib/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface ObjectType {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function ObjectList() {
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [filtered, setFiltered] = useState<ObjectType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchObjects = async () => {
    try {
      const res = await getObjects();
      if (res?.data) {
        setObjects(res.data);
        setFiltered(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  useEffect(() => {
    const result = objects.filter((obj) =>
      obj.title.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(result);
  }, [search, objects]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* 🔎 Search bar stylée */}
      <Input
        placeholder="🔍 Search objects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md mx-auto"
      />

      {/* 🧱 Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No objects found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((obj) => (
            <Card
              key={obj._id}
              className="cursor-pointer hover:shadow-xl transition duration-300"
              onClick={() => router.push(`/objects/${obj._id}`)}
            >
              <CardContent className="p-3">
                <img
                  src={obj.imageUrl}
                  alt={obj.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />

                <h3 className="font-semibold text-lg">{obj.title}</h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {obj.description}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(obj.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
