/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  SingleReleaseEscrow,
  MultiReleaseEscrow,
  InitializeSingleReleaseEscrowResponse,
  InitializeMultiReleaseEscrowResponse,
  UpdateSingleReleaseEscrowResponse,
  UpdateMultiReleaseEscrowResponse,
  MultiReleaseMilestone,
  SingleReleaseMilestone,
  GetEscrowsFromIndexerResponse,
} from "@trustless-work/escrow/types";

/**
 * Builds a Single Release Escrow object from an InitializeSingleReleaseEscrowResponse, this structure is
 * used to create a new escrow based on the Escrow's entity
 */
export const buildSingleEscrowFromResponse = (
  result:
    | InitializeSingleReleaseEscrowResponse
    | UpdateSingleReleaseEscrowResponse,
  walletAddress: string
): SingleReleaseEscrow => ({
  contractId: result.contractId,
  signer: walletAddress || "",
  balance: 0,
  engagementId: result.escrow.engagementId,
  title: result.escrow.title,
  description: result.escrow.description,
  amount: result.escrow.amount,
  platformFee: result.escrow.platformFee,
  receiverMemo: result.escrow.receiverMemo ?? 0,
  roles: {
    approver: result.escrow.roles.approver,
    serviceProvider: result.escrow.roles.serviceProvider,
    platformAddress: result.escrow.roles.platformAddress,
    releaseSigner: result.escrow.roles.releaseSigner,
    disputeResolver: result.escrow.roles.disputeResolver,
    receiver: result.escrow.roles.receiver,
  },
  flags: {
    disputed: false,
    released: false,
    resolved: false,
  },
  trustline: {
    address: result.escrow.trustline.address,
  },
  milestones: result.escrow.milestones.map((m: SingleReleaseMilestone) => ({
    description: m.description,
    evidence: "",
    approved: false,
    status: "pending",
  })),
});

/**
 * Builds a Multi Release Escrow object from an InitializeMultiReleaseEscrowResponse, this structure is
 * used to create a new escrow based on the Escrow's entity
 */
export const buildMultiEscrowFromResponse = (
  result:
    | InitializeMultiReleaseEscrowResponse
    | UpdateMultiReleaseEscrowResponse,
  walletAddress: string
): MultiReleaseEscrow => ({
  contractId: result.contractId,
  signer: walletAddress || "",
  balance: 0,
  engagementId: result.escrow.engagementId,
  title: result.escrow.title,
  description: result.escrow.description,
  platformFee: result.escrow.platformFee,
  receiverMemo: result.escrow.receiverMemo ?? 0,
  roles: {
    approver: result.escrow.roles.approver,
    serviceProvider: result.escrow.roles.serviceProvider,
    platformAddress: result.escrow.roles.platformAddress,
    releaseSigner: result.escrow.roles.releaseSigner,
    disputeResolver: result.escrow.roles.disputeResolver,
    receiver: result.escrow.roles.receiver,
  },
  trustline: {
    address: result.escrow.trustline.address,
  },
  milestones: result.escrow.milestones.map((m: MultiReleaseMilestone) => ({
    description: m.description,
    evidence: "",
    amount: m.amount,
    flags: {
      approved: false,
      disputed: false,
      released: false,
      resolved: false,
    },
  })),
});

/**
 * Normalize an Indexer escrow response to the InitializeEscrowResponse shape
 * expected by the builder helpers above.
 */
export const normalizeIndexerToInitializeResponse = (
  indexer: GetEscrowsFromIndexerResponse
):
  | InitializeSingleReleaseEscrowResponse
  | InitializeMultiReleaseEscrowResponse => {
  const commonEscrowFields = {
    engagementId: indexer.engagementId,
    title: indexer.title,
    description: indexer.description,
    platformFee: indexer.platformFee ?? 0,
    receiverMemo: indexer.receiverMemo ?? 0,
    roles: {
      approver: indexer.roles.approver,
      serviceProvider: indexer.roles.serviceProvider,
      platformAddress: indexer.roles.platformAddress,
      releaseSigner: indexer.roles.releaseSigner,
      disputeResolver: indexer.roles.disputeResolver,
      receiver: indexer.roles.receiver,
    },
    trustline: {
      address: indexer.trustline.address,
      // Default decimals if not provided by indexer
      decimals: 10000000,
    },
  };

  if (indexer.type === "single-release") {
    return {
      contractId: indexer.contractId,
      escrow: {
        ...commonEscrowFields,
        amount: (indexer as any).amount ?? 0,
        milestones: (indexer.milestones || []).map((m: any) => ({
          description: m.description,
        })),
      },
    } as unknown as InitializeSingleReleaseEscrowResponse;
  }

  return {
    contractId: indexer.contractId,
    escrow: {
      ...commonEscrowFields,
      milestones: (indexer.milestones || []).map((m: any) => ({
        description: m.description,
        amount: m.amount ?? 0,
      })),
    },
  } as unknown as InitializeMultiReleaseEscrowResponse;
};
