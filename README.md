# takeaseat devops-skills

> Agent skills that make Claude Code (and other AI coding agents) genuinely better at
> infrastructure, scheduling, and configuration work. Battle-tested, zero-dependency,
> no telemetry.

## What's in here

A growing collection of focused skills for the tedious, error-prone parts of DevOps —
the config that silently breaks at 3am, the cron schedule that never fires, the env
drift between staging and prod.

Each skill is a self-contained folder with a `SKILL.md` (instructions + metadata) and,
where useful, zero-dependency scripts and reference docs the agent loads on demand.

### Skills

| Skill | What it does | Status |
|-------|-------------|--------|
| `cron-doctor` | Diagnose cron expressions — impossible schedules, OR-semantics traps, midnight spikes, drift | **free** |
| `env-drift-hunter` | Find env var drift across `.env` files before deploy (12-language scan) | **free** |
| `dockerfile-auditor` | Audit Dockerfiles for layer bloat, cache misses, security smells | **pro** |
| `ci-pipeline-doctor` | Diagnose CI/CD pipeline failures, flaky tests, slow stages | **pro** |
| `k8s-manifest-linter` | Lint Kubernetes manifests for best practices + common pitfalls | **pro** |
| `secret-scanner` | Scan repos for leaked secrets before they hit git history | **pro** |

## Install

```bash
# Clone into your Claude skills directory
git clone https://github.com/takeaseatventure/devops-skills.git
cp -r devops-skills/skills/* ~/.claude/skills/

# Or, if you use Claude Code's plugin system:
# See skills.sh for one-click install
```

Each skill folder follows the [Agent Skills spec](https://agentskills.io):
a `SKILL.md` with YAML frontmatter, plus optional `scripts/` and `reference/` dirs.

## Why these skills exist

DevOps work is full of "silent failures" — things that pass every check until they
don't. A cron expression like `0 0 30 2 *` is syntactically valid but **never fires**
(February has no 30th). An env file that's missing `SENTRY_DSN` in local won't error
until production crashes. These skills teach your AI agent to catch these *before*
they ship.

The cron engine alone (`cron-doctor/scripts/cron-engine.js`) is 638 lines of
battle-tested, zero-dependency code with 69 passing tests. It's the same engine
powering our [Cron Helper VS Code extension](https://marketplace.visualstudio.com/items?itemName=takeaseat-venture.cron-helper)
and [cron validation API](https://cron-api-six.vercel.app).

## Pro tier

The Pro skills (`dockerfile-auditor`, `ci-pipeline-doctor`, `k8s-manifest-linter`,
`secret-scanner`) are available with an All-Access Pro license. They add deeper
analysis, CI integration, and team workflows.

👉 **[Get Pro — $8/mo](https://takeaseatventure.com/pro)** — unlocks every Pro skill
plus all five takeaseat VS Code extensions and the cron API.

## License

The free skills are MIT licensed. The Pro skills are source-available under the Pro
license (see each skill's `LICENSE`).

---

Built by [takeaseat](https://takeaseatventure.com) — your config, made legible.
