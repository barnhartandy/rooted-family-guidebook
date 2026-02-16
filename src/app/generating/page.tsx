import { Suspense } from "react";
import GeneratingClient from "./GeneratingClient";

function LoadingFallback() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-8 h-12 w-12 animate-spin rounded-full border-4 border-warm-200 border-t-terra" />
      <h1 className="font-serif text-3xl font-medium text-warm-900 md:text-4xl">
        Loading...
      </h1>
    </div>
  );
}

export default function GeneratingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 px-6">
      <Suspense fallback={<LoadingFallback />}>
        <GeneratingClient />
      </Suspense>
    </div>
  );
}
