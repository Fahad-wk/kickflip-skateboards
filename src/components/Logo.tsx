'use client';

import Image, { ImageProps } from "next/image";
import React from "react";

// ✅ Extend valid Image props — NO empty interface rule triggered
type LogoProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  className?: string;
};

export default function Logo({ className = "", ...props }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Kickflip Skateboards"
      width={120}
      height={32}
      draggable={false}
      priority
      className={`select-none ${className}`}
      {...props}
    />
  );
}
