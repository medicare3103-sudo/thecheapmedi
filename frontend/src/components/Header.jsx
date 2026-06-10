import React from 'react';
import { Container, Form, InputGroup, Button, Navbar, Nav, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header({ hideAuth = false }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const [openAccordion, setOpenAccordion] = React.useState(null);

  const handleAccordionToggle = (item) => {
    setOpenAccordion(openAccordion === item ? null : item);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

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
                  />
                  <Button type="submit" className="search-btn">
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
                    <button className="btn btn-sm btn-link text-danger text-decoration-none p-0 fw-bold" onClick={logout}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="action-icon-link" aria-label="Account">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </Link>
                )
              )}

              {/* Cart Icon */}
              <Link to="/cart" className="action-icon-link position-relative" aria-label="Cart">
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
          <Nav className="me-auto fw-500">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/categories">All Categories</Nav.Link>
            <Nav.Link as={Link} to="/category/mens-health">Men's Health</Nav.Link>
            <Nav.Link as={Link} to="/category/womens-health">Women's Health</Nav.Link>
            <Nav.Link as={Link} to="/category/beauty-skin-care">Skin Care</Nav.Link>
            <Nav.Link as={Link} to="/category/hiv-herpes">HIV & Herpes</Nav.Link>
            <Nav.Link as={Link} to="/category/anti-cancer">Anti Cancer</Nav.Link>
            <Nav.Link as={Link} to="/blogs">Health Blog</Nav.Link>
          </Nav>
          {user && (
            <Nav>
              <Link to="/admin" className="btn btn-outline-danger btn-sm fw-bold me-2">Admin Dashboard</Link>
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
            {/* Men's Health Accordion */}
            <div className="sidepanel-accordion-item">
              <button 
                className={`sidepanel-accordion-header ${openAccordion === 'mensHealth' ? 'active' : ''}`}
                onClick={() => handleAccordionToggle('mensHealth')}
              >
                <span>Men's Health</span>
                <span className="accordion-arrow">▼</span>
              </button>
              <div className={`sidepanel-accordion-collapse ${openAccordion === 'mensHealth' ? 'show' : ''}`}>
                <div className="sidepanel-accordion-body">
                  <Link to="/search/Viagra" className="sidepanel-sub-link" onClick={toggleSidebar}>Generic Viagra</Link>
                  <Link to="/search/Vidalista" className="sidepanel-sub-link" onClick={toggleSidebar}>Vidalista</Link>
                  <Link to="/search/Cenforce" className="sidepanel-sub-link" onClick={toggleSidebar}>Cenforce</Link>
                  <Link to="/search/Kamagra" className="sidepanel-sub-link" onClick={toggleSidebar}>Kamagra</Link>
                  <Link to="/search/Tadalafil" className="sidepanel-sub-link" onClick={toggleSidebar}>Tadalafil</Link>
                  <Link to="/search/Sildenafil" className="sidepanel-sub-link" onClick={toggleSidebar}>Sildenafil</Link>
                </div>
              </div>
            </div>

            {/* Women's Health Accordion */}
            <div className="sidepanel-accordion-item">
              <button 
                className={`sidepanel-accordion-header ${openAccordion === 'womenCare' ? 'active' : ''}`}
                onClick={() => handleAccordionToggle('womenCare')}
              >
                <span>Women's Health</span>
                <span className="accordion-arrow">▼</span>
              </button>
              <div className={`sidepanel-accordion-collapse ${openAccordion === 'womenCare' ? 'show' : ''}`}>
                <div className="sidepanel-accordion-body">
                  <Link to="/search/Female%20Viagra" className="sidepanel-sub-link" onClick={toggleSidebar}>Female Viagra</Link>
                  <Link to="/search/Osteoporosis" className="sidepanel-sub-link" onClick={toggleSidebar}>Osteoporosis</Link>
                </div>
              </div>
            </div>

            {/* Eye Care Accordion */}
            <div className="sidepanel-accordion-item">
              <button 
                className={`sidepanel-accordion-header ${openAccordion === 'eyeCare' ? 'active' : ''}`}
                onClick={() => handleAccordionToggle('eyeCare')}
              >
                <span>Eye Care</span>
                <span className="accordion-arrow">▼</span>
              </button>
              <div className={`sidepanel-accordion-collapse ${openAccordion === 'eyeCare' ? 'show' : ''}`}>
                <div className="sidepanel-accordion-body">
                  <Link to="/search/Eye%20Drop" className="sidepanel-sub-link" onClick={toggleSidebar}>Eye Drops</Link>
                  <Link to="/search/Eye%20Ointment" className="sidepanel-sub-link" onClick={toggleSidebar}>Eye Ointment & Gel</Link>
                  <Link to="/search/Eye%20Care%20Capsules" className="sidepanel-sub-link" onClick={toggleSidebar}>Eye Care Capsules</Link>
                  <Link to="/search/Eye%20Care%20Tablets" className="sidepanel-sub-link" onClick={toggleSidebar}>Eye Care Tablets</Link>
                  <Link to="/search/Eye%20Injections" className="sidepanel-sub-link" onClick={toggleSidebar}>Eye Injections</Link>
                </div>
              </div>
            </div>

            {/* Pain Relief Accordion */}
            <div className="sidepanel-accordion-item">
              <button 
                className={`sidepanel-accordion-header ${openAccordion === 'painRelief' ? 'active' : ''}`}
                onClick={() => handleAccordionToggle('painRelief')}
              >
                <span>Pain Relief</span>
                <span className="accordion-arrow">▼</span>
              </button>
              <div className={`sidepanel-accordion-collapse ${openAccordion === 'painRelief' ? 'show' : ''}`}>
                <div className="sidepanel-accordion-body">
                  <Link to="/search/Arthritis" className="sidepanel-sub-link" onClick={toggleSidebar}>Arthritis</Link>
                  <Link to="/search/Asthma" className="sidepanel-sub-link" onClick={toggleSidebar}>Asthma</Link>
                  <Link to="/search/Weight%20Loss" className="sidepanel-sub-link" onClick={toggleSidebar}>Weight Loss</Link>
                </div>
              </div>
            </div>

            {/* Skin Care Direct Link */}
            <Link to="/category/beauty-skin-care" className="sidepanel-nav-link-item" onClick={toggleSidebar}>
              Skin Care
            </Link>

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
                  <Link to="/admin" className="btn btn-outline-danger w-100 mb-2" onClick={toggleSidebar}>Admin Dashboard</Link>
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

export default Header;
