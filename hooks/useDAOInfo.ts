import { useEffect, useState } from "react";
import { useWalletSelector } from "@near-wallet-selector/react-hook";
import { NEAR } from "@near-js/tokens";

import { DAOInfo, Config, Policy } from "@/types";

export function useDAOInfo(dao: string | string[] | undefined) {
  const [daoInfo, setDaoInfo] = useState<DAOInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { viewFunction } = useWalletSelector();

  useEffect(() => {
    if (!dao || typeof dao !== "string") return;

    const fetchDAOData = async () => {
      setLoading(true);
      setError(null);
      setDaoInfo(null);

      try {
        const [config, policy] = await Promise.all([
          viewFunction({
            contractId: dao,
            method: "get_config",
            args: {},
          }) as Promise<Config>,
          viewFunction({
            contractId: dao,
            method: "get_policy",
            args: {},
          }) as Promise<Policy>,
        ]);

        //   example of metadata:
        const metadata = config.metadata
          ? JSON.parse(atob(config.metadata))
          : null;

        // Find council role and extract members
        const councilRole = policy.roles.find(
          (role) => role.name === "council",
        );
        const councilMembers =
          councilRole &&
          typeof councilRole.kind === "object" &&
          "Group" in councilRole.kind
            ? councilRole.kind.Group
            : [];

        const daoInfo: DAOInfo = {
          contract: dao,
          name: config.name,
          description: config.purpose,
          organizationName: metadata?.displayName || config.name,
          logo: metadata?.flagLogo || null,
          cover: metadata?.flagCover || null,
          bond: NEAR.toDecimal(policy.proposal_bond),
          proposalPeriod: BigInt(policy.proposal_period),
          councilMembers,
        };

        setDaoInfo(daoInfo);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch DAO data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDAOData();
  }, [dao, viewFunction]);

  return { daoInfo, loading, error };
}
