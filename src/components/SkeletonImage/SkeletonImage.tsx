"use client";
import { Skeleton, Stack, Text } from "@mantine/core";
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
  const [isError, setError] = useState(false);

  if (isError) {
    return (
      <div className={styles.SkeletonImage_Error}>
        <Stack
          align="center"
          justify="center"
          className={styles.SkeletonImage_Error_Message}
        >
          <Text>😱</Text>
          <Text size="xs">{`Can‘t find ${src}`}</Text>
        </Stack>
      </div>
    );
  }

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
        onError={() => setError(true)}
        className={styles.SkeletonImage}
        unoptimized
      />
    </>
  );
};

export default SkeletonImage;
