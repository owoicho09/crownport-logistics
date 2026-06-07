// This file must not exist alongside app/page.tsx — both resolve to "/"
// The homepage is served by app/page.tsx which imports the public layout.
// If you see a Next.js build error about conflicting routes, delete this file.
import { notFound } from 'next/navigation'
export default function ConflictGuard() { notFound() }
