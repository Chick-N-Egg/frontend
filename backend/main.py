import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

app = FastAPI(title="LaunchMap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

COMMUNITIES = json.loads(
    (Path(__file__).parent / "communities.json").read_text()
)["communities"]


class Startup(BaseModel):
    name: str
    description: str
    target_customer: str
    stage: str
    category: str


class PlaybookRequest(BaseModel):
    startup: Startup
    community_name: str
    community_platform: str
    community_description: str = ""


@app.get("/dashboard-stats")
def dashboard_stats():
    return {
        "communities_mapped": 2847,
        "startups_helped": 312,
        "avg_days_to_first_customer": 6.3,
    }


@app.post("/find-communities")
def find_communities(startup: Startup):
    catalog = [
        {
            "id": c["id"],
            "name": c["name"],
            "platform": c["platform"],
            "size": c["size"],
            "tags": c["tags"],
            "categories": c["categories"],
            "engagement": c["engagement"],
        }
        for c in COMMUNITIES
    ]

    prompt = f"""You are a GTM strategist. A founder gave you their startup details.
From the community catalog below, pick the 10 best-matching communities for finding
their first customers, ranked best-first.

Startup:
- Name: {startup.name}
- Description: {startup.description}
- Target customer: {startup.target_customer}
- Stage: {startup.stage}
- Category: {startup.category}

Community catalog (JSON array):
{json.dumps(catalog)}

Return strict JSON with this exact shape:
{{
  "communities": [
    {{
      "id": "<id from catalog>",
      "relevance_score": <int 0-100>,
      "icp_match": "<one sentence on why this community matches their target customer>",
      "engagement_level": "<Low|Medium|High|Very High>",
      "time_to_first_customer": "<e.g. '3-5 days'>"
    }}
  ]
}}
Order the array by relevance_score descending. Pick exactly 10."""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    ranked = json.loads(response.choices[0].message.content)["communities"]
    by_id = {c["id"]: c for c in COMMUNITIES}

    merged = []
    for r in ranked:
        base = by_id.get(r["id"])
        if not base:
            continue
        merged.append({**base, **r})

    return {"communities": merged}


@app.post("/generate-playbook")
def generate_playbook(req: PlaybookRequest):
    prompt = f"""You are a community growth expert. Write a first-touch activation
playbook for a founder entering a specific online community to find early customers.
The playbook must be value-first and never pitch the product directly in the first post.

Startup:
- Name: {req.startup.name}
- Description: {req.startup.description}
- Target customer: {req.startup.target_customer}
- Stage: {req.startup.stage}

Community: {req.community_name} ({req.community_platform})
Why it matches: {req.community_description}

Return strict JSON with this exact shape:
{{
  "community": "{req.community_name}",
  "platform": "{req.community_platform}",
  "week1_actions": ["<day-by-day action>", "..."],
  "kpis": {{"week1_target": "<e.g. '10 replies, 3 DMs'>", "conversion_goal": "<e.g. '5 beta signups'>"}},
  "dos": ["<short do>", "..."],
  "donts": ["<short don't>", "..."],
  "first_post": {{"title": "<post title>", "body": "<full post body, value-first, no pitch>", "post_type": "<e.g. 'question' or 'discussion'>"}},
  "first_dm_template": "<DM template for engaged members>",
  "insider_tip": "<one non-obvious tip for succeeding in this specific community>"
}}"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)
