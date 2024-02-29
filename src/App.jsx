import '@/_styles/scss/style.scss';
import { RouterProvider } from 'react-router-dom';
import router from '@/router.js';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
