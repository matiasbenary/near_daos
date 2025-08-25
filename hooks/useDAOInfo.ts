import { useEffect, useState } from "react";

import { DAOInfo } from "@/types";

export function useDAOInfo(dao: string | string[] | undefined) {
  const [daoInfo, setDaoInfo] = useState<DAOInfo | null>(null);

  useEffect(() => {
    if (dao && typeof dao === "string") {
      const mockDaoInfo: DAOInfo = {
        name: dao,
        bond: "1 N",
        votingTime: "7 days",
        councilMembers: ["gagdiez.near"],
      };

      setDaoInfo(mockDaoInfo);
    }
  }, [dao]);

  return { daoInfo };
}
