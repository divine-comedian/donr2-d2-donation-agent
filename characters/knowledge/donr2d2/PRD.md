# DONR2-D2: Autonomous Donation Agent for Public Goods on Polygon

## 🌟 Product Overview

**DONR2-D2** is a crypto-native donation agent designed to autonomously evaluate and fund public goods projects using a structured, data-driven approach. Built on the Polygon network, it taps into Giveth’s donation ecosystem and distributes funds based on a mix of algorithmic scoring, on-chain reputation (via GIVpower), and social activity. In parallel, DONR2-D2 builds a public-facing personality by posting about its actions, boosting the visibility of supported projects and inviting more donors into the regenerative economy.

## 🧩 Problem Statement

Traditional funding methods for public goods fail to scale, leaving many impactful projects underfunded or forced to focus on marketing over mission. Current issues include:

- Inconsistent and unreliable donation streams
- Donor uncertainty about project legitimacy and impact
- Limited visibility for high-quality, grassroots initiatives

## 🚀 Solution

DONR2-D2 offers:

- **Automated Evaluation**: Assessing projects across platform metrics, social reach, and quality indicators
- **Fair Fund Distribution**: Re-allocating received donations weekly to top-scoring projects on Polygon
- **Public Recognition**: Generating accurate, AI-composed tweets to promote funded projects and build trust

---

## 🔧 Technical Architecture

### AI Agent Stack

- **Framework**: Built with the [Eliza AI agent framework](https://elizaos.com/), enabling programmable, composable agent behavior. ([https://elizaos.com/](https://elizaos.com/))
- **Memory & Storage**: Uses a Supabase instance for persistent memory, storing:
    - Giveth project data and assessments
    - Project donation history
    - Social media interaction artifacts (tweets, replies, etc.)

### Evaluation System

DONR2-D2 evaluates the **top 50 Giveth projects by GIVpower rank** daily and scores them based on:

### 🔹 Giveth Internal Quality Score (20%)

- Length of project description
- Custom banner image usage
- Total donation volume
- Frequency of project updates

### 🔹 DONR2-D2 Project Detail Assessment (30%)

- Quality and clarity of description
- Content of most recent update
- Presence of recipient addresses on multiple chains
- Website link
- Geolocation or impact region specified
- Whether the project is GIVbacks-eligible

### 🔹 Social Media Signal Check (30%)

- Number of verified social handles provided (Twitter, Farcaster, Instagram, Reddit, YouTube)
- Frequency and quality of posts on Twitter and Farcaster
- Relevance of recent updates to project mission

### 🔹 GIVpower Relative Rank (20%)

- Based on staking support by the community via GIVpower

---

## 🔄 Donation Distribution Logic

1. DONR2-D2 receives donations to its project on [Giveth](https://giveth.io/) ([https://giveth.io/](https://giveth.io/))
2. Funds are bridged and swapped into $GIV on Polygon
3. A **daily cron job** triggers:
    - Fetching top 50 GIVpower projects
    - Scoring all eligible projects
    - Distributing 5% of DONR2-D2’s pool to top recipients (via their Polygon addresses)
    - Generating and publishing tweets promoting each donation

All transactions, scoring decisions, and promotions are logged and stored in Supabase, and will be visible via a public dashboard in future iterations.

---

## 🔐 Security & Protocol Design

- **On-chain Fund Flow**: Uses Eliza plugins for safe multisig-triggered transfers on Polygon
- **Memory Isolation**: Supabase instance is sandboxed to prevent unauthorized access
- **Open Data Access**: Project evaluations and donation history are publicly accessible to maintain transparency
- **Auditability**: Smart contracts and allocation logic will be documented, and open for third-party audits

---

## 🌱 Open Source & Agentic Infrastructure

DONR2-D2 champions **open-source development** and is a foundational step toward building an **agentic society on Polygon**, where autonomous agents help scale coordination for public goods. Codebase and documentation are publicly maintained here:

[https://github.com/divine-comedian/donr2-d2-donation-agent](https://github.com/divine-comedian/donr2-d2-donation-agent)

This is not just a tool—it’s a prototype for autonomous benevolence, part of a future where agents coordinate public goods funding more effectively than centralized systems.

---

## 📅 Milestones & Budget

**Total Request**: 50,000 POL

### ✅ Milestone 1

- DONR2-D2 completes weekly on-chain transfers to Giveth projects on Polygon
- Scoring system is operational and outputs are stored and logged

### ✅ Milestone 2

- DONR2-D2 composes and posts promotional tweets aligned with its donations
- Social media presence grows through regular, quality engagement

### ✅ Milestone 3

- The Giveth project page for DONR2-D2 goes live
- Community donations flow in and are autonomously reallocated
- All actions are visible onchain and through the Twitter account

---

## 🧠 Team

**Lead Developer & Product Designer**

[https://x.com/divine_comedian](https://x.com/divine_comedian)

Product Manager at [https://x.com/Giveth](https://x.com/Giveth)

Self-taught Solidity and AI agent developer

👨‍💻 GitHub: [https://github.com/divine-comedian](https://github.com/divine-comedian)

DONR2-D2 is being actively developed with real-world deployments in mind and will continue to evolve with community input, collaboration, and Polygon-native integration.