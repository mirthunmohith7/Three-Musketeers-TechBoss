# 🧙‍♂️ BigBoss - Hogwarts Command Center

> A real-time, interactive wizarding command and control dashboard built for the Big Boss Tech House: Hogwarts Edition. Manage students, track Triwizard points, issue Protego shields, handle house expulsions, and broadcast magical orders with dynamic lightning effects.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features & Deliverables](#-key-features--deliverables)
- [Aesthetic & Theme Guidelines](#-aesthetic--theme-guidelines)
- [AI Disclosure](#-ai-disclosure)
- [Tech Stack](#-tech-stack)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [GitHub Repository & Deployment](#-github-repository--deployment)
- [Project Structure](#-project-structure)

---

## 🔮 Project Overview

**BigBoss - Hogwarts** provides Headmasters and Big Boss Overseers with complete real-time monitoring and control over the Hogwarts House contestants. The application combines live state management, interactive timers, text-to-speech audio broadcasting, and a custom Harry Potter visual effect system to create an immersive, high-stakes tournament experience.

---

## 🎯 Key Features & Deliverables

| Deliverable | Status | Description |
| :--- | :---: | :--- |
| **1. Student Management** | ✅ | Pre-loaded with 8+ Hogwarts students across houses (Gryffindor, Ravenclaw, Slytherin, Hufflepuff) with house points and status tracking. |
| **2. Live Leaderboard** | ✅ | Dynamic rank table automatically sorted by total house points with real-time positional updates. |
| **3. Triwizard Tasks** | ✅ | Assign magic trials, track progress ("In Progress", "Completed"), and automatically award house points upon completion. |
| **4. Point System** | ✅ | Instant +10, +50, +100 and -10, -50, -100 point adjustment triggers with custom reward/penalty logging. |
| **5. Head Boy / Head Girl** | ✅ | Dynamic assignment of House Captaincy with automatic visual emblem highlights. |
| **6. Forbidden Forest Nominations** | ✅ | Nominate non-immune students for eviction/expulsion. |
| **7. Protego Immunity Shield** | ✅ | Grant Protego protection to prevent students from being nominated for expulsion. |
| **8. Forbidden Forest (Danger Zone)** | ✅ | Dedicated high-visibility hazard panel displaying all currently nominated wizards. |
| **9. Big Boss Audio Broadcasts** | ✅ | Text-to-speech verbal announcements powered by Web Speech API with built-in playback controls. |
| **10. Harry's Scar Lightning Effect**| ✅ | 1-second full-screen animated lightning bolt trigger upon issuing new broadcasts. |
| **11. Countdown Trial Timer** | ✅ | Digital MM:SS task timer with Start, Pause, Reset, and red-pulse low-time warnings. |
| **12. Hogwarts House Statistics** | ✅ | Live metrics summary (Active Wizards, Top Scorer, Head Boy/Girl, Expelled Count, Completed Tasks). |
| **13. Hogwarts Expulsion System** | ✅ | Expel nominated students, archiving them to the Expelled Wall of Shame and removing them from live leaderboard standings. |

---

## 🎨 Aesthetic & Theme Guidelines

The application strictly adheres to an **Obsidian & Antique Bronze / Hogwarts** visual system:

* **Obsidian Black (`#0B0C10`)**: Deep matte canvas grounding all container components.
* **Aged Parchment / Leather (`#1A1412`)**: Textured background layers for panels and cards.
* **Antique Bronze (`#CD7F32`)**: Warm, weathered metallic trim for headers, crowns, and primary actions.
* **House Accents**:
  * **Gryffindor Crimson (`#800020`)**: Danger zone, nominations, and eviction controls.
  * **Slytherin Emerald (`#1A472A`)**: Task completion and positive status indicators.
  * **Ravenclaw Sapphire (`#0E1A40`)**: Protego immunity shields and structural trims.
  * **Hufflepuff Gold (`#DAA520`)**: Leaderboard rankings and Head Boy/Girl badges.
* **Ivory (`#FFFFF0`)**: Soft, high-contrast typography for optimal readability.
* **Typography**: Professional gothic/serif headers (`Cinzel` / `Cinzel Decorative`) paired with high-legibility sans-serif (`Inter` / `Plus Jakarta Sans`) for tabular data.

---

## 🤖 AI Disclosure

In compliance with open submission and hackathon standards, the development process for this project utilized artificial intelligence tools:

* **AI Platform**: [Lovable.dev](https://lovable.dev)
* **LLM Engine**: OpenAI GPT-4o / Claude 3.5 Sonnet (via Lovable prompt engine)
* **Extent of AI Usage**:
  * Generation of initial React UI component scaffolding and state management hooks.
  * Theme conversion and Tailwind CSS styling palette customization.
  * Custom CSS animations for the 1-second Harry Potter scar lightning effect.
* **Human Verification**: Manual review, logic verification, deployment integration, and functional state testing executed by the team.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React.js (Vite)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React (`lucide-react`)
* **Audio Engine**: Web Speech API (`window.speechSynthesis`)
* **Version Control**: Git & GitHub
* **Deployment**: Vercel / Netlify / Lovable Cloud

---

## 🚀 Quick Start & Local Setup

###
