import type { Metadata } from "next";
import { DeleteApplication } from "./delete-application";
import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const session = await getServerSession();
  const user  = session?.user;

  // ไม่มี user ห้ามเข้า
  if(!user) unauthorized();

  // มี user แต่ไม่มี role admin ห้าม
  if(user.role !== 'admin') forbidden();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-muted-foreground">
            You have administrator access.
          </p>
        </div>
        <DeleteApplication />
      </div>
    </main>
  );
}
