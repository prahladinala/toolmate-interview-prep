import Link from "next/link";
import { getAllTechStacks } from "@/lib/content";
import { RetroButton } from "@/components/retro/retro-button";
import { RetroCard, RetroCardContent, RetroCardHeader, RetroCardTitle, RetroCardDescription } from "@/components/retro/retro-card";
import { RetroBadge } from "@/components/retro/retro-badge";

export default async function Home() {
  const techStacks = await getAllTechStacks();

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <RetroBadge variant="accent" className="text-sm px-4 py-1.5 rotate-[-2deg] mb-4">
                  🚀 Launch your career
                </RetroBadge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                  Master Technical <br />
                  <span className="text-primary underline decoration-8 decoration-accent underline-offset-8">Interviews</span>
                </h1>
                <p className="max-w-[600px] text-lg md:text-xl font-medium text-muted-foreground mx-auto lg:mx-0">
                  Learn JavaScript, TypeScript, React, Next.js, and System Design through structured, gamified learning paths.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="#explore">
                  <RetroButton size="lg" className="w-full sm:w-auto text-lg px-8">
                    Start Learning
                  </RetroButton>
                </Link>
                <Link href="/dashboard">
                  <RetroButton variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                    View Progress
                  </RetroButton>
                </Link>
              </div>
            </div>
            {/* Hero Illustration Placeholder */}
            <div className="mx-auto w-full max-w-[500px] aspect-square relative">
              <div className="absolute inset-0 bg-secondary border-4 border-border retro-shadow rounded-2xl rotate-3"></div>
              <div className="absolute inset-0 bg-card border-4 border-border retro-shadow rounded-2xl -rotate-3 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-8xl mb-6">🧑‍💻</div>
                <h3 className="text-2xl font-bold mb-2">Daily Streak!</h3>
                <div className="text-primary font-black text-4xl">+100 XP</div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="border-y-4 border-border bg-accent py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Questions", value: "500+" },
                { label: "Topics", value: "100+" },
                { label: "Learning Paths", value: "10+" },
                { label: "Mock Interviews", value: "50+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <span className="text-4xl md:text-5xl font-black">{stat.value}</span>
                  <span className="font-bold text-lg">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Grid */}
        <section id="explore" className="container mx-auto px-4 py-24 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black">Choose Your Path</h2>
            <p className="text-xl font-medium text-muted-foreground">From fundamentals to advanced architecture.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {techStacks.map((stack) => (
              <Link key={stack.id} href={`/learn/${stack.id}`} className="block group">
                <RetroCard className="h-full transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2 group-active:translate-y-0 group-active:translate-x-0">
                  <RetroCardHeader>
                    <div className="w-12 h-12 rounded-lg border-2 border-border bg-primary/20 flex items-center justify-center text-2xl mb-4">
                      {stack.icon === 'javascript' ? '💛' : stack.icon === 'react' ? '⚛️' : '💻'}
                    </div>
                    <RetroCardTitle>{stack.title}</RetroCardTitle>
                    <RetroCardDescription>{stack.description}</RetroCardDescription>
                  </RetroCardHeader>
                  <RetroCardContent>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span>{stack.categories.reduce((acc, cat) => acc + cat.topics.length, 0)} Topics</span>
                      <span className="text-primary group-hover:underline">Explore →</span>
                    </div>
                  </RetroCardContent>
                </RetroCard>
              </Link>
            ))}
            
            {/* Empty state if no other stacks are found */}
            {techStacks.length === 1 && (
               <Link href={`/learn/react`} className="block group">
                 <RetroCard className="h-full bg-muted transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
                   <RetroCardHeader>
                     <div className="w-12 h-12 rounded-lg border-2 border-border bg-blue-500/20 flex items-center justify-center text-2xl mb-4">
                       ⚛️
                     </div>
                     <RetroCardTitle>React.js</RetroCardTitle>
                     <RetroCardDescription>Component lifecycle, Hooks, Context, Performance.</RetroCardDescription>
                   </RetroCardHeader>
                   <RetroCardContent>
                     <div className="flex items-center justify-between text-sm font-bold">
                       <span>Coming Soon</span>
                     </div>
                   </RetroCardContent>
                 </RetroCard>
               </Link>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t-4 border-border bg-card py-8 mt-auto">
        <div className="container mx-auto px-4 text-center font-bold">
          <p>© {new Date().getFullYear()} Interview Preparation by ToolMate.</p>
        </div>
      </footer>
    </div>
  );
}
