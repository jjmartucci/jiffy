import { Prisma } from "@prisma/client";
import Link from "next/link";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import { createUrl } from "@/app/utilities/gifurl";
import styles from "./Gif.module.css";

export type GiphyGif = {
  id: string;
  name: string;
  filename: string;
  width: number;
  height: number;
  source: 'giphy';
  giphyPageUrl?: string;
  description: string | null;
  views: number;
  tags: unknown[];
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
};

type LocalGif = Prisma.GifGetPayload<{ include: { tags: true } }>;

type Props = {
  data: LocalGif | GiphyGif;
};

const Gif = ({ data, ...rest }: Props) => {
  if (!process.env.NEXT_PUBLIC_IMAGE_HOST_URL) {
    return <span>Please configure the NEXT_PUBLIC_IMAGE_HOST_URL!</span>;
  }

  const isGiphy = 'source' in data && data.source === 'giphy';
  const imageUrl = isGiphy
    ? data.filename
    : createUrl(process.env.NEXT_PUBLIC_IMAGE_HOST_URL, data.filename);
  const href = isGiphy ? (data.giphyPageUrl ?? data.filename) : `/gif/${data.id}`;

  return (
    <div {...rest} className={styles.Gif}>
      <Link href={href} target={isGiphy ? "_blank" : undefined} rel={isGiphy ? "noopener noreferrer" : undefined}>
        <SkeletonImage
          width={data.width}
          height={data.height}
          src={imageUrl}
          alt={`Gif named ${data.name}`}
        />
        <span className={styles.Gif__name}>{data.name}</span>
      </Link>
    </div>
  );
};

export default Gif;
