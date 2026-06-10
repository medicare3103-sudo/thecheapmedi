import React, { useState } from 'react';
import { Nav, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function AdminLayout({ children, title, actions }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-speedometer2', exact: true },
    { path: '/admin/orders', label: 'Orders', icon: 'bi-box-seam' },
    { path: '/admin/products', label: 'Products', icon: 'bi-tags' },
    { path: '/admin/categories', label: 'Categories', icon: 'bi-grid' },
    { path: '/admin/promotions', label: 'Promotions', icon: 'bi-star' },
    { path: '/admin/authors', label: 'Authors & Reviewers', icon: 'bi-person-badge' },
    { path: '/admin/blogs', label: 'Blogs', icon: 'bi-journal-text' },
    { path: '/admin/users', label: 'Customers', icon: 'bi-people' },
    { path: '/admin/coupons', label: 'Coupons', icon: 'bi-ticket-perforated' }
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-container">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`admin-sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="p-4 bg-primary text-white text-center fw-bold fs-4 d-flex align-items-center justify-content-between">
          <span>Cheap Pharma Admin</span>
          <Button 
            variant="link" 
            className="text-white p-0 d-md-none" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </div>
        <Nav className="flex-column p-3 gap-2 flex-grow-1">
          {menuItems.map((item) => {
            const active = isLinkActive(item);
            return (
              <Nav.Link 
                key={item.path} 
                as={Link} 
                to={item.path} 
                className={`px-3 py-2 d-flex align-items-center ${active ? 'text-white bg-white bg-opacity-10 rounded' : 'text-white-50 custom-nav-link'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className={`bi ${item.icon} me-2`}></i> {item.label}
              </Nav.Link>
            );
          })}
        </Nav>
        <div className="p-3 mt-auto border-top border-secondary">
          <Nav.Link as={Link} to="/" className="text-white-50 px-3 py-2 custom-nav-link d-flex align-items-center">
            <i className="bi bi-arrow-left-circle me-2"></i> Back to Store
          </Nav.Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Responsive Header Topbar */}
        <header className="admin-topbar shadow-sm">
          <div className="d-flex align-items-center">
            <button 
              className="admin-sidebar-toggle btn btn-link p-0" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Toggle Sidebar"
            >
              <i className="bi bi-list fs-3"></i>
            </button>
            <h4 className="mb-0 fw-bold">{title}</h4>
          </div>
          {actions && <div className="admin-topbar-actions">{actions}</div>}
        </header>

        {/* Dynamic Inner Page Content */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          {children}
        </main>
      </div>

      <style>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
        }
        .admin-sidebar {
          width: 260px;
          background-color: #0f172a;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
        }
        .admin-main {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .admin-topbar {
          background-color: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .admin-sidebar-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #334155;
          cursor: pointer;
          padding: 0;
          margin-right: 1rem;
        }
        .admin-sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(2px);
          z-index: 999;
        }
        .custom-nav-link:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        @media (max-width: 767.98px) {
          .admin-sidebar-toggle {
            display: block;
          }
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            z-index: 1001;
            box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-sidebar-overlay.show {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;
