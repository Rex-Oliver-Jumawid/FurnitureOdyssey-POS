import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="flex min-h-svh items-center justify-center px-6 py-10">
        <section className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Image
              src="/brand-mark.webp"
              alt="Prometheus and Furniture Odyssey"
              width={88}
              height={88}
              priority
              className="mx-auto mb-4 h-20 w-20 object-contain"
            />
            <p className="studio-kicker">Furniture Odyssey</p>
            <h1 className="mt-3 text-3xl font-normal tracking-tight text-foreground">
              Operations login
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              For Admin and Staff handling sales records.
            </p>
          </div>

          <div className="studio-card p-5 sm:p-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
