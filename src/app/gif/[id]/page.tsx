import GifPage from "@/components/GifPage/GifPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/api/gif/read?id=${id}`
  );
  const gif = (await data.json()).gif;

  // handle no gif found
  if (!gif) {
    return <h1>We lost this one.</h1>;
  }

  return <GifPage gifData={gif} />;
}
