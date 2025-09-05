import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

import { useNetwork } from "@/contexts/NetworkContext";

export default function IndexPage() {
  const { network } = useNetwork();
  const router = useRouter();
  const [daos, setDaos] = useState<string[]>([]);
  const [daoInput, setDaoInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromIndex, setFromIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { viewFunction } = useWalletSelector();

  const LIMIT = 24;

  const CONTRACT_ID =
    network === "mainnet" ? "sputnik-dao.near" : "sputnikv2.testnet";

  // Reset state when network changes
  useEffect(() => {
    setDaos([]);
    setFromIndex(0);
    setHasMore(true);
    setError(null);
  }, [network]);

  // Fetch initial DAOs
  useEffect(() => {
    const fetchDaos = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = (await viewFunction({
          contractId: CONTRACT_ID,
          method: "get_daos",
          args: { from_index: 0, limit: LIMIT },
        })) as string[];

        setDaos(result || []);
        setFromIndex(result?.length || 0);
        setHasMore((result?.length || 0) === LIMIT);
      } catch (err: any) {
        setError(err?.message || "Failed to load DAOs");
      } finally {
        setLoading(false);
      }
    };

    fetchDaos();
  }, [network, viewFunction, CONTRACT_ID]);

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = (await viewFunction({
        contractId: CONTRACT_ID,
        method: "get_daos",
        args: { from_index: fromIndex, limit: LIMIT },
      })) as string[];

      const newItems = result || [];

      setDaos((prev) => [...prev, ...newItems]);
      setFromIndex(fromIndex + newItems.length);
      setHasMore(newItems.length === LIMIT);
    } catch (err: any) {
      setError(err?.message || "Failed to load more DAOs");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDao = () => {
    if (daoInput.trim()) {
      router.push(`/${daoInput.trim()}`);
    }
  };

  const isEmpty = !loading && daos.length === 0;

  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow pt-1 sm:pt-16">
      <div className="flex flex-col gap-6 pb-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">DAOs</h1>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 max-w-xl w-full">
              <Input
                className="flex-1"
                placeholder="Enter DAO name to visit..."
                radius="sm"
                value={daoInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGoToDao();
                  }
                }}
                onValueChange={setDaoInput}
              />
              <Button
                color="primary"
                isDisabled={!daoInput.trim()}
                radius="sm"
                onPress={handleGoToDao}
              >
                Go to DAO
              </Button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {loading ? "Loading…" : `${daos.length} DAOs shown`}
              </div>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
              <Button
                className="ml-3"
                size="sm"
                onPress={() => location.reload()}
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {/* Loading skeletons */}
          {loading && daos.length === 0 && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 animate-pulse h-36"
                >
                  <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div className="col-span-full text-center py-12">
              <div className="text-2xl font-semibold mb-2">No DAOs found</div>
              <div className="text-gray-500 dark:text-gray-400">
                No DAOs are available at the moment.
              </div>
            </div>
          )}

          {/* DAO cards */}
          {daos.map((dao: string) => {
            return (
              <NextLink key={dao} className="no-underline" href={`/${dao}`}>
                <div className="group border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all h-full flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {/* Simple avatar with initials */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
                      {dao.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2
                        className="text-xl font-semibold truncate"
                        title={dao}
                      >
                        {dao}
                      </h2>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {`Sputnik v2 • ${network === "mainnet" ? "Mainnet" : "Testnet"}`}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-end">
                    <Button
                      className="group-hover:translate-x-0.5 transition-transform"
                      color="primary"
                      size="sm"
                      variant="solid"
                    >
                      View DAO
                    </Button>
                  </div>
                </div>
              </NextLink>
            );
          })}
        </div>

        {/* Load more */}
        {!isEmpty && daos.length > 0 && (
          <div className="flex justify-center mt-2">
            {hasMore ? (
              <Button
                isDisabled={loading}
                variant="flat"
                onPress={handleLoadMore}
              >
                {loading ? "Loading…" : "Load more"}
              </Button>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                No more DAOs
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
