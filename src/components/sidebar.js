import React, { useState } from 'react';

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('home');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      {/* Logo en la parte superior */}
      <div className="logo">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4ade80" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Menú de navegación */}
      <nav className="menu-items">
        <button 
          className={`menu-item ${activeItem === 'home' ? 'active' : ''}`}
          onClick={() => handleItemClick('home')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>

        <button 
          className={`menu-item ${activeItem === 'user' ? 'active' : ''}`}
          onClick={() => handleItemClick('user')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

        <button 
          className={`menu-item ${activeItem === 'chart' ? 'active' : ''}`}
          onClick={() => handleItemClick('chart')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>

        <button 
          className={`menu-item ${activeItem === 'folder' ? 'active' : ''}`}
          onClick={() => handleItemClick('folder')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
        </button>

        <button 
          className={`menu-item ${activeItem === 'message' ? 'active' : ''}`}
          onClick={() => handleItemClick('message')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        </button>
      </nav>

      {/* Botones en la parte inferior */}
      <div className="bottom-menu">
        <button className="menu-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Toggle button */}
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? '◀' : '▶'}
      </button>

      <style jsx>{`
        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background-color: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: width 0.3s ease;
          overflow: hidden;
          width: 70px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          border-right: 2px solid #4ade80;
          z-index: 1000;
        }

        .sidebar-container.closed {
          width: 0;
        }

        .logo {
          margin-top: 20px;
          margin-bottom: 30px;
          color: #4ade80;
        }

        .menu-items {
          display: flex;
          flex-direction: column;
          width: 100%;
          flex: 1;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
          background: transparent;
          border: none;
          width: 100%;
          padding: 14px 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-item:hover {
          background-color: #222;
          color: #4ade80;
        }

        .menu-item.active {
          color: #4ade80;
          background-color: #1a1a1a;
          border-left: 3px solid #4ade80;
        }

        .bottom-menu {
          margin-bottom: 20px;
          width: 100%;
        }

        .toggle-button {
          position: absolute;
          left: 74px;
          top: 10px;
          background-color: #111;
          color: #4ade80;
          border: 1px solid #4ade80;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 10px;
          padding: 0;
          transition: all 0.3s ease;
          z-index: 1001;
        }

        .toggle-button:hover {
          background-color: #4ade80;
          color: #111;
        }
      `}</style>
    </div>
  );
};

export default SidebarMenu;