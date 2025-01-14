"use client";
import { Skeleton } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import styles from "./SkeletonImage.module.css";

type Props = {
  width: number;
  height: number;
  src: string;
  alt: string;
};

const SkeletonImage = ({ width, height, src, alt }: Props) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <Skeleton
          className={styles.SkeletonImage}
          height={height}
          mt={6}
          width={width}
          radius="xl"
        />
      )}

      <Image
        width={width}
        height={height}
        src={src}
        style={{ objectFit: "contain" }}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={styles.SkeletonImage}
      />
    </>
  );
};

export default SkeletonImage;
