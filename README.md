# Booky

AI-powered voice reading companion that lets you have real conversations with your books.

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple.svg)](https://clerk.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Upload any PDF book and start a voice conversation with it — powered by VAPI AI and a subscription-based model for educators, students, and avid readers.

---

## 🎯 Features

### Core Functionality
- **PDF Upload** — Upload books up to 50MB with cover images, stored in Vercel Blob
- **Voice Conversations** — Talk to your books via natural voice using VAPI AI
- **Intelligent Search** — MongoDB full-text search across book segments to answer questions in real time
- **Session Tracking** — Duration warnings, message history, and session logging per book
- **Subscription Plans** — Tiered access (Free, Standard, Pro) enforced at the API level

### Technical Highlights
- **Server Actions** — Next.js Server Actions for database operations with no separate API layer
- **Voice Personas** — Five 11Labs voices (Dave, Daniel, Chris, Rachel, Sarah) per book conversation
- **PDF Segmentation** — Books are parsed with pdf.js and indexed as searchable chunks in MongoDB
- **Real-time Limits** — Per-plan book count, session count, and session duration enforced live
- **ISR + Revalidation** — Server-side rendering with `revalidatePath` for instant library updates

---

## 🏗️ Architecture

### System Overview
```
┌──────────┐
│   User   │
└────┬─────┘
     │ Upload PDF / Start Voice Session
     ↓
┌─────────────────┐
│   Next.js App   │  (Clerk Auth + Subscription Check)
└────┬────────────┘
     │
     ├──────────────────────────────────────────────┐
     ↓                                              ↓
┌────────────────────────┐            ┌─────────────────────────┐
│  Server Actions        │            │  VAPI AI Voice Agent    │
│  • book.actions.ts     │            │  • Streams audio I/O    │
│  • sessions.actions.ts │            │  • Calls search API     │
│  • Upload to Blob      │            └────────────┬────────────┘
└────────────┬───────────┘                         │
             │                                     │ POST /api/vapi/search-book
             ↓                                     ↓
┌────────────────────────┐            ┌─────────────────────────┐
│  MongoDB (Atlas)       │◄───────────│  Search Route Handler   │
│  • books               │            │  • Text index query     │
│  • bookSegments        │            │  • Regex fallback       │
│  • voiceSessions       │            └─────────────────────────┘
└────────────────────────┘

┌────────────────────────┐
│  Vercel Blob           │
│  • PDF files           │
│  • Cover images        │
└────────────────────────┘
```

### Component Details

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 | File pages, library, subscriptions UI |
| **Auth** | Clerk | Sign-up, sign-in, session management |
| **Voice** | VAPI AI + 11Labs | Real-time voice conversation per book |
| **Database** | MongoDB + Mongoose | Books, segments, and session persistence |
| **File Storage** | Vercel Blob | PDF and cover image hosting |
| **PDF Parsing** | pdf.js-dist | Text extraction and segmentation |
| **Subscriptions** | Clerk Billing | Plan gating and PricingTable UI |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local instance)
- [Clerk](https://clerk.com) account with billing enabled
- [VAPI AI](https://vapi.ai) account with a configured assistant
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) storage token

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/dimermichel/booky.git
cd booky

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in all required values (see Configuration section)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign in with Clerk and upload your first book.

---

## 📡 API Reference

### Search Book Segments

Used internally by the VAPI AI voice agent to answer questions during a conversation.

**Endpoint:** `POST /api/vapi/search-book`

**Request Body:**
```json
{
  "message": {
    "toolCallList": [
      {
        "function": {
          "arguments": {
            "bookId": "64f1a2b3c4d5e6f7a8b9c0d1",
            "keyword": "main character"
          }
        }
      }
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "toolCallId": "...",
      "result": "Relevant passage text found in the book..."
    }
  ]
}
```

### File Upload

**Endpoint:** `POST /api/upload`

Handles multipart form data with `file` (PDF) and `coverImage` fields. Returns Blob URLs for both.

---

## 📂 Project Structure

```
booky/
├── app/
│   ├── (root)/
│   │   ├── page.tsx                  # Book library / dashboard
│   │   ├── books/
│   │   │   ├── new/page.tsx          # Upload new book form
│   │   │   └── [slug]/page.tsx       # Book detail + voice session
│   │   └── subscriptions/page.tsx    # Pricing / plan management
│   ├── api/
│   │   ├── upload/route.ts           # Vercel Blob file upload
│   │   └── vapi/search-book/         # Voice agent search endpoint
│   └── layout.tsx                    # Root layout with Clerk + Navbar
│
├── components/
│   ├── Navbar.tsx                    # Navigation with auth controls
│   ├── Footer.tsx
│   ├── LandingSection.tsx
│   ├── HeroSection.tsx
│   ├── BookCard.tsx
│   ├── Search.tsx
│   ├── VapiControls.tsx              # Voice call controls UI
│   └── ui/                          # shadcn/ui component library
│
├── lib/
│   ├── actions/
│   │   ├── book.actions.ts           # Book CRUD (Server Actions)
│   │   └── sessions.actions.ts       # Voice session management
│   ├── hooks/
│   │   ├── useVapi.ts                # Voice call state & lifecycle
│   │   └── useSubscription.ts        # Plan limit checks
│   ├── constants.ts                  # App config, voices, limits
│   ├── subscription-constants.ts     # Per-plan feature matrix
│   └── utils.ts                      # Shared utilities
│
├── database/
│   ├── mongoose.ts                   # Connection pooling
│   └── models/
│       ├── book.model.ts
│       ├── bookSegment.model.ts
│       └── voiceSession.model.ts
│
├── public/
│   └── assets/                       # Static icons and images
│
├── CLAUDE.md
├── AGENTS.md
└── README.md
```

---

## 💻 Technology Stack

### Frontend
- **Framework:** Next.js 16.2.4 (App Router)
- **UI Library:** React 19.2.5
- **Language:** TypeScript 6.0.3
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Icons:** Lucide React
- **Fonts:** IBM Plex Serif + Mona Sans

### Backend & Data
- **Database:** MongoDB 8 + Mongoose 9.6
- **Auth:** Clerk (OAuth, session management, billing)
- **File Storage:** Vercel Blob
- **PDF Parsing:** pdf.js-dist

### AI & Voice
- **Voice Agent:** VAPI AI SDK v2.5.2
- **Voice Models:** 11Labs (5 configurable voices)
- **Search:** MongoDB full-text index + regex fallback

### Forms & Validation
- **Forms:** React Hook Form
- **Validation:** Zod
- **Notifications:** Sonner

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file at the project root:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/booky

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# VAPI Voice AI
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key
NEXT_PUBLIC_ASSISTANT_ID=your_vapi_assistant_id
```

### Subscription Plans

Defined in `lib/subscription-constants.ts`:

| Plan | Books | Sessions/month | Max Duration | Session History |
|------|-------|---------------|--------------|-----------------|
| **Free** | 1 | 5 | 5 min | ✗ |
| **Standard** | 10 | 100 | 15 min | ✓ |
| **Pro** | 100 | Unlimited | 60 min | ✓ |

---

## 🧪 Testing

### Manual Testing
```bash
# Start local dev server
npm run dev

# Visit the app at:
# http://localhost:3000
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### End-to-End Flow
1. Sign in via Clerk
2. Upload a PDF book with a cover image
3. Navigate to the book detail page
4. Start a voice session and ask a question about the book
5. Verify the AI responds with relevant content from the uploaded PDF

---

## 🔄 Development Workflow

### Branch Strategy
```
main (production)
  └── feat/<feature-name>
  └── fix/<bug-description>
  └── chore/<task>
```

### Workflow
```bash
# 1. Create a feature branch
git checkout -b feat/my-feature

# 2. Make changes and verify
npm run lint
npx tsc --noEmit

# 3. Commit with a descriptive message
git commit -m "feat: add voice persona selector"

# 4. Push and open a Pull Request to main
git push origin feat/my-feature
```

### Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## 🔐 Security

✅ **Implemented:**
- Clerk-managed authentication with OAuth support
- Subscription checks server-side before book creation
- Environment variables for all secrets (never committed)
- Vercel Blob signed URLs for file access
- Input validation with Zod on all form submissions
- MongoDB parameterized queries via Mongoose

⚠️ **Production Recommendations:**
- Enable Clerk's bot protection and rate limiting
- Set `Content-Security-Policy` headers in `next.config`
- Restrict Vercel Blob token scopes per environment
- Enable MongoDB Atlas Network Access IP allowlisting
- Add `robots.txt` and privacy policy pages

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. Open a **Pull Request** to `main`

### Contribution Standards
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Ensure TypeScript types are correct (`npx tsc --noEmit`)
- Keep components focused and avoid unnecessary abstraction
- Update this README if you add new environment variables or scripts

---

## 📄 License

This project is licensed under the **MIT License** — see the LICENSE file for details.

---

## 👥 Authors

**Michel Maia**
- GitHub: [@dimermichel](https://github.com/dimermichel)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/dimermichel)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/dimermichel/booky/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dimermichel/booky/discussions)

---

<div align="center">

**⭐ If this project helped you, consider giving it a star!**

*Built for readers who want to truly interact with their books* 🎙️📚

</div>
