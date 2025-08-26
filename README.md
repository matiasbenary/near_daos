# NEAR DAO Management Interface

A Next.js application for managing and interacting with NEAR Protocol DAOs (Decentralized Autonomous Organizations). This interface allows users to view DAO information, browse proposals, and participate in governance activities.

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started) - React framework with pages directory
- [HeroUI](https://heroui.com) - Modern React UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Tailwind Variants](https://tailwind-variants.org) - Type-safe variant API for Tailwind CSS
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [Framer Motion](https://www.framer.com/motion) - Animation library
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [NEAR Wallet Selector](https://github.com/near/wallet-selector) - NEAR Protocol wallet integration
- [@near-js/tokens](https://www.npmjs.com/package/@near-js/tokens) - NEAR token utilities

## Custom Hooks with NEAR Requests

This application includes several custom hooks that handle NEAR Protocol smart contract interactions:

### `useDAOInfo`

Fetches and manages DAO configuration and policy information.

**Purpose**: Retrieves essential DAO metadata including name, purpose, council members, and governance settings.

**NEAR Contract Methods Called**:

- `get_config()` - Fetches DAO configuration (name, purpose, metadata)
- `get_policy()` - Retrieves governance policy (roles, voting rules, proposal requirements)

**Returns**:

```typescript
{
  daoInfo: DAOInfo | null  // Complete DAO information object
}
```

**Example Usage**:

```typescript
const { daoInfo } = useDAOInfo(daoAddress);
// daoInfo contains: contract, name, description, logo, cover, bond, councilMembers, etc.
```

### `useProposals`

Manages proposal fetching with pagination support.

**Purpose**: Loads and paginates DAO proposals with real-time updates.

**NEAR Contract Methods Called**:

- `get_proposals(from_index, limit)` - Fetches paginated proposals
- `get_last_proposal_id()` - Gets total proposal count for pagination

**Returns**:

```typescript
{
  proposals: Proposal[],           // Current page of proposals
  isLoadingProposals: boolean,     // Loading state
  currentPage: number,             // Current pagination page
  setCurrentPage: (page: number) => void,  // Page navigation
  totalProposals: number,          // Total proposal count
  proposalsPerPage: number,        // Items per page (9)
  updateProposals: () => Promise<void>     // Manual refresh function
}
```

**Example Usage**:

```typescript
const { 
  proposals, 
  isLoadingProposals, 
  currentPage, 
  setCurrentPage,
  updateProposals 
} = useProposals(daoAddress);
```

### `useVoting`

Handles proposal voting functionality and user vote status.

**Purpose**: Manages voting actions and tracks user voting permissions and history.

**NEAR Contract Methods Called**:

- `act_proposal(id, action)` - Submits votes (VoteApprove, VoteReject, VoteRemove)

**Parameters**:

- `dao` - DAO contract address
- `councilMembers` - Array of council member addresses  
- `updateView` - Callback to refresh proposals after voting

**Returns**:

```typescript
{
  votingProposalId: number | null,                    // Currently voting proposal ID
  handleVote: (proposalId: number, vote: VoteOption) => Promise<void>,  // Vote submission
  hasUserVoted: (proposal: Proposal) => boolean,      // Check if user voted
  getUserVote: (proposal: Proposal) => VoteOption | null,  // Get user's vote
  canUserVote: (proposal: Proposal) => boolean        // Check voting permissions
}
```

**Vote Options**: `"Approve"` | `"Reject"` | `"Remove"`

**Example Usage**:

```typescript
const { 
  handleVote, 
  canUserVote, 
  hasUserVoted,
  votingProposalId 
} = useVoting(daoAddress, councilMembers, updateProposals);

// Vote on a proposal
await handleVote(proposalId, "Approve");

// Check permissions
if (canUserVote(proposal)) {
  // Show voting UI
}
```

## Request Flow Architecture

The hooks implement a clear separation of concerns:

1. **View Functions** (`viewFunction`): Read-only calls to NEAR contracts for data fetching
2. **Call Functions** (`callFunction`): State-changing transactions that require wallet signatures
3. **Error Handling**: All hooks include try-catch blocks with graceful fallbacks
4. **Loading States**: UI feedback during async operations
5. **Automatic Updates**: Hooks automatically refresh data when dependencies change

## Data Types

Key TypeScript interfaces for NEAR contract interactions:

- `DAOInfo` - Complete DAO metadata and configuration
- `Proposal` - Individual governance proposals with voting data
- `Policy` - DAO governance rules and member roles  
- `VoteOption` - Voting choices (Approve/Reject/Remove)
- `ProposalKind` - Different proposal types (Transfer, FunctionCall, AddMember, etc.)

## Project Structure

```text
components/
├── DetailDao/          # DAO-specific UI components
│   ├── CreateProposal/ # Proposal creation forms
│   └── ...
hooks/                  # Custom React hooks for NEAR integration
├── useDAOInfo.ts      # DAO metadata fetching
├── useProposals.ts    # Proposal management with pagination
└── useVoting.ts       # Voting functionality
types/
└── index.ts           # TypeScript definitions for NEAR contracts
utils/                 # Helper functions
├── proposalFormatting.ts
└── time.ts
```

## Getting Started

### Installation

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Development

```bash
npm run dev
```

### pnpm Setup (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## How to Use

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-pages-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-pages-template/blob/main/LICENSE).
