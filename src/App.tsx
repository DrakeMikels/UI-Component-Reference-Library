import { Route, Routes, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { AboutPage } from './pages/AboutPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { DesignSystemsPage } from './pages/DesignSystemsPage';

const App = () => (
  <Routes>
    <Route path="/" element={<AppShell />}>
      <Route index element={<Navigate to="/components" replace />} />
      <Route path="components" element={<ComponentsPage />} />
      <Route path="design-systems" element={<DesignSystemsPage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/components" replace />} />
  </Routes>
);

export default App;
