
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { SubmitSolutionPage } from './pages/SubmitSolutionPage';
import { ProfilePage } from './pages/ProfilePage';
import { INITIAL_PROBLEMS } from './constants';
import { Problem } from './types';

const App: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>(INITIAL_PROBLEMS);

  const addProblem = (newProblem: Problem) => {
    setProblems(prev => [newProblem, ...prev]);
  };

  const solveProblem = (problemId: string, solutionText: string) => {
    setProblems(prev => prev.map(p => {
      if (p.id === problemId) {
        return {
          ...p,
          lifecycle: 'Stabilizing' as const,
          solutionIdeas: [solutionText, ...(p.solutionIdeas || [])],
          upvotes: p.upvotes + 50 // Boost visibility for solved problems
        };
      }
      return p;
    }));
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard problems={problems} />} />
          <Route path="/problem/:id" element={<ProblemDetailPage problems={problems} />} />
          <Route path="/submit" element={<SubmitSolutionPage addProblem={addProblem} solveProblem={solveProblem} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
