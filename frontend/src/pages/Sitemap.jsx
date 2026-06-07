import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const STATIC_PAGES = [
  { name: 'About Us', path: '/about' },
  { name: 'Health Blog', path: '/blogs' },
  { name: 'Cancellation Policy', path: '/cancellation-policy' },
  { name: 'Cart', path: '/cart' },
  { name: 'Disclaimer', path: '/disclaimer' },
  { name: 'Editorial Policy', path: '/editorial-policy' },
  { name: 'FAQs', path: '/faq' },
  { name: 'Guarantee', path: '/guarantee' },
  { name: 'Medical Disclaimer', path: '/medical-disclaimer' },
  { name: 'All Categories', path: '/categories' },
  { name: 'Checkout', path: '/checkout' },
  { name: 'Communication Policy', path: '/communication-policy' },
  { name: 'Drug Policy', path: '/drug-policy' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Cookie Policy', path: '/cookie-policy' },
  { name: 'Dr. Sarah Jenkins (Reviewer)', path: '/author/sarah-jenkins' },
  { name: 'David Vance (Writer)', path: '/author/david-vance' },
  { name: 'Elena Rostova (Writer)', path: '/author/elena-rostova' },
  { name: 'Home (Medicare)', path: '/' },
  { name: 'My Account / Dashboard', path: '/dashboard' }
];

function Sitemap() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallbacks
  const defaultCategories = [
    { name: "Diabetes" },
    { name: "Men's Health" },
    { name: "Eye Care" },
    { name: "Asthma" },
    { name: "Skin Care" },
    { name: "Blood Pressure" },
    { name: "Women's Health" },
    { name: "Antibiotics" },
    { name: "Ivermectin" },
    { name: "Anti Worm" }
  ];

  const defaultBlogs = [
    { id: 1, title: "Generic Vs Branded Chewable ED Pills: Which to Choose?" },
    { id: 2, title: "Fenbendazole Dosage For Human Parasitic Infections" },
    { id: 3, title: "Can You Take Viagra And Cialis Together?" },
    { id: 4, title: "5 Essential Tips for Managing Type 2 Diabetes" },
    { id: 5, title: "The Hidden Benefits of Daily Hydration" },
    { id: 6, title: "Heart-Healthy Superfoods You Need in Your Pantry" }
  ];

  useEffect(() => {
    const fetchSitemapData = async () => {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
      try {
        const catRes = await axios.get(`${API_URL}/categories/`);
        setCategories(catRes.data || defaultCategories);
      } catch (err) {
        console.error("Failed to load categories for sitemap, using fallback:", err);
        setCategories(defaultCategories);
      }

      try {
        const prodRes = await axios.get(`${API_URL}/products/`);
        setProducts(prodRes.data.items || []);
      } catch (err) {
        console.error("Failed to load products for sitemap:", err);
      }

      try {
        const blogRes = await axios.get(`${API_URL}/blogs/`);
        setBlogs(blogRes.data || defaultBlogs);
      } catch (err) {
        console.error("Failed to load blogs for sitemap, using fallback:", err);
        setBlogs(defaultBlogs);
      }
      setLoading(false);
    };

    fetchSitemapData();
  }, []);

  const slugify = (text) => {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Filtering lists
  const filteredPages = STATIC_PAGES.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  const hasResults = filteredPages.length > 0 || filteredCategories.length > 0 || filteredProducts.length > 0 || filteredBlogs.length > 0;

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />

      {/* Breadcrumb Header */}
      <div className="bg-light py-2 border-bottom">
        <Container>
          <div className="small text-muted">
            <Link to="/" className="text-decoration-none text-muted">Home</Link> &gt; sitemap
          </div>
        </Container>
      </div>

      <Container className="py-5 flex-grow-1">
        <div className="text-start mb-5">
          <h1 className="fw-bold text-dark display-4 mb-3 font-display">sitemap</h1>
          
          {/* Search Box */}
          <InputGroup style={{ maxWidth: '600px' }} className="shadow-sm mt-4">
            <InputGroup.Text className="bg-white border-end-0"><i className="bi bi-search text-muted"></i></InputGroup.Text>
            <Form.Control 
              type="text" 
              placeholder="Search pages, products & categories..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-start-0 ps-0 py-2 fs-5"
            />
          </InputGroup>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5 className="text-muted">Loading website index...</h5>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-4">
            <i className="bi bi-search text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold mt-2">No matching links found</h4>
            <p className="text-muted">Try adjusting your keyword search.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-5">
            
            {/* Pages Section */}
            {filteredPages.length > 0 && (
              <div>
                <h2 className="fw-bold text-dark mb-4 border-bottom pb-2 font-display fs-3">Pages</h2>
                <Row className="gy-2">
                  {filteredPages.map((page, idx) => (
                    <Col xs={12} md={6} lg={4} key={idx}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="text-primary fw-bold">•</span>
                        <Link to={page.path} className="text-dark text-decoration-none hover-primary transition-all fw-500">
                          {page.name}
                        </Link>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Categories Section */}
            {filteredCategories.length > 0 && (
              <div>
                <h2 className="fw-bold text-dark mb-4 border-bottom pb-2 font-display fs-3">Categories</h2>
                <Row className="gy-2">
                  {filteredCategories.map((category, idx) => (
                    <Col xs={12} md={6} lg={4} key={idx}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="text-primary fw-bold">•</span>
                        <Link to={`/category/${slugify(category.name)}`} className="text-dark text-decoration-none hover-primary transition-all fw-500">
                          {category.name}
                        </Link>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Products Section */}
            {filteredProducts.length > 0 && (
              <div>
                <h2 className="fw-bold text-dark mb-4 border-bottom pb-2 font-display fs-3">Products</h2>
                <Row className="gy-3">
                  {filteredProducts.map((product) => (
                    <Col xs={12} md={6} lg={4} key={product.id}>
                      <div className="d-flex align-items-start gap-2 mb-1">
                        <span className="text-primary fw-bold pt-1">•</span>
                        <div>
                          <Link to={`/product/${product.slug || product.id}`} className="text-dark text-decoration-none hover-primary transition-all fw-500 d-block">
                            {product.name}
                          </Link>
                          {product.brand && <small className="text-muted">Brand: {product.brand}</small>}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Blogs Section */}
            {filteredBlogs.length > 0 && (
              <div>
                <h2 className="fw-bold text-dark mb-4 border-bottom pb-2 font-display fs-3">Health Blog Articles</h2>
                <Row className="gy-2">
                  {filteredBlogs.map((blog) => (
                    <Col xs={12} md={6} lg={4} key={blog.id}>
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary fw-bold">•</span>
                        <Link to={`/blogs/${blog.id}`} className="text-dark text-decoration-none hover-primary transition-all fw-500 d-block">
                          {blog.title}
                        </Link>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
}

export default Sitemap;
