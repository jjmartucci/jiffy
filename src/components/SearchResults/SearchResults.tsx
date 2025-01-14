import { Prisma } from "@prisma/client";
import styles from "./SearchResults.module.css";
import Gif from "../Gif/Gif";

type Props = {
  searchResults: Array<Prisma.GifSelect>;
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
