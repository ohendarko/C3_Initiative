export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  progress: number;
  modulesCompleted: number;
  totalModules: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

export interface LearningCard {
  id: string;
  title: string;
  content: string;
  infographic: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  learningCards: LearningCard[];
  quizzes: Quiz[];
}

export interface PostTest {
  id: string;
  question: string;
  options: string[];
  correct: string;
}

export interface Module {
  id: string;
  module: string;
  completed: boolean;
  unlocked: boolean;
  icon: string;
  title: string;
  description: string;
  order: number;
  introVideo: string;
  sections: Section[];
  postTest: PostTest[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalModules: number;
  avgProgress: number;
}
