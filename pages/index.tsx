import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useMemo, useState } from "react";

import DefaultLayout from "@/layouts/default";
import daos from "@/mock/daos";

// NOTE: Using local mock data. Replace with API integration when backend is ready.

type Dao = {
  contract_id: string;
  total_in_dollar: string; // numeric string
};

export default function IndexPage() {
  const [query, setQuery] = useState("");
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  const filtered = useMemo(
    () =>
      (daos as Dao[]).filter((d) =>
        d.contract_id.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  // Simple number formatter helpers
  const formatUSD = (v: string) => {
    const num = Number(v);

    if (!isFinite(num)) return "0.00";
    if (num > 999999) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num > 999) {
      return `$${(num / 1_000).toFixed(2)}K`;
    }
    
    return `$${num.toFixed(2)}`;
  };

  const toggleFollow = (id: string) =>
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 pb-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">DAOs</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Input
              className="sm:max-w-xl"
              placeholder="Search by name"
              radius="full"
              size="lg"
              startContent={<span className="text-default-400">🔍</span>}
              value={query}
              onValueChange={setQuery}
            />
            <Button className="h-12" radius="full" variant="bordered">
              Filter ▾
            </Button>
            <Button
              className="h-12 ml-auto sm:ml-0"
              color="primary"
              radius="full"
            >
              Create a new DAO ＋
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 30).map((dao) => {
            const id = dao.contract_id;
            // Placeholder metrics (until API supplies):
            const members = (id.length % 150) + 1; // deterministic pseudo
            const proposals = (id.length * 3) % 500;

            return (
              <div
                key={id}
                className="rounded-2xl border border-default-200 dark:border-default-100/20 bg-white dark:bg-default-50 shadow-sm p-6 flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-default-200 flex items-center justify-center text-lg font-bold">
                    {id[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg truncate" title={id}>
                      {id}
                    </h2>
                    <p className="text-small text-default-500">
                      No description
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm font-medium text-primary">
                      <button className="hover:underline">DAO Funds</button>
                      <button className="hover:underline">
                        Members/Groups
                      </button>
                      <button className="hover:underline">
                        Active proposals
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-10 text-sm mt-2">
                  <div>
                    <div className="font-semibold">
                      {formatUSD(dao.total_in_dollar)}
                    </div>
                    <span className="text-xs text-default-500">Treasury</span>
                  </div>
                  <div>
                    <div className="font-semibold">{members}</div>
                    <span className="text-xs text-default-500">Members</span>
                  </div>
                  <div>
                    <div className="font-semibold">{proposals}</div>
                    <span className="text-xs text-default-500">Proposals</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 text-default-500 text-sm">
                  <div className="flex items-center gap-1">
                    ⚙️ <span>Settings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    🖼️ <span>NFTs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    🎯 <span>Bounties</span>
                  </div>
                  <div className="flex items-center gap-1">
                    🗳️ <span>Polls</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-auto pt-2">
                  <Button
                    fullWidth
                    color={following[id] ? "default" : "primary"}
                    onClick={() => toggleFollow(id)}
                  >
                    {following[id] ? "Following" : "Follow"}
                  </Button>
                  <Button fullWidth variant="bordered">
                    View Profile
                  </Button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-default-500 col-span-full">No DAOs found.</p>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}


