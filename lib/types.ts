export interface Question {
  order: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Test {
  name: string;
  questions: Question[];
}

export interface LearningCard {
  name: string;
  title: string;
  content: string;
  infographic: string;
  order: number;
}

export interface Section {
  name: string;
  title: string;
  description: string;
  order: number;
  learningCards: LearningCard[];
  quizzes: any[]; // still empty for now
}

export interface PostTest {
  name: string;
  questions: Question[];
}

export interface PreTest {
  name: string;
  questions: Question[];
}

export interface Module {
  id: string;
  module: string;
  name: string;
  completed: boolean;
  unlocked: boolean;
  icon: string;
  title: string;
  description: string;
  order: number;
  introVideo: string;
  sections: Section[];
  preTest: Test;
  postTest: Test;
  updatedAt?: Date;
}

export interface newModule {
  module: string;
  completed: boolean;
  unlocked: boolean;
  icon: string;
  title: string;
  name: string;
  description: string;
  order: number;
  introVideo: string;
  sections: Section[];
  preTest: Test;
  postTest: Test;
  updatedAt?: Date;
}

export interface ModuleSummary {
  id: string;
  order: number;
  module: string; // e.g., "module-1"
  description: string;
  name: string;         
  title: string;
  shortTitle: string;
  completed: boolean;
  unlocked: boolean;
  icon: string;         // name of the Lucide icon (e.g., "Users", "Shield")
  introVideo: string;
};