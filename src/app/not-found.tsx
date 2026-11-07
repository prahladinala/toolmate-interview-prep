import Link from 'next/link';
import { RetroButton } from '@/components/retro/retro-button';
import { RetroBadge } from '@/components/retro/retro-badge';

export const metadata = {
  title: "404 - Page Not Found | ToolMate Interview Prep",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center p-8 space-y-8">
      <RetroBadge variant="destructive" className="text-xl rotate-[-3deg] px-6 py-2 mb-4">
        404 Error
      </RetroBadge>
      
      <h1 className="text-6xl md:text-8xl font-black text-primary">
        Not Found
      </h1>
      
      <p className="text-xl text-muted-foreground font-medium max-w-lg">
        We couldn't find the page you were looking for. It might have been moved or deleted.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link href="/">
          <RetroButton size="lg" className="w-full sm:w-auto text-lg px-8">
            Return Home
          </RetroButton>
        </Link>
        <Link href="/dashboard">
          <RetroButton variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
            View Dashboard
          </RetroButton>
        </Link>
      </div>
    </div>
  );
}
