import { useEffect, useState } from "react";
import { useWalletSelector } from "@near-wallet-selector/react-hook";
import { NEAR } from "@near-js/tokens";

import { DAOInfo, Config, Policy } from "@/types";

export function useDAOInfo(dao: string | string[] | undefined) {
  const [daoInfo, setDaoInfo] = useState<DAOInfo | null>(null);
  const { viewFunction } = useWalletSelector();

  useEffect(() => {
    if (!dao || typeof dao !== "string") return;

    const fetchDAOData = async () => {
      const [config, policy] = await Promise.all([
        // example of config:
        // {
        //     "name": "maguila",
        //     "purpose": "test",
        //     "metadata": "eyJkaXNwbGF5TmFtZSI6Ik1hZ3VpbGEiLCJmbGFnTG9nbyI6Imh0dHBzOi8vaXBmcy5uZWFyLnNvY2lhbC9pcGZzL2JhZmtyZWlic2tpdnNuc2ZrbnlqNmh3eWtmeW1obXJ3YnRmZWVzdGYyNGpkdTZta2ZtY2t3ZHA1Z2xxIiwiZmxhZ0NvdmVyIjoiaHR0cHM6Ly9pcGZzLm5lYXIuc29jaWFsL2lwZnMvYmFma3JlaWJza2l2c25zZmtueWo2aHd5a2Z5bWhtcndidGZlZXN0ZjI0amR1Nm1rZm1ja3dkcDVnbHEifQ=="
        // }
        viewFunction({
          contractId: dao,
          method: "get_config",
          args: {},
        }) as Promise<Config>,
        // example of policy:
        // {
        //     "roles": [
        //         {
        //             "name": "all",
        //             "kind": "Everyone",
        //             "permissions": [
        //                 "*:AddProposal"
        //             ],
        //             "vote_policy": {}
        //         },
        //         {
        //             "name": "council",
        //             "kind": {
        //                 "Group": [
        //                     "maguila.testnet",
        //                     "gagdiez.testnet"
        //                 ]
        //             },
        //             "permissions": [
        //                 "*:Finalize",
        //                 "*:AddProposal",
        //                 "*:VoteApprove",
        //                 "*:VoteReject",
        //                 "*:VoteRemove"
        //             ],
        //             "vote_policy": {}
        //         }
        //     ],
        //     "default_vote_policy": {
        //         "weight_kind": "RoleWeight",
        //         "quorum": "0",
        //         "threshold": [
        //             1,
        //             2
        //         ]
        //     },
        //     "proposal_bond": "1000000000000000000000000",
        //     "proposal_period": "604800000000000",
        //     "bounty_bond": "1000000000000000000000000",
        //     "bounty_forgiveness_period": "86400000000000"
        // }
        viewFunction({
          contractId: dao,
          method: "get_policy",
          args: {},
        }) as Promise<Policy>,
      ]);

      //   example of metadata:
      // {"displayName":"Maguila","flagLogo":"https://ipfs.near.social/ipfs/bafkreibskivsnsfknyj6hwykfymhmrwbtfeestf24jdu6mkfmckwdp5glq","flagCover":"https://ipfs.near.social/ipfs/bafkreibskivsnsfknyj6hwykfymhmrwbtfeestf24jdu6mkfmckwdp5glq"}
      const metadata = config.metadata
        ? JSON.parse(atob(config.metadata))
        : null;

      // Find council role and extract members
      const councilRole = policy.roles.find((role) => role.name === "council");
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
    };

    fetchDAOData();
  }, [dao]);

  return { daoInfo };
}
