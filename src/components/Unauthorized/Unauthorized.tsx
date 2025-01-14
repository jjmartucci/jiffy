import { Text, Title } from "@mantine/core";
import Image from "next/image";
import unauthorized from "@/images/unauthorized.gif";
import styles from "./Unauthorized.module.css";
import LoginButton from "../LoginButton/LoginButton";

const Unauthorized = () => {
  return (
    <div className={styles.Unauthorized}>
      <div>
        <Image
          src={unauthorized}
          alt="You can't do that."
          layout="responsive"
        />
      </div>
      <div>
        <Title order={2}>You can’t do that!</Title>
        <Text>Try logging in first.</Text>
        <LoginButton />
      </div>
    </div>
  );
};

export default Unauthorized;
