import { vehicles as baseVehicles } from "../data/vehicles";
import { buildAuctionBounds } from "./auction";

export const auctionBounds = buildAuctionBounds(baseVehicles);

/** Fixed at module load so normalized windows do not slide every tick. */
export const auctionNormalizationAnchor = Date.now();
