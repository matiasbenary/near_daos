import React, { useCallback, useMemo, useReducer } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";

// Step placeholder child components
export const StepDaoInfoKYC: React.FC = () => (
  <Card className="min-h-48" radius="md" shadow="sm">
    <CardHeader className="font-semibold">DAO Info & KYC</CardHeader>
    <CardBody>
      <p className="text-sm text-default-500">
        Placeholder content for DAO Info & KYC step.
      </p>
    </CardBody>
  </Card>
);

export const StepLinksSocials: React.FC = () => (
  <Card className="min-h-48" radius="md" shadow="sm">
    <CardHeader className="font-semibold">Links & Socials</CardHeader>
    <CardBody>
      <p className="text-sm text-default-500">
        Placeholder content for Links & Socials step.
      </p>
    </CardBody>
  </Card>
);

export const StepCoolDown: React.FC = () => (
  <Card className="min-h-48" radius="md" shadow="sm">
    <CardHeader className="font-semibold">Cool Down Period</CardHeader>
    <CardBody>
      <p className="text-sm text-default-500">
        Placeholder content for Cool Down Period step.
      </p>
    </CardBody>
  </Card>
);

export const StepGroupsMembers: React.FC = () => (
  <Card className="min-h-48" radius="md" shadow="sm">
    <CardHeader className="font-semibold">Add Groups & Members</CardHeader>
    <CardBody>
      <p className="text-sm text-default-500">
        Placeholder content for Add Groups & Members step.
      </p>
    </CardBody>
  </Card>
);

export const StepProposalVoting: React.FC = () => (
  <Card className="min-h-48" radius="md" shadow="sm">
    <CardHeader className="font-semibold">
      Proposal & Voting Permission
    </CardHeader>
    <CardBody>
      <p className="text-sm text-default-500">
        Placeholder content for Proposal & Voting Permission step.
      </p>
    </CardBody>
  </Card>
);

export const StepQuorum: React.FC = () => (
  <Card className="min-h-48" radius="md" shadow="sm">
    <CardHeader className="font-semibold">Quorum</CardHeader>
    <CardBody>
      <p className="text-sm text-default-500">Placeholder content for Quorum step.</p>
    </CardBody>
  </Card>
);

export const StepDaoAssets: React.FC = () => (
  <Card className="min-h-48" radius="md" shadow="sm">
    <CardHeader className="font-semibold">DAO Assets</CardHeader>
    <CardBody>
      <p className="text-sm text-default-500">Placeholder content for DAO Assets step.</p>
    </CardBody>
  </Card>
);

// Types
interface WizardProps {
  onFinish?: () => void;
  className?: string;
}

interface WizardState {
  current: number; // index of step
  completed: boolean[]; // track completion status per step (placeholder logic)
  finished: boolean;
}

type WizardAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number }
  | { type: "FINISH" };

const STEPS = [
  { key: "dao_info_kyc", label: "DAO Info & KYC", Component: StepDaoInfoKYC },
  {
    key: "links_socials",
    label: "Links & Socials",
    Component: StepLinksSocials,
  },
  { key: "cool_down", label: "Cool Down Period", Component: StepCoolDown },
  {
    key: "groups_members",
    label: "Add Groups & Members",
    Component: StepGroupsMembers,
  },
  {
    key: "proposal_voting",
    label: "Proposal & Voting Permission",
    Component: StepProposalVoting,
  },
  { key: "quorum", label: "Quorum", Component: StepQuorum },
  { key: "dao_assets", label: "DAO Assets", Component: StepDaoAssets },
] as const;

const initialState: WizardState = {
  current: 0,
  completed: Array(STEPS.length).fill(false),
  finished: false,
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "NEXT": {
      const nextIndex = Math.min(state.current + 1, STEPS.length - 1);
      const completed = [...state.completed];
      completed[state.current] = true; // mark current as done when moving forward

      return { ...state, current: nextIndex, completed };
    }
    case "PREV": {
      const prevIndex = Math.max(state.current - 1, 0);

      return { ...state, current: prevIndex };
    }
    case "GO_TO": {
      // allow navigation only to already completed steps (excluding current) for now
      if (action.index === state.current) return state;
      if (!state.completed[action.index]) return state;

      return { ...state, current: action.index };
    }
    case "FINISH": {
      const completed = state.completed.map(() => true);

      return { ...state, finished: true, completed };
    }
    default:
      return state;
  }
}

export const Wizard: React.FC<WizardProps> = ({ onFinish, className }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { current, finished } = state;

  const totalSteps = STEPS.length;
  const progressValue = useMemo(
  () => (current / (totalSteps - 1)) * 100,
  [current, totalSteps],
  );

  const CurrentStepComponent = STEPS[current].Component;

  const handleNext = useCallback(() => {
    if (current === totalSteps - 1) {
      dispatch({ type: "FINISH" });
      onFinish?.();
    } else {
      dispatch({ type: "NEXT" });
    }
  }, [current, totalSteps, onFinish]);

  const handlePrev = useCallback(() => {
    dispatch({ type: "PREV" });
  }, []);

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Step indicator (desktop) */}
        <div className="hidden md:flex flex-col gap-3">
          <ol aria-label="Wizard steps" className="flex flex-wrap gap-2">
            {STEPS.map((s, idx) => {
              const isCurrent = idx === current;
              const isCompleted = state.completed[idx] || idx < current;
              const clickable = isCompleted && !isCurrent;
              
              return (
                <li key={s.key} className="flex">
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    className={[
                      "group flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : isCompleted
                          ? "border-success-300 bg-success-50 text-success-600 hover:bg-success-100"
                          : "cursor-not-allowed border-default-200 bg-default-100 text-default-400",
                    ].join(" ")}
                    disabled={!clickable}
                    type="button"
                    onClick={() => dispatch({ type: "GO_TO", index: idx })}
                  >
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold",
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCompleted
                            ? "border-success-500 bg-success-500 text-white"
                            : "border-default-300 bg-white text-default-500",
                      ].join(" ")}
                    >
                      {idx + 1}
                    </span>
                    <span className="whitespace-nowrap max-w-[10rem] truncate">
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <Progress aria-label="Wizard progress" value={progressValue} />
        </div>
        {/* Mobile progress + current label */}
        <div className="md:hidden space-y-2">
          <Progress aria-label="Wizard progress" value={progressValue} />
          <p className="text-center text-sm font-medium text-default-600">
            Step {current + 1} of {totalSteps}: {STEPS[current].label}
          </p>
        </div>

        {/* Current step content */}
        <CurrentStepComponent />

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 gap-3">
          <Button disabled={current === 0} variant="flat" onPress={handlePrev}>
            Previous
          </Button>

          {current === totalSteps - 1 ? (
            <Button color="success" onPress={handleNext}>
              Finish
            </Button>
          ) : (
            <Button color="primary" onPress={handleNext}>
              Next
            </Button>
          )}
        </div>

        {finished && (
          <Card className="border border-success-200 bg-success-50">
            <CardBody>
              <p className="font-medium text-success-600">
                Wizard complete! You can now submit or proceed with DAO creation
                logic.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Wizard;
