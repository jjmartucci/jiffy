"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./GlobalHeader.module.css";
import { ActionIcon, Button } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";

const GlobalHeader = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.GlobalHeader}>
      <Link href="/" className={styles.GlobalHeader_Logo}>
        <img src="/cat-typing.gif"></img>
        <h1 className={styles.GlobalHeader_Logo_Title}>
          {process.env.NEXT_PUBLIC_SITE_NAME}
        </h1>
      </Link>

      <div className={styles.GlobalHeader_Actions}>
        <Link href="/upload" passHref>
          <Button>Upload</Button>
        </Link>
        {!session && (
          <Button style={{ marginRight: 10 }} onClick={() => signIn()}>
            Sign in
          </Button>
        )}
        {session && (
          <>
            <Button variant="light" onClick={() => signOut()}>
              Sign out
            </Button>
            <ActionIcon
              variant="filled"
              aria-label="Settings"
              component={Link}
              href="/admin"
            >
              <IconAdjustments stroke={1.5} />
            </ActionIcon>
          </>
        )}
      </div>
    </div>
  );
};

export default GlobalHeader;
