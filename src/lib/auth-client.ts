import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
    plugins:[ nextCookies()],
});