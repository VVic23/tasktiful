import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b bg-card">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/tasks" className="font-bold text-xl tracking-tight">
          Tasktiful
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {session.user.name || session.user.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/api/auth/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}