# Chick — product spec

## Overview

Chick is a GTM discovery tool for early-stage founders. Most tools in this space (Apollo, Clay, Apify, etc.) assume the user already knows their ideal customer profile. Early-stage founders don't — they have a hunch, not a confirmed audience. Chick is built for that earlier, uncertain stage: it takes a rough idea, finds real communities, companies, and people worth talking to first, ranks them by how likely they are to actually respond, and gets sharper with every outreach attempt logged.

**One-line pitch:** Before you have an ICP, you have a hunch — Chick finds out where it lives.

## The core insight

Founders trying to validate an idea don't fail because the data they can access is wrong. Apollo, Clay, and Apify all work fine — the problem is they're built for a later stage, when you already know who you're looking for. Pre-validation, that confidence doesn't exist yet, so every search comes back too broad, and founders end up manually stitching together vague database searches, scraping, and scrolling communities by hand with no coherent strategy and nothing tracked. Chick's job is to be the tool for that specific, underserved stage.

## Target user

Pre-seed and early-stage founders, indie hackers, hackathon builders, first-time founders — anyone who needs to find and validate with real early users before they have a confirmed target customer profile.

## Core product flow

### Step 1 — Tell us
User describes their idea in plain language, not a form. The AI asks one sharpening follow-up question, then shows a structured summary back (audience segment, product type, stage) as editable chips so the user can correct anything before proceeding. This confirmation step matters — it's the moment that separates Chick from tools that assume a confident, already-correct input.

### Step 2 — We look (discovery)
Based on the confirmed brief, the tool searches for real Discord servers, subreddits, Facebook groups, companies, and individuals that match each audience segment. Company/entity data should come from verified, sourced data rather than model-generated guesses.

### Step 3 — Confidence scoring
Every result is scored on three axes:
- **Reach** — how many relevant people are actually there
- **Receptiveness** — will this space welcome outreach, or penalize/ban it
- **Warmth** — cold list vs. some existing foothold or context

Results are sorted by a weighted combination of these three, with the top result visually flagged as the "best shot." Every result should show a one-line "why this fits" reasoning, not just a name.

### Step 4 — Strategy and outreach
For the selected result, the tool recommends the specific right approach for that channel (comment first vs. direct DM vs. open post) and drafts a ready-to-edit outreach message matching that approach and channel norms.

### Step 5 — Tracking and refinement
Every outreach attempt gets logged: channel, message used, and outcome (no response / declined / interested / signed up / paying customer, with an optional revenue amount for paying outcomes). Outcomes feed back into the confidence scoring model so future recommendations improve — this closed loop is the product's core differentiator, not a nice-to-have.

## Data model

```
Brief
- id
- raw_input (string, the user's original description)
- product_summary (string, extracted)
- audience_segments (array of strings)
- stage (enum: idea | mvp | early-traction)
- created_at

Result
- id
- brief_id (fk)
- channel_type (enum: discord | reddit | facebook_group | company | individual)
- name (string)
- url
- why_it_fits (string, one-line reasoning)
- reach_score (1-5)
- receptiveness_score (1-5)
- warmth_score (1-5)
- confidence_total (computed, weighted sum of the three)
- source (enum: verified_data | web_search | manual)
- suggested_approach (string)
- draft_message (string)

Attempt
- id
- result_id (fk)
- message_sent (string, editable copy of the draft)
- outcome (enum: no_response | declined | interested | signed_up | paying)
- revenue (number, optional, only relevant for paying outcome)
- notes (string, optional)
- logged_at
```

## Scoring logic (v1, rule-based — not ML)

```
confidence_total = (reach_score * 0.3) + (receptiveness_score * 0.4) + (warmth_score * 0.3)
```

Receptiveness is weighted highest because a high-reach, low-receptiveness channel (e.g. posting cold in a subreddit that bans self-promotion) actively wastes the attempt and can burn the account/community relationship — the cost of a wrong approach is higher than the cost of a missed high-reach opportunity.

## Dashboard / tracking view

Once attempts are logged, the dashboard shows:
- **KPIs** — total attempts, response rate, sign-ups, revenue
- **Growth over time** — sign-ups and revenue trend
- **Funnel** — attempts → interested → signed up → paying, showing drop-off at each stage
- **Performance by channel type** — attempts, response rate, sign-ups, and revenue broken out by community / company / individual
- **Recent attempts log** — full history, most recent first
- **Refinement insight** — a plain-language summary of what's working (e.g. "communities are converting at X% vs Y% for cold email — future suggestions are weighted toward communities"), generated once there's enough logged data (3+ attempts minimum)

## Out of scope for MVP (roadmap only)

- Physical location / event discovery
- Instagram-specific community discovery beyond general search
- Cross-user aggregated pattern learning (the long-term data moat — requires real usage volume)
- Continuous re-scraping / live activity monitoring of discovered channels
- Voice-based intake

## Brand and design reference

- **Palette:** warm plaster background (`#F5EFE5`), terracotta accent (`#C15F3C`), deep rust (`#8E3E27`), muted olive as a rare third accent (`#767B54`), warm brown-black ink for text (`#2E241A`) — no pure black, no cold grays
- **Typography:** Fraunces (serif, display) paired with Work Sans (body/UI)
- **Tone:** grounded, plain-spoken, no corporate SaaS jargon ("leverage," "unlock," "seamless")
- Full landing page and interactive app prototype exist as reference HTML builds — see `/design` if included in this repo, or request from [team member] if not yet added.

## Why this matters (for pitch reference)

CB Insights' analysis of startup failures found that lack of market need/validation is the single leading cause of failure. Roughly 137,000 startups are created daily worldwide (Global Entrepreneurship Monitor), and the vast majority never systematically validate before building further. Existing sales intelligence tools (a market sized at $5.37B in 2026, headed toward $12.45B by 2034) are built for teams that already know their ICP — none serve the earlier, uncertain validation stage that Chick targets.
