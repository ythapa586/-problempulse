
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type LifecycleStatus = 'Emerging' | 'Escalating' | 'Stabilizing' | 'Resolved';
export type Credibility = 'Verified' | 'Partially Verified' | 'Unverified';

export interface Stakeholder {
  name: string;
  type: 'Government' | 'NGO' | 'Startup' | 'Expert';
  role: string;
  acknowledgedAt?: string;
  responseTime?: string; // e.g. "4.2 hours"
}

export interface Evidence {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  contributor: string;
  verified: boolean;
}

export interface SentimentPoint {
  date: string;
  trust: number;
  outrage: number;
}

export interface Problem {
  id: string;
  title: string;
  summary: string;
  category: 'Social' | 'Environmental' | 'Health' | 'Education' | 'Technology' | 'Economy';
  location: string;
  severity: Severity;
  lifecycle: LifecycleStatus;
  credibility: Credibility;
  credibilityScore: number;
  rootCause: string;
  whoIsAffected: string;
  whyItMatters: string;
  impactScore: number;
  trend: number[];
  affectedPopulation: string;
  upvotes: number;
  comments: Comment[];
  solutionIdeas: string[];
  tags: string[];
  timestamp: string;
  stakeholders: Stakeholder[];
  evidence?: Evidence[];
  sentimentShift?: SentimentPoint[];
  thresholdLevel?: number; // 0-100, above 80 triggers Crisis Escalation
  policyInfo?: {
    exists: boolean;
    description: string;
    gap: string;
    violationScore: number; // 0-100 legal risk
  };
  timeline: { date: string; event: string; status: LifecycleStatus }[];
  actionChecklist?: { task: string; completed: boolean; suggestedAuthority: string }[];
}

export interface SolutionEvaluation {
  feasibility: number;
  cost: number;
  timeToImplement: string;
  socialImpact: number;
  overallScore: number;
}

export interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

export interface Solution {
  id: string;
  problemId: string;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  votes: number;
  evaluation?: SolutionEvaluation;
}

export interface User {
  id: string;
  name: string;
  points: number;
  badges: string[];
  contributions: number;
}
