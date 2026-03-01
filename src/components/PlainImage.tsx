"use client";

import Image, { type ImageProps } from "next/image";

type PlainImageProps = Omit<ImageProps, "loader" | "unoptimized">;

export function PlainImage(props: PlainImageProps) {
  const { alt, ...rest } = props;
  return <Image alt={alt} {...rest} loader={({ src }) => src} unoptimized />;
}
