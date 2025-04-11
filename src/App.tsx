
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from '@/pages/Index';
import CharacterUnlocks from '@/components/CharacterUnlocks';
import NotFound from '@/pages/NotFound';
import DonationGate from './components/DonationGate';
import GameplayTutorial from './components/GameplayTutorial';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/character-unlocks',
    element: <CharacterUnlocks />,
  },
  {
    path: '/donation-gate',
    element: <DonationGate />,
  },
  {
    path: '/tutorial',
    element: <GameplayTutorial />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
