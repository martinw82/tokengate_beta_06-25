Tokengate v1 – Full Web3 OAuth Provider Roadmap
###AGENT INSTRUCTIONS###
Every session is self-contained:

complete only the tasks listed
I log exact progress + what was tested
push each completed task to github including updated ROADMAP_AGENTS.md file
end each task with “Session X completed. All changes pushed to branch feature/session-X. Ready for restart.”

User will reply with “Start Session N” and you (agent) continue from there (no overlap, no assumptions).

continue reading below to see what task we are on
##############################################


Tech decisions locked in:

Frontend: Vite + React + TS (existing)
Wallet: wagmi + viem + WalletConnect + MetaMask (drop Pera)
Backend: new /server folder (Express + mysql2 + TiDB/MySQL compatible)
No Firebase, no Next.js
Unique gate IDs stored in MySQL
Multi-EVM chains first (Algorand ASA later if you ask)

SESSION PLAN (do in this exact order)

############first task is to check if task 1 is already done, scan the code and decide if it is done already or not#########
Session 1: Dependencies & Wallet Migration

Remove @perawallet/connect
Add: wagmi, viem, @tanstack/react-query, @walletconnect/modal, @wagmi/connectors, lucide-react (keep)
Create src/lib/wagmi.ts config (MetaMask + WalletConnect)
Update TokenGateForm preview to use new wallet connect button
Test: form still renders + connect works on localhost

Session 2: Backend Skeleton + MySQL Setup

Create /server folder
Add Express, mysql2, dotenv, cors, helmet
server/index.ts + server/db.ts (TiDB/MySQL connection pool)
server/.env.example (DB creds)
Package scripts: dev:server and dev (concurrently)
Test: backend runs on port 3001, DB connects

Session 3: Database Schema & Basic API

Create gates table (id, config JSON, created_at, updated_at)
API:
POST /api/gates → create gate → return short ID
GET /api/gates/:id → return full config

Add rate limiting + CORS
Test with Postman/curl

Session 4: Update Creator Form & Code Generator

Connect form to backend API (save gate)
Replace old query-param URL with /gate/{id}
Update CodeDisplay.tsx to show three embed options (iframe, JS SDK stub, WP shortcode)
Generate unique short link
Test: full create → get ID → copy embed works

Session 5: Gate Validation Page (/gate/:id)

New route src/pages/Gate.tsx (React Router)
Fetch config from /api/gates/:id
Use wagmi hooks: useConnect, useAccount, useChainId
UI: connect button + loading + success/fail
Stub action for now
Test: open /gate/abc123 → wallet connects

Session 6: Real On-Chain Token Checks

Add viem public client per chain
Functions: check ERC-20 balance, ERC-721 ownership, ERC-1155 balance
Support 5 major chains (ETH, Base, Polygon, Arbitrum, Optimism) via wagmi
Update Gate.tsx to run check after connect
Test with real testnet tokens

Session 7: Action Execution & Unlock Logic

Read actionType + actionValue from config
Implement: redirect, show message, unlock content (replace placeholder)
Add “locked” overlay + success state
Test all three actions

Session 8: JavaScript SDK + Embed Polish

Create public/sdk.js (vanilla JS wrapper)
Full iframe + SDK + WordPress shortcode examples in CodeDisplay
Add TokenGate.init({ gateId, container })
Test embeds on a blank HTML page

Session 9: WordPress Plugin Completion

Finish wordpress-plugin/tokengate/tokengate.php
Shortcode [tokengate id="abc123"] that outputs correct iframe
Admin settings page stub
Test in local WP

Session 10: Polish, Security & Final Tests

Error boundaries, loading states, toast notifications
Input sanitization + rate limits on API
Responsive UI fixes
Full end-to-end test script
README + deploy notes (Vercel frontend + Render backend)

Session 11: Cleanup & Handover

Remove dead code
Final git commit
Full project summary + next steps (deploy, monitoring, etc.)
