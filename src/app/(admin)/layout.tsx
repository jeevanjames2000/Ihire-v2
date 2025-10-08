"use client";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <div className="min-h-screen xl:flex">
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
    </div>
  );
}
