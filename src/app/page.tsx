// src/app/page.tsx
"use client";

import { useState } from "react";
import ObjectList from "../components/ObjectList";
import ObjectForm from "../components/ObjectForm";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  const handleCreated = () => {
    setRefresh((prev) => !prev); // déclenche reload de la liste
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Objects Manager</h1>
      <ObjectForm onCreated={handleCreated} />
      <ObjectList key={refresh.toString()} />
    </div>
  );
}
