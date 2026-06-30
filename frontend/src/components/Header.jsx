import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, InputGroup, Button, Navbar, Nav, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getCategories } from '../api';

function Header({ hideAuth = false }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchHeaderCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data?.filter(c => c.show_in_navbar) || []);
      } catch (err) {
      }
    };
    fetchHeaderCategories();
  }, []);

  // useCallback ensures these function references stay stable across re-renders.
  // Header re-renders whenever cartCount or user changes, which would otherwise
  // give child buttons a new onClick reference every time (breaking React.memo).
  const handleAccordionToggle = useCallback((item) => {
    setOpenAccordion(prev => prev === item ? null : item);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setShowMobileSearch(false);
    }
  }, [searchTerm, navigate]);

  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);

  const toggleMobileSearch = useCallback(() => {
    setShowMobileSearch(prev => !prev);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <Container>
          <div className="top-bar-content">
            <span>☎ +1 (888) 866-7566</span>
            <span className="mx-1">|</span>
            <Link to="/track-order" className="top-bar-link">Track Order</Link>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <Container>
          <div className="header-flex-container">
            {/* Mobile Hamburger Button */}
            <button className="menu-toggle-btn d-lg-none" onClick={toggleSidebar} aria-label="Toggle Navigation">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Logo */}
            <div className="header-logo-wrap">
              <Link to="/" className="text-decoration-none">
                <div className="logo-container">
                  <div className="logo-icon">
                    <div className="logo-icon-pill">
                      <div className="logo-pill-top"></div>
                      <div className="logo-pill-bottom"></div>
                    </div>
                    <div className="logo-icon-cross-wrap">
                      <div className="logo-icon-cross"></div>
                    </div>
                  </div>
                  <div className="logo-text">
                    <span className="logo-text-top">The Cheap</span>
                    <span className="logo-text-bottom">Pharma</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="header-search-wrap d-none d-lg-block">
              <Form onSubmit={handleSearch}>
                <InputGroup className="search-input-group">
                  <Form.Control
                    placeholder="Search for medicines, health products..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search for medicines, health products"
                  />
                  <Button type="submit" className="search-btn" aria-label="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </Button>
                </InputGroup>
              </Form>
            </div>

            {/* Action Buttons */}
            <div className="header-actions-wrap">
              {/* Mobile Search Toggle */}
              <button className="action-icon-btn d-lg-none" onClick={toggleMobileSearch} aria-label="Toggle Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              {/* Profile / Sign In Icon (Optional) */}
              {!hideAuth && (
                user ? (
                  <div className="d-none d-lg-flex align-items-center gap-2">
                    <span className="fs-6 text-muted">Hi, {user.username || user.email || user.phone}</span>
                    <button className="btn btn-sm btn-link text-danger text-decoration-none p-0 fw-bold" onClick={logout} aria-label="Logout">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="action-icon-link" aria-label="Sign In">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </Link>
                )
              )}

              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="action-icon-link position-relative" 
                aria-label={cartCount > 0 ? `Shopping cart with ${cartCount} items` : "Shopping cart"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && (
                  <Badge pill bg="danger" className="cart-badge">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </div>
          </div>

          {/* Collapsible Mobile Search Input */}
          {showMobileSearch && (
            <div className="mobile-search-bar-container d-lg-none py-2">
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    placeholder="Search for medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    aria-label="Search for medicines"
                  />
                  <Button type="submit" variant="primary" style={{border: 'none'}}>
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </div>
          )}
        </Container>
      </header>

      {/* Categories Desktop Navigation Bar */}
      <Navbar bg="light" expand="lg" className="border-bottom d-none d-lg-block">
        <Container>
          <Nav className="me-auto fw-500 align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/categories">All Categories</Nav.Link>
            {categories.map(cat => {
              if (cat.subcategories && cat.subcategories.length > 0) {
                return (
                  <NavDropdown title={cat.name} id={`nav-dropdown-${cat.id}`} key={cat.id} className="custom-nav-dropdown">
                    {cat.subcategories.map((sub, idx) => (
                      <NavDropdown.Item as={Link} to={`/search/${encodeURIComponent(sub)}`} key={idx}>
                        {sub}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                );
              } else {
                return (
                  <Nav.Link as={Link} to={`/search/${encodeURIComponent(cat.name)}`} key={cat.id}>
                    {cat.name}
                  </Nav.Link>
                );
              }
            })}
            <Nav.Link as={Link} to="/blogs">Blog</Nav.Link>
          </Nav>
          {user && (
            <Nav>
              {(user.username === 'admin' || user.role === 'admin') && (
                <Link to="/admin" className="btn btn-outline-danger btn-sm fw-bold me-2">Admin Dashboard</Link>
              )}
              <Link to="/dashboard" className="btn btn-outline-primary btn-sm fw-bold">My Dashboard</Link>
            </Nav>
          )}
        </Container>
      </Navbar>

      {/* Mobile Drawer (Sidebar Navigation Panel) */}
      <div className={`sidepanel-overlay ${showSidebar ? 'show' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidepanel ${showSidebar ? 'show' : ''}`}>
        <div className="sidepanel-header">
          <Link to="/" className="text-decoration-none" onClick={toggleSidebar}>
            <div className="logo-container">
              <div className="logo-icon" style={{transform: 'scale(0.85)'}}>
                <div className="logo-icon-pill">
                  <div className="logo-pill-top"></div>
                  <div className="logo-pill-bottom"></div>
                </div>
                <div className="logo-icon-cross-wrap">
                  <div className="logo-icon-cross"></div>
                </div>
              </div>
              <div className="logo-text">
                <span className="logo-text-top" style={{fontSize: '0.65rem'}}>The Cheap</span>
                <span className="logo-text-bottom" style={{fontSize: '1.1rem'}}>Pharma</span>
              </div>
            </div>
          </Link>
          <button className="sidepanel-close" onClick={toggleSidebar} aria-label="Close Menu">
            &times;
          </button>
        </div>
        <div className="sidepanel-body">
          <div className="sidepanel-nav">
            {categories.map(cat => {
              if (cat.subcategories && cat.subcategories.length > 0) {
                const accordionKey = `accordion-${cat.id}`;
                return (
                  <div className="sidepanel-accordion-item" key={cat.id}>
                    <button 
                      className={`sidepanel-accordion-header ${openAccordion === accordionKey ? 'active' : ''}`}
                      onClick={() => handleAccordionToggle(accordionKey)}
                    >
                      <span>{cat.name}</span>
                      <span className="accordion-arrow">▼</span>
                    </button>
                    <div className={`sidepanel-accordion-collapse ${openAccordion === accordionKey ? 'show' : ''}`}>
                      <div className="sidepanel-accordion-body">
                        {cat.subcategories.map((sub, idx) => (
                          <Link 
                            to={`/search/${encodeURIComponent(sub)}`} 
                            className="sidepanel-sub-link" 
                            key={idx}
                            onClick={toggleSidebar}
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <Link 
                    to={`/search/${encodeURIComponent(cat.name)}`} 
                    className="sidepanel-nav-link-item" 
                    key={cat.id}
                    onClick={toggleSidebar}
                  >
                    {cat.name}
                  </Link>
                );
              }
            })}

            {/* Blog Direct Link */}
            <Link to="/blogs" className="sidepanel-nav-link-item" onClick={toggleSidebar}>
              Blog
            </Link>
          </div>

          {/* Callback Contact Info Section */}
          <div className="sidepanel-contact-section">
            <h6 className="contact-title">Request a Callback</h6>
            <a href="tel:+18888667566" className="contact-info-link">
              <span>☎ +1 (888) 866-7566</span>
            </a>
            <a href="mailto:medicare3103@gmail.com" className="contact-info-link">
              <span>✉ medicare3103@gmail.com</span>
            </a>
          </div>

          {!hideAuth && (
            <div className="sidepanel-footer">
              {user ? (
                <>
                  <span className="text-muted text-center mb-2">Logged in as <strong>{user.username || user.email || user.phone}</strong></span>
                  {(user.username === 'admin' || user.role === 'admin') && (
                    <Link to="/admin" className="btn btn-outline-danger w-100 mb-2" onClick={toggleSidebar}>Admin Dashboard</Link>
                  )}
                  <Link to="/dashboard" className="btn btn-outline-primary w-100 mb-2" onClick={toggleSidebar}>My Dashboard</Link>
                  <Button variant="danger" className="w-100" onClick={() => { logout(); toggleSidebar(); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" className="btn btn-outline-secondary w-100" onClick={toggleSidebar}>
                  Sign In / Register (Optional)
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Custom styles for hoverable navigation dropdowns
const dropdownStyles = `
  @media (min-width: 992px) {
    .custom-nav-dropdown:hover .dropdown-menu {
      display: block !important;
      margin-top: 0;
    }
  }
  .custom-nav-dropdown .dropdown-menu {
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    padding: 8px 0;
    min-width: 220px;
    animation: headerFadeIn 0.15s ease-out;
  }
  .custom-nav-dropdown .dropdown-item {
    font-weight: 500;
    color: #475569;
    padding: 8px 20px;
    font-size: 0.9rem;
    transition: all 0.15s ease;
  }
  .custom-nav-dropdown .dropdown-item:hover {
    background-color: #f1f5f9;
    color: var(--primary-color, #0b5cff) !important;
    padding-left: 24px;
  }
  .custom-nav-dropdown .nav-link {
    display: flex;
    align-items: center;
  }
  @keyframes headerFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.appendChild(document.createTextNode(dropdownStyles));
  document.head.appendChild(styleElement);
}

export default Header;
