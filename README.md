<p align="center">
  <img src="docs/the_block_repo.png" alt="The Block challenge hero image" width="960" />
</p>

# The Block

Buyer-side vehicle auction prototype for the OPENLANE coding challenge.

## How to Run

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, typically http://localhost:5173/.

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
npm test
npm run test:watch
```

## Time Spent

I stayed within the challenge time box and built in thin vertical slices: app shell → inventory browse → search/filter/sort → detail → bidding → auction status → polish → load more → tests. That kept each piece reviewable and avoided spending the whole budget on setup.

## Assumptions and Scope

**Included**
- Browse, search, filter, and sort inventory from `data/vehicles.json`
- Vehicle detail with gallery, specs, condition, seller info, and pricing
- Local bidding with shared state, validation, and `localStorage` persistence
- Normalized auction status (Upcoming / Live / Ended) relative to “now”
- Load more on inventory (24 at a time)
- Responsive layout for desktop and mobile
- Automated Vitest coverage for core bidding, auction, inventory, and persistence logic

**Skipped / simplified**
- No auth, payments, checkout, or seller tools
- No backend or real-time multi-bidder sync
- Bids are simulated in the browser only
- Auction timestamps are synthetic; they are remapped around the current time so the demo has a mix of upcoming, live, and ended lots
- Fixed bid increment of CAD $250

## Stack

- **Frontend:** React 19, TypeScript, Vite, React Router
- **Styling:** CSS Modules + shared design tokens
- **Testing:** Vitest, jsdom, React Testing Library
- **Backend:** None (frontend-only prototype)
- **Database:** None — static JSON plus local bid overlays

## What I Built

A buyer auction flow:

1. Browse inventory with cards and load more
2. Narrow results with search, filters, and sort
3. Open a lot detail page and inspect photos, condition, and pricing
4. Place a bid when the auction is live
5. See the updated bid and bid count immediately on both detail and inventory pages, with the state preserved after refresh

Shared inventory state keeps list and detail in sync. Bid overrides are persisted separately from the base dataset so reloads do not double-count bids.

## Notable Decisions

- **Frontend-only.** Fits the prototype scope and keeps setup trivial for reviewers.
- **Context + reducer for inventory.** Enough shared state for bidding without adding Redux/Zustand.
- **Persist bid overrides, not the full catalog.** Storage key `openlane-auction-bids:v1` stores `currentBid` and `additionalBidCount` per vehicle.
- **Normalize auction times once at load.** Preserves relative order, maps the dataset into a ±24h window, and uses a 2-hour auction duration so status can change during a session.
- **Gate bidding in both UI and store.** Non-live lots cannot place bids even if `placeBid` is called directly.
- **Pure helpers for search/sort/bid/auction rules.** Keeps page components thin and logic easier to explain in a walkthrough.
- **Load more instead of full dump.** Initial 24 cards keeps the first screen manageable without infinite scroll complexity.

## Testing

Automated tests (`npm test`) cover:

- Bid minimums and validation
- Auction status boundaries and closed-bidding messages
- Inventory search, AND filters, sorting, and immutability
- Bid override persistence and safe handling of corrupted storage
- Critical UI: detail route, not-found state, bid form feedback, disabled auction states, inventory card bid updates

Also verified manually for search/filter flows, gallery, load more, and desktop/mobile layout, plus `npm run lint` and `npm run build`.

## What I'd Do With More Time

- Expand component coverage around inventory controls and load more
- Watchlist / “your bids” view
- Stronger image handling (real assets, better fallbacks)
- Optional buy-now flow as a separate path
- Light analytics around search usage and drop-off on detail

---

Original challenge brief: see [`CHALLENGE.md`](./CHALLENGE.md).
