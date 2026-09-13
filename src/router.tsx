import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Home } from './routes/Home';
import { MovieDetail } from './routes/MovieDetail';
import { NotFound } from './routes/NotFound';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/movie/:slug', element: <MovieDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
