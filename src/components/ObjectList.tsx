"use client";

import { useEffect, useState } from "react";
import { getObjects, deleteObject } from "../lib/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Trash2,
  ExternalLink,
  Calendar,
  ImageOff,
  RefreshCw,
  Grid3X3,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ObjectType {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

interface ObjectListProps {
  onRefresh?: () => void;
}

export default function ObjectList({ onRefresh }: ObjectListProps) {
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [filtered, setFiltered] = useState<ObjectType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const fetchObjects = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getObjects();

      const dataArray = Array.isArray(res?.data) ? res.data : [];
      setObjects(dataArray);
      setFiltered(dataArray);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load objects. The server may be sleeping or unreachable.",
      );
      setObjects([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteObject(id);
      setObjects((prev) => prev.filter((obj) => obj._id !== id));
      setFiltered((prev) => prev.filter((obj) => obj._id !== id));
      onRefresh?.();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete object. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  useEffect(() => {
    const result = objects.filter(
      (obj) =>
        obj.title.toLowerCase().includes(search.toLowerCase()) ||
        obj.description.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(result);
  }, [search, objects]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 animate-pulse">Loading objects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8">
        <div className="p-4 bg-red-50 rounded-full">
          <ImageOff className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 text-center max-w-md">{error}</p>
        <Button onClick={fetchObjects} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec recherche et contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search objects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Badge variant="secondary">{filtered.length}</Badge>
        <span>object{filtered.length !== 1 ? "s" : ""} found</span>
      </div>

      {/* Grid/List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No objects found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((obj) => (
              <motion.div
                key={obj._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={obj.imageUrl}
                      alt={obj.title}
                      className={`object-cover ${viewMode === "grid" ? "w-full h-48" : "w-32 h-32"}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.png";
                      }}
                    />

                    {/* Overlay actions */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => router.push(`/objects/${obj._id}`)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            disabled={deletingId === obj._id}
                          >
                            {deletingId === obj._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Object</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{obj.title}</strong>? This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(obj._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <CardContent
                    className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                  >
                    <div
                      className={
                        viewMode === "list"
                          ? "flex justify-between items-start"
                          : ""
                      }
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                          {obj.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {obj.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(obj.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
