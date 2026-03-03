import { Prisma } from "@prisma/client";
import styles from "./SearchResults.module.css";
import Gif, { GiphyGif } from "../Gif/Gif";

type LocalGif = Prisma.GifGetPayload<{ include: { tags: true } }>;

type Props = {
  searchResults: Array<LocalGif | GiphyGif>;
};
const SearchResults = ({ searchResults }: Props) => {
  return (
    <div className={styles.Search_Results}>
      {searchResults.map((g) => (
        <Gif data={g} key={g.id} />
      ))}
    </div>
  );
};

export default SearchResults;
