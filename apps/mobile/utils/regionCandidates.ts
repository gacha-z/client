import type { RegionCandidate, RegionCandidateSlot } from '@/types';

export const createRegionCandidateSlots = (candidates: RegionCandidate[]): RegionCandidateSlot[] =>
  candidates.map((region, index) => ({
    id: `candidate-slot-${index + 1}`,
    region,
    rerollUsed: false
  }));

export const findUnusedRegionCandidate = (
  slots: RegionCandidateSlot[],
  replacements: RegionCandidate[]
) => {
  const usedRegionIds = new Set(slots.map(({ region }) => region.id));
  return replacements.find(({ id }) => !usedRegionIds.has(id));
};

export const replaceRegionCandidateSlot = (
  slots: RegionCandidateSlot[],
  slotId: string,
  replacement: RegionCandidate
) =>
  slots.map((slot) =>
    slot.id === slotId ? { ...slot, region: replacement, rerollUsed: true } : slot
  );
