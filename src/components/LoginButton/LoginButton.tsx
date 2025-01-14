import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <Button style={{ marginRight: 10 }} onClick={() => signIn()}>
      Sign in
    </Button>
  );
};

export default LoginButton;
