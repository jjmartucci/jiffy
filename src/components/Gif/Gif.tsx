import { Prisma } from "@prisma/client";
import Link from "next/link";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import { createUrl } from "@/app/utilities/gifurl";

type Props = {
  data: Prisma.GifSelect;
};

const Gif = ({ data, ...rest }: Props) => {
  if (!process.env.NEXT_PUBLIC_IMAGE_HOST_URL) {
    return <span>Please configure the NEXT_PUBLIC_IMAGE_HOST_URL!</span>;
  }

  const imageUrl = createUrl(
    process.env.NEXT_PUBLIC_IMAGE_HOST_URL,
    data.filename
  );
  return (
    <div {...rest}>
      <Link href={`/gif/${data.id}`}>
        <SkeletonImage
          width={data.width}
          height={data.height}
          src={imageUrl}
          alt={`Gif named ${data.name}`}
        />
      </Link>
    </div>
  );
};

export default Gif;
