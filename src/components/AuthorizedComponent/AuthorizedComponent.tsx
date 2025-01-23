"use client";
import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  requiresAdmin?: boolean;
  validation: () => boolean;
};

const AuthorizedComponent = ({
  children,
  requiresAdmin = false,
  validation,
}: Props) => {
  const { data: session } = useSession();

  if (typeof session === "undefined") {
    return null;
  }

  if (!validation()) {
    return null;
  }

  if (!session || (requiresAdmin && session.role.name !== "admin")) {
    return null;
  }

  return children;
};

export default AuthorizedComponent;
