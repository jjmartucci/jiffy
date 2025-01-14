"use client";
import { useSession } from "next-auth/react";
import Unauthorized from "../Unauthorized/Unauthorized";

type Props = {
  children: React.ReactNode;
  requiresAdmin?: boolean;
};

const AuthorizedPage = ({ children, requiresAdmin = false }: Props) => {
  const { data: session } = useSession();

  if (typeof session === "undefined") {
    return;
  }

  if (!session || (requiresAdmin && session.role.name !== "admin")) {
    return <Unauthorized />;
  }

  return children;
};

export default AuthorizedPage;
