import Link from "next/link";

export default function Custom404() {
  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow pt-1 sm:pt-16">
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground/80 mb-6">
            Page Not Found
          </h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-md">
            The DAO you&apos;re looking for doesn&apos;t exist or the page has
            been moved.
          </p>
          <Link
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            href="/"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
