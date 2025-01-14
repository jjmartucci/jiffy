import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const serversideAuth = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(null, { status: 403 });
  }
  return session;
};
