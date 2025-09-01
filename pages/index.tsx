import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

const CONTRACT_ID = "sputnikv2.testnet";
// sputnik-v2.testnet
// sputnikv2.testnet

export default function IndexPage() {
  const [Daos, setDaos] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromIndex, setFromIndex] = useState(0);
  const [limit] = useState(24);
  const [hasMore, setHasMore] = useState(true);
  const { viewFunction } = useWalletSelector();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = (await viewFunction({
          contractId: CONTRACT_ID,
          method: "get_daos",
          args: { from_index: 0, limit },
        })) as string[];

        setDaos(result || []);
        setFromIndex(result?.length || 0);
        setHasMore((result?.length || 0) === limit);
      } catch (err: any) {
        setError(err?.message || "Failed to load DAOs");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [limit]);

  const onLoadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = (await viewFunction({
        contractId: CONTRACT_ID,
        method: "get_daos",
        args: { from_index: fromIndex, limit },
      })) as string[];

      const newItems = result || [];

      setDaos((prev) => Array.from(new Set([...prev, ...newItems])));

      const fetched = newItems.length;

      setFromIndex(fromIndex + fetched);
      setHasMore(fetched === limit);
    } catch (err: any) {
      setError(err?.message || "Failed to load more DAOs");
    } finally {
      setLoading(false);
    }
  };

  const filteredDaos = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return Daos;

    return Daos.filter((d) => d.toLowerCase().includes(q));
  }, [Daos, search]);

  const isEmpty = !loading && filteredDaos.length === 0;

  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
      <div className="flex flex-col gap-6 pb-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">DAOs</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              className="max-w-xl"
              placeholder="Search by DAO id..."
              radius="sm"
              value={search}
              onValueChange={setSearch}
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loading
                ? "Loading…"
                : `${filteredDaos.length} of ${Daos.length} shown`}
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

        {/* Grid */}
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {/* Loading skeletons */}
          {loading && Daos.length === 0 && (
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
              <div className="text-gray-500 dark:text-gray-400 mb-6">
                Try a different search or clear the filter.
              </div>
              <Button onPress={() => setSearch("")}>Clear search</Button>
            </div>
          )}

          {/* DAO cards */}
          {filteredDaos.map((dao) => (
            <NextLink key={dao} className="no-underline" href={`/${dao}`}>
              <div className="group border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all h-full flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {/* Simple avatar with initials */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
                    {dao.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold truncate" title={dao}>
                      {dao}
                    </h2>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Sputnik v2 • Testnet
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
          ))}
        </div>

        {/* Load more */}
        {!isEmpty && filteredDaos.length > 0 && (
          <div className="flex justify-center mt-2">
            {hasMore ? (
              <Button isDisabled={loading} variant="flat" onPress={onLoadMore}>
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
