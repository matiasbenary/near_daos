import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

interface DAOInfo {
  name: string;
  bond: string;
  votingTime: string;
  councilMembers: string[];
}

interface DAOHeaderProps {
  daoInfo: DAOInfo;
  onCreateProposal: () => void;
}

export default function DAOHeader({
  daoInfo,
  onCreateProposal,
}: DAOHeaderProps) {
  return (
    <Card className="w-full max-w-2xl bg-content1/80 backdrop-blur-sm shadow-lg">
      <CardBody className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-6 capitalize">
          {daoInfo.name}.dao.poolparty.near
        </h1>

        <p className="text-foreground/70 mb-8 text-lg">
          The current bond is{" "}
          <span className="text-primary font-semibold">{daoInfo.bond}</span>
          and the voting time for proposals is{" "}
          <span className="text-primary font-semibold">
            {daoInfo.votingTime}
          </span>
          .
        </p>

        {/* Council Members */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Council Members
          </h2>
          <div className="space-y-2">
            {daoInfo.councilMembers.map((member, index) => (
              <div key={index} className="text-foreground font-medium">
                {member}
              </div>
            ))}
          </div>
        </div>

        {/* Create Proposal Button */}
        <div className="space-y-4">
          <Button
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 transition-all duration-200"
            size="lg"
            onPress={onCreateProposal}
          >
            Create a proposal
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
