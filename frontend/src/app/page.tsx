"use client";

import Dashboard from "@/components/dashboard";
import Header from "@/components/header";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [region, setRegion] = useState<string>("us-east");

  return (
    <>
      <header>
        <Header region={region} setRegion={setRegion} />
      </header>
      <main>
        <Dashboard region={region} />
      </main>
    </>
  );
}
