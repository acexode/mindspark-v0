# Production Launch Checklist

## Security
- [ ] Clerk auth enabled in production (`CLERK_SECRET_KEY`)
- [ ] Rate limiting on `/api/v1/tutor/turns`
- [ ] CSP headers configured in Vercel
- [ ] Minor data minimization audit complete

## Database
- [ ] Neon PostgreSQL provisioned
- [ ] Migrations applied (`npm run db:migrate`)
- [ ] Curriculum seeded (`npm run db:seed`)

## AI Tutor
- [ ] `OPENAI_API_KEY` set
- [ ] Evaluation suite passes
- [ ] Fallback responses verified when AI unavailable

## PWA & Offline
- [ ] Manifest and service worker registered
- [ ] Offline lesson cache tested
- [ ] Sync batch API tested (`POST /api/v1/sync/batch`)

## Accessibility
- [ ] axe audit passes on primary journeys
- [ ] Keyboard navigation verified
- [ ] Reduced motion respected

## Observability
- [ ] Error tracking configured (Sentry)
- [ ] Product events instrumented
- [ ] Health endpoint monitored (`GET /api/health`)

## CI/CD
- [ ] GitHub Actions green on main
- [ ] Vercel preview deploys working
- [ ] Production deploy with rollback procedure documented
