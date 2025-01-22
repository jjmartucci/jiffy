"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./GlobalHeader.module.css";
import {
  ActionIcon,
  Burger,
  Button,
  Drawer,
  Group,
  Stack,
  VisuallyHidden,
} from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Session } from "next-auth";

type ActionProps = {
  session: Session | null;
};
const Actions = ({ session }: ActionProps) => {
  return (
    <>
      <Button component={Link} href="/upload">
        Upload
      </Button>

      {!session && <Button onClick={() => signIn()}>Sign in</Button>}
      {session && (
        <Button variant="light" onClick={() => signOut()}>
          Sign out
        </Button>
      )}
      {session && session.role.name === "admin" && (
        <ActionIcon
          variant="filled"
          aria-label="Settings"
          component={Link}
          href="/admin"
        >
          <IconAdjustments stroke={1.5} />
        </ActionIcon>
      )}
    </>
  );
};

const GlobalHeader = () => {
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={styles.GlobalHeader}>
      <Link href="/" className={styles.GlobalHeader_Logo}>
        <img src="/cat-typing.gif"></img>
        <h1 className={styles.GlobalHeader_Logo_Title}>
          {process.env.NEXT_PUBLIC_SITE_NAME}
        </h1>
      </Link>

      <div className={styles.GlobalHeader_Actions}>
        <div className={styles.GlobalHeader_Actions_Mobile}>
          <Burger aria-label="Toggle navigation" onClick={open} opened={opened}>
            <VisuallyHidden>Toggle navigation</VisuallyHidden>
          </Burger>
          <Drawer
            opened={opened}
            position="bottom"
            onClose={close}
            title="Hi there"
          >
            <Stack align="flex-start">
              <Actions session={session} />
            </Stack>
          </Drawer>
        </div>
        <div className={styles.GlobalHeader_Actions_Desktop}>
          <Group>
            <Actions session={session} />
          </Group>
        </div>
      </div>
    </div>
  );
};

export default GlobalHeader;
