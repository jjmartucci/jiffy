"use client";

import { useSession } from "next-auth/react";

const UserSession = () => {
  const session = useSession();

  return (
    <>
      <h1>Client Session</h1>
      <pre>{JSON.stringify(session)}</pre>
    </>
  );
};

export default UserSession;
