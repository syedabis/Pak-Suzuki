import type React from "react";

import type { OrderFilter } from "./schema";

export function formatOrderCount(filter: OrderFilter, count: number) {
  const visitLabel = count === 1 ? "doorstep record" : "doorstep records";

  if (filter === "All") {
    return `${count.toLocaleString()} ${visitLabel}`;
  }

  return `${count.toLocaleString()} ${filter.toLowerCase()} ${visitLabel}`;
}

export function formatSelectedOrderCount(count: number) {
  const orderLabel = count === 1 ? "record" : "records";

  return `${count.toLocaleString()} ${orderLabel} selected`;
}

export function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}
