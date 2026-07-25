import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-2">
          <CheckSquare className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Welcome to Tasktiful
        </h1>
        <p className="text-lg text-muted-foreground">
          A modern, lightning-fast task management application designed to keep you focused and organized.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          {session?.user ? (
            <Link href="/tasks">
              <Button size="lg" className="gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/api/auth/signin">
              <Button size="lg" className="gap-2">
                Get Started with Google <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}