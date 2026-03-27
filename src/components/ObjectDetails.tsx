"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getObject, deleteObject } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  ImageOff,
  Loader2,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";

interface ObjectType {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
}

interface ObjectDetailProps {
  id: string;
}

export default function ObjectDetail({ id }: ObjectDetailProps) {
  const [object, setObject] = useState<ObjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchObject = async () => {
      try {
        setLoading(true);
        const res = await getObject(id);
        setObject(res.data);
      } catch (err) {
        console.error("Failed to fetch object:", err);
        setError("Object not found or unavailable");
      } finally {
        setLoading(false);
      }
    };
    fetchObject();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteObject(id);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete object");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-gray-500">Loading object...</p>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ImageOff className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 text-lg">{error || "Object not found"}</p>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Object</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{object.title}</strong>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content */}
      <Card className="overflow-hidden shadow-xl">
        <div className="aspect-video relative bg-gray-100">
          <img
            src={object.imageUrl}
            alt={object.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.png";
            }}
          />
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary">Object Details</Badge>
            <h1 className="text-3xl font-bold">{object.title}</h1>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed">
            {object.description}
          </p>

          <div className="flex flex-wrap gap-6 pt-4 border-t text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Created:{" "}
                {new Date(object.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {object.updatedAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Updated:{" "}
                  {new Date(object.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
