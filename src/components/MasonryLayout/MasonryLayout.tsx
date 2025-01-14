"use client";
import Gif from "@/components/Gif/Gif";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryLayout = ({ gifs }) => {
  "use client";
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry>
        {gifs.map((g) => (
          <Gif data={g} key={g.id} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};
export default MasonryLayout;
