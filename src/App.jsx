import { useState, useEffect } from "react";
import HomePage from "./Pages/Home";
import ApiPage from "./Pages/Api";
import Encript from "./Pages/encript";
import Sidebar from "./Components/Sidebar";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [csvContent, setCsvContent] = useState(() => {
    // Intentar recuperar el CSV del localStorage al inicio
    const savedCsv = localStorage.getItem('qa-tools-csv');
    return savedCsv || '';
  });

  // Guardar el CSV en localStorage cuando cambie
  useEffect(() => {
    if (csvContent) {
      localStorage.setItem('qa-tools-csv', csvContent);
    }
  }, [csvContent]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const clearCsvCache = () => {
    setCsvContent('');
    // Limpiar todos los datos relacionados con el CSV del localStorage
    localStorage.removeItem('qa-tools-csv');
    localStorage.removeItem('qa-tools-csv-filename');
    localStorage.removeItem('qa-tools-csv-loaddate');
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage setActiveView={setActiveView} />;
      case 'api':
        return <ApiPage csvContent={csvContent} setCsvContent={setCsvContent} clearCsvCache={clearCsvCache} />;
      case 'encript':
        return <Encript isCollapsed={isSidebarCollapsed} />;
      default:
        return <HomePage setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex w-full h-screen">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <main className="flex-1 bg-gray-700 transition-all duration-300 text-white min-h-screen flex flex-col items-center justify-center overflow-auto" style={{ marginLeft: isSidebarCollapsed ? '80px' : '240px' }}>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
