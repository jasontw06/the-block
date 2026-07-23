import type { AuctionStatus } from "../lib/auction";
import styles from "./AuctionStatusBadge.module.css";

type AuctionStatusBadgeProps = {
  status: AuctionStatus;
  label: string;
  detail: string;
  compact?: boolean;
};

export function AuctionStatusBadge({
  status,
  label,
  detail,
  compact = false,
}: AuctionStatusBadgeProps) {
  return (
    <div
      className={compact ? styles.compact : styles.block}
      data-status={status}
    >
      <span className={styles.badge} data-status={status}>
        {label}
      </span>
      <span className={styles.detail}>{detail}</span>
    </div>
  );
}
