import React from 'react';

function Sidebar({ activeView, setActiveView, isCollapsed, toggleSidebar }) {
    const menuItems = [
        { id: 'home', label: 'Inicio', icon: '🏠' },
        { id: 'api', label: 'API', icon: '🔌' },
        { id: 'encript', label: 'Encriptación', icon: '🔒' }
    ];

    return (
        <div className={`bg-gray-800 text-white ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen h-screen fixed left-0 top-0 z-40 p-4 transition-all duration-300 flex flex-col`} style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.1)' }}>
            <div className={`${isCollapsed ? 'text-center' : 'text-xl font-bold mb-8 text-center'}`}>
                {isCollapsed ? '🛠️' : 'QA Tools'}
            </div>

            <nav className="flex-grow">
                <ul>
                    {menuItems.map((item) => (<li key={item.id} className="mb-2">
                        <button
                            className={`w-full text-left py-2 px-4 rounded transition-colors ${activeView === item.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                                } ${isCollapsed ? 'flex justify-center' : ''}`}
                            onClick={() => setActiveView(item.id)}
                            title={isCollapsed ? item.label : ""}
                        >
                            {isCollapsed ? (
                                <span className="text-lg">{item.icon}</span>
                            ) : (
                                <div className="flex items-center">
                                    <span className="mr-2">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            )}
                        </button>
                    </li>))}
                </ul>
            </nav>
            <div className="pt-4 mt-4 border-t border-gray-700">
                <button
                    className={`w-full py-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} text-gray-400 hover:text-white transition-colors`}
                    onClick={toggleSidebar}
                    title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                >
                    {isCollapsed ? (
                        <span>▶</span>
                    ) : (
                        <>
                            <span>◀</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
