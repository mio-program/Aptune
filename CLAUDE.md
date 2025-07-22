# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
InnerLog is an AI-powered career assessment platform that analyzes users' personality traits, skills, values, and interests to provide personalized career recommendations. The system uses a two-stage diagnostic approach with comprehensive character type analysis.

## Development Commands

### Essential Commands
```bash
# Development
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
# Run database-setup.sql in Supabase SQL editor to set up schema
```

### Testing
No specific test commands are configured in package.json. Check with project maintainers for testing approach.

## Architecture

### Core Assessment System
- **DiagnosticEngine** (`src/lib/diagnostic-engine.ts`): Advanced character type analysis with weighted scoring
- **Assessment Analysis** (`src/lib/assessment-analysis.ts`): Simplified 6-type analysis system
- **Two-Stage Assessment**: Stage 1 (basic type), Stage 2 (detailed analysis)

### Database Architecture
- **Multi-stage assessments**: Supports both stage 1 and stage 2 results
- **Payment system**: Stripe integration for premium assessments
- **Subscription model**: Monthly subscriptions with learning content
- **Learning content**: Personalized recommendations based on personality types

### Key Components
- **Authentication**: Supabase Auth with AuthContext
- **Client Architecture**: Separate client/server Supabase instances
  - Use `@/lib/supabase-client` for client components
  - Use `@/lib/supabase-server` for server components
- **Assessment Flow**: `/assessment` → `/assessment/stage1` → `/assessment/stage2`
- **Payment Flow**: Stripe Checkout integration

### Data Layer
- **Questions**: Stored in JSON files with character type mappings
- **Character Types**: 16 distinct personality types with AI-era strengths
- **Scoring**: Weighted calculation with reliability scoring

## Environment Setup

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup
1. Create Supabase project
2. Run `database-setup.sql` in SQL editor
3. RLS policies are automatically configured

## Development Guidelines

### Supabase Client Usage
- **Client components**: Import from `@/lib/supabase-client`
- **Server components**: Import from `@/lib/supabase-server`
- **Types**: Use `@/lib/database.types.ts` for type safety

### Assessment System
- Stage 1: Basic 6-type assessment using `assessment-analysis.ts`
- Stage 2: Detailed 16-type analysis using `diagnostic-engine.ts`
- Results stored in `assessments` table with stage differentiation

### Payment Integration
- Stripe Checkout for premium assessments
- Webhook handling for payment verification
- User subscription status tracking

## Key File Structure
```
src/
├── app/api/                    # API routes
│   ├── assessment/submit/      # Assessment submission endpoints
│   ├── stripe/                 # Stripe payment processing
│   └── verify-payment/         # Payment verification
├── lib/
│   ├── diagnostic-engine.ts    # Advanced character analysis
│   ├── assessment-analysis.ts  # Basic type analysis
│   ├── supabase-client.ts      # Client-side Supabase
│   └── supabase-server.ts      # Server-side Supabase
├── data/
│   ├── innerlog-diagnostic-system.json  # Character types & questions
│   └── assessment-questions.ts          # Question definitions
└── components/
    ├── DiagnosisResult.tsx     # Result display
    └── PaymentModal.tsx        # Payment interface
```

## Important Notes
- All database tables use Row Level Security (RLS)
- Character types include AI-era specific strengths
- Assessment reliability scoring validates response quality
- Premium features require payment verification
- Japanese language support throughout the application

## Additional Information from README.md

### Assessment System Categories
The diagnostic system analyzes users across 5 categories:
1. **Personality Traits**: Adaptability, teamwork, risk tolerance
2. **Skills**: Analysis, communication, problem-solving, creativity
3. **Values**: Stability, growth opportunities, social contribution, income, work-life balance
4. **Interests**: Technology, healthcare, finance, education, marketing, design
5. **Work Style**: Remote work, office work, deadline management, multitasking

### Database Schema
Key tables include:
- `users`: User authentication and subscription status
- `user_profiles`: Extended user information
- `assessments`: Multi-stage assessment results
- `payments`: Stripe payment tracking
- `subscriptions`: Monthly subscription management
- `learning_contents`: Personalized learning recommendations
- `personalized_recommendations`: User-specific content suggestions

### Code Style Guidelines
- Use TypeScript throughout
- ESLint and Prettier for code formatting
- Functional components for React
- Custom hooks for logic separation
- Row Level Security (RLS) enabled on all tables
- Proper indexing for performance optimization