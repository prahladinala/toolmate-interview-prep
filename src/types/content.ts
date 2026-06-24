export interface TopicContent {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  definition: string;
  simpleExplanation: string;
  realWorldExample: string;
  useCases: string[];
  questions: {
    basic: string[];
    intermediate: string[];
    advanced: string[];
    trick: string[];
    hr: string[];
  };
  answers: Array<{ question: string; answer: string }>;
  codeExample?: string;
  diagramType?: "mermaid" | "svg";
  diagramContent?: string;
}

export interface Category {
  id: string;
  title: string;
  topics: {
    id: string;
    title: string;
  }[];
}

export interface TechStack {
  id: string;
  title: string;
  description: string;
  icon: string;
  categories: Category[];
}
