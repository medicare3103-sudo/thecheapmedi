import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
      try {
        const response = await axios.get(`${baseUrl}/products/`);
        setProducts(response.data.items || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }

      try {
        const response = await axios.get(`${baseUrl}/blogs/`);
        setBlogs((response.data || []).slice(0, 3));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <>
      <Header />
      <HeroBanner />

      <Container className="my-5">
        

        {/* Shop By Category */}
        <div className="py-5 text-center">
          <h3 className="section-title">Shop By Category</h3>
          <Row className="mt-4 justify-content-center">
            {[
              { name: "Men's Health", dbName: "Men's Health", img: '/categories/mens_health.png' },
              { name: 'Women Care', dbName: "Women's Health", img: '/categories/womens_health.png' },
              { name: 'Asthma', dbName: 'Asthma', img: '/categories/asthma.png' },
              { name: 'Skin Care', dbName: 'Skin Care', img: '/categories/skincare.png' },
              { name: 'Diabetes', dbName: 'Diabetes', img: '/categories/diabetes.png' },
              { name: 'Eye Care', dbName: 'Eye Care', img: '/categories/eye_care.png' }
            ].map(cat => (
              <Col xs={6} md={4} lg={2} key={cat.name} className="mb-4">
                <div 
                  className="category-card" 
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.dbName)}`)}
                >
                  <div className="category-image-circle">
                    <img src={cat.img} alt={cat.name} />
                  </div>
                  <div className="category-title-text">{cat.name}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Dynamic Product Sections */}
        <ProductSection 
          title="Featured Products" 
          products={(products || []).slice(0, 4)} 
          isLoading={isLoading} 
        />
        
        <ProductSection 
          title="Trending Products" 
          products={(products || []).slice(4, 12)} 
          isLoading={isLoading} 
        />
        
        <ProductSection 
          title="Best Selling Products" 
          products={(products || []).slice(12, 16)} 
          isLoading={isLoading} 
        />
        
        {/* Fake Reviews Section */}
        <div className="py-5 text-center mt-5 bg-white shadow-sm border rounded-4">
          <h2 className="fw-bold text-dark mb-2">Reviews</h2>
          <div className="d-flex justify-content-center align-items-center mb-5 gap-2">
            <span className="fw-bold text-primary">Excellent</span>
            <div className="text-warning">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
            </div>
            <span><strong>4.63</strong> based on <strong>925</strong> reviews</span>
          </div>
          
          <div className="marquee-container py-2">
            <div className="marquee-content gap-4 px-3">
            {[
              { name: 'Anonymous', text: 'Received product as requested on time.', days: 5 },
              { name: 'Lee Treadway', text: 'Very fast service and awesome products. They are the best.', days: 5 },
              { name: 'Anonymous', text: 'It for a very good price I would recommend to anyone', days: 6 },
              { name: 'Sarah M.', text: 'Excellent service, definitely recommend this company to others.', days: 6 },
              { name: 'John Doe', text: 'Great quality and fast delivery. 10/10.', days: 2 },
              { name: 'Emily R.', text: 'Best pharmacy experience I have had online.', days: 1 },
              { name: 'Anonymous', text: 'Customer service was very helpful with my prescription.', days: 3 },
              // Duplicate the array for a seamless infinite scroll loop
              { name: 'Anonymous', text: 'Received product as requested on time.', days: 5 },
              { name: 'Lee Treadway', text: 'Very fast service and awesome products. They are the best.', days: 5 },
              { name: 'Anonymous', text: 'It for a very good price I would recommend to anyone', days: 6 },
              { name: 'Sarah M.', text: 'Excellent service, definitely recommend this company to others.', days: 6 },
              { name: 'John Doe', text: 'Great quality and fast delivery. 10/10.', days: 2 },
              { name: 'Emily R.', text: 'Best pharmacy experience I have had online.', days: 1 },
              { name: 'Anonymous', text: 'Customer service was very helpful with my prescription.', days: 3 }
            ].map((review, idx) => (
              <div key={idx} style={{ width: '300px', flexShrink: 0, whiteSpace: 'normal' }} className="text-start">
                <div className="bg-primary bg-opacity-10 rounded-4 p-4 h-100 position-relative shadow-sm border-0 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small">{review.name}</span>
                    <div className="text-warning" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <div className="text-primary small fw-500 mb-3" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-patch-check-fill me-1"></i>
                    Verified Customer
                  </div>
                  <p className="text-dark fw-500 mb-4">{review.text}</p>
                  <div className="mt-auto text-end small text-muted w-100" style={{ fontSize: '0.8rem' }}>
                    {review.days} days ago
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
        
        {/* Popular Manufacturer */}
        <div className="py-5 text-center mt-5">
          <h3 className="section-title">Popular Manufacturer</h3>
          <div className="brand-scroll-container">
            <div className="brand-scroll-content">
              {/* Unique list of 12 brands */}
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M10,5 Q25,20 10,35 M25,5 Q10,20 25,35" stroke="#0052cc" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <circle cx="10" cy="5" r="3" fill="#0052cc"/>
                    <circle cx="25" cy="5" r="3" fill="#0b57d0"/>
                    <circle cx="10" cy="35" r="3" fill="#0b57d0"/>
                    <circle cx="25" cy="35" r="3" fill="#0052cc"/>
                    <line x1="13" y1="12" x2="22" y2="12" stroke="#0052cc" strokeWidth="2"/>
                    <line x1="13" y1="28" x2="22" y2="28" stroke="#0052cc" strokeWidth="2"/>
                  </g>
                  <text x="50" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="28" fill="#0052cc" letterSpacing="-1">Cipla</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 12)">
                    <circle cx="18" cy="18" r="8" fill="#f97316"/>
                    <path d="M18,2 L18,6 M18,30 L18,34 M2,18 L6,18 M30,18 L34,18 M7,7 L10,10 M26,26 L29,29 M7,29 L10,26 M26,7 L29,10" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                  </g>
                  <text x="56" y="32" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="16" fill="#1e293b" letterSpacing="0.5">SUN</text>
                  <text x="56" y="46" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="12" fill="#64748b" letterSpacing="1">PHARMA</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M12,4 C18,4 24,10 24,18 C24,26 12,34 12,34 C12,34 0,26 0,18 C0,10 6,4 12,4 Z" fill="#701a75"/>
                    <circle cx="12" cy="16" r="4" fill="#fdf4ff"/>
                  </g>
                  <text x="48" y="36" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="20" fill="#701a75">Dr.Reddy's</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <rect x="2" y="2" width="28" height="28" rx="8" fill="#0284c7"/>
                    <path d="M9,16 L14,21 L23,11" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <text x="54" y="37" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="26" fill="#0284c7" letterSpacing="1">LUPIN</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M8,18 C8,10 14,8 18,18 C22,8 28,10 28,18 C28,26 18,32 18,32 C18,32 8,26 8,18 Z" fill="#ef4444"/>
                    <circle cx="18" cy="18" r="5" fill="#0f172a"/>
                  </g>
                  <text x="52" y="36" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#0f172a" letterSpacing="-0.5">Mankind</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M15,2 L2,28 L28,28 Z" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinejoin="round"/>
                    <line x1="8" y1="18" x2="22" y2="18" stroke="#0ea5e9" strokeWidth="4"/>
                  </g>
                  <text x="54" y="38" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="24" fill="#0ea5e9">Abbott</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M5,5 L25,5 L10,25 L30,25" stroke="#0f766e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="5" cy="5" r="3" fill="#0d9488"/>
                    <circle cx="30" cy="25" r="3" fill="#0d9488"/>
                  </g>
                  <text x="54" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="26" fill="#0f766e" letterSpacing="-0.5">Zydus</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M28,15 C28,7 21,2 15,2 C8,2 2,7 2,15 C2,23 8,28 15,28 L20,28 L20,18 L15,18" stroke="#be123c" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <text x="52" y="37" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#be123c">glenmark</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M15,2 L28,24 C30,28 26,32 20,32 L10,32 C4,32 0,28 2,24 Z" fill="none" stroke="#0369a1" strokeWidth="3" strokeLinejoin="round"/>
                    <circle cx="15" cy="18" r="3" fill="#0284c7"/>
                  </g>
                  <text x="52" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="24" fill="#0369a1">ALKEM</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M4,4 L28,4 M16,4 L16,28 M10,16 L22,16" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round"/>
                  </g>
                  <text x="52" y="38" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#1e3a8a">torrent</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <circle cx="15" cy="15" r="12" fill="none" stroke="#b91c1c" strokeWidth="3"/>
                    <path d="M15,5 Q20,15 15,25 Q10,15 15,5" fill="#1e3a8a"/>
                  </g>
                  <text x="52" y="37" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" fill="#1e3a8a">AUROBINDO</text>
                </svg>
              </div>
              <div className="manufacturer-card">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <rect x="2" y="2" width="26" height="26" rx="6" fill="none" stroke="#0891b2" strokeWidth="3"/>
                    <circle cx="15" cy="15" r="5" fill="#0891b2"/>
                  </g>
                  <text x="52" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="24" fill="#0891b2">Biocon</text>
                </svg>
              </div>

              {/* Duplicated list strictly for mobile infinite loop with 'brand-duplicate' class */}
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M10,5 Q25,20 10,35 M25,5 Q10,20 25,35" stroke="#0052cc" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <circle cx="10" cy="5" r="3" fill="#0052cc"/>
                    <circle cx="25" cy="5" r="3" fill="#0b57d0"/>
                    <circle cx="10" cy="35" r="3" fill="#0b57d0"/>
                    <circle cx="25" cy="35" r="3" fill="#0052cc"/>
                    <line x1="13" y1="12" x2="22" y2="12" stroke="#0052cc" strokeWidth="2"/>
                    <line x1="13" y1="28" x2="22" y2="28" stroke="#0052cc" strokeWidth="2"/>
                  </g>
                  <text x="50" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="28" fill="#0052cc" letterSpacing="-1">Cipla</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 12)">
                    <circle cx="18" cy="18" r="8" fill="#f97316"/>
                    <path d="M18,2 L18,6 M18,30 L18,34 M2,18 L6,18 M30,18 L34,18 M7,7 L10,10 M26,26 L29,29 M7,29 L10,26 M26,7 L29,10" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                  </g>
                  <text x="56" y="32" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="16" fill="#1e293b" letterSpacing="0.5">SUN</text>
                  <text x="56" y="46" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="12" fill="#64748b" letterSpacing="1">PHARMA</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M12,4 C18,4 24,10 24,18 C24,26 12,34 12,34 C12,34 0,26 0,18 C0,10 6,4 12,4 Z" fill="#701a75"/>
                    <circle cx="12" cy="16" r="4" fill="#fdf4ff"/>
                  </g>
                  <text x="48" y="36" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="20" fill="#701a75">Dr.Reddy's</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <rect x="2" y="2" width="28" height="28" rx="8" fill="#0284c7"/>
                    <path d="M9,16 L14,21 L23,11" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <text x="54" y="37" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="26" fill="#0284c7" letterSpacing="1">LUPIN</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M8,18 C8,10 14,8 18,18 C22,8 28,10 28,18 C28,26 18,32 18,32 C18,32 8,26 8,18 Z" fill="#ef4444"/>
                    <circle cx="18" cy="18" r="5" fill="#0f172a"/>
                  </g>
                  <text x="52" y="36" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#0f172a" letterSpacing="-0.5">Mankind</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M15,2 L2,28 L28,28 Z" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinejoin="round"/>
                    <line x1="8" y1="18" x2="22" y2="18" stroke="#0ea5e9" strokeWidth="4"/>
                  </g>
                  <text x="54" y="38" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="24" fill="#0ea5e9">Abbott</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M5,5 L25,5 L10,25 L30,25" stroke="#0f766e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="5" cy="5" r="3" fill="#0d9488"/>
                    <circle cx="30" cy="25" r="3" fill="#0d9488"/>
                  </g>
                  <text x="54" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="26" fill="#0f766e" letterSpacing="-0.5">Zydus</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M28,15 C28,7 21,2 15,2 C8,2 2,7 2,15 C2,23 8,28 15,28 L20,28 L20,18 L15,18" stroke="#be123c" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <text x="52" y="37" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#be123c">glenmark</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M15,2 L28,24 C30,28 26,32 20,32 L10,32 C4,32 0,28 2,24 Z" fill="none" stroke="#0369a1" strokeWidth="3" strokeLinejoin="round"/>
                    <circle cx="15" cy="18" r="3" fill="#0284c7"/>
                  </g>
                  <text x="52" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="24" fill="#0369a1">ALKEM</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <path d="M4,4 L28,4 M16,4 L16,28 M10,16 L22,16" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round"/>
                  </g>
                  <text x="52" y="38" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#1e3a8a">torrent</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <circle cx="15" cy="15" r="12" fill="none" stroke="#b91c1c" strokeWidth="3"/>
                    <path d="M15,5 Q20,15 15,25 Q10,15 15,5" fill="#1e3a8a"/>
                  </g>
                  <text x="52" y="37" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" fill="#1e3a8a">AUROBINDO</text>
                </svg>
              </div>
              <div className="manufacturer-card brand-duplicate">
                <svg viewBox="0 0 200 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(15, 10)">
                    <rect x="2" y="2" width="26" height="26" rx="6" fill="none" stroke="#0891b2" strokeWidth="3"/>
                    <circle cx="15" cy="15" r="5" fill="#0891b2"/>
                  </g>
                  <text x="52" y="38" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="24" fill="#0891b2">Biocon</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Why Choose Us Section */}
        <div className="py-5 text-start bg-white p-4 p-md-5 rounded-4 shadow-sm border mt-5">
          <div className="content-section-header">Why Should You Choose The Cheap Pharma?</div>
          <p className="text-muted leading-relaxed mb-3">
            At <strong>The Cheap Pharma</strong>, you will find the most comprehensive and affordable internet portal. We will help you complete all your shopping needs for medicines from a single place. We make it possible for you to buy a wide variety of medications from one site.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            We are among the most dependable and highly recommended websites for purchasing medications online. There are numerous explanations for this.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            We make it enjoyable for you to shop online by providing deals and promotions on every purchase. When was the last time you went to a website that promised discounts and cashback on every purchase?
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Our goal and objective are to build a platform that is solely focused on making sure that our clients are pleased and satisfied with the services we provide.
          </p>

          <div className="content-section-header">The Cheap Pharma Offers Generic Medications</div>
          <p className="text-muted leading-relaxed mb-3">
            We aim to treat every type of male sexual dysfunction, which means that we offer medications to treat impotence. <strong>thecheappharma.com</strong> is the safest way to get generic medicines because it is a reputable pharmacy. We also treat premature ejaculation and other types of male sexual dysfunction as well. Generic versions of all the different erectile dysfunction medications currently available are in stock. Prices for generic Viagra, generic Cialis, and Generic Levitra are incredibly low on our website.
            Generic medications deliver the same therapeutic benefit as their brand-name counterparts at a fraction of the cost — and <strong>thecheappharma.com</strong> is one of the most well-stocked generic pharmacies operating in the United States today. Whether you are looking for treatments related to men's health, chronic conditions, or general wellness, our generic range covers it all.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            From Sildenafil and Tadalafil for erectile dysfunction to Vardenafil and Dapoxetine for performance and endurance, we stock the full spectrum of FDA-equivalent generics. Each formulation is sourced from WHO-GMP certified manufacturers, ensuring pharmaceutical-grade quality regardless of the price tag.
          </p>

          <div className="content-section-header">100% Quality Assurance By The Cheap Pharma</div>
          <p className="text-muted leading-relaxed mb-4">
            Quality is not a checkbox for us — it is a commitment built into every layer of our operation. Our sourcing team works exclusively with certified pharmaceutical manufacturers and licensed distributors who comply with US import and safety regulations. Every batch we receive undergoes independent verification before being listed for sale, giving you documented proof of authenticity on every order.
          </p>

          <div className="content-section-header">100% Genuine Medicine:</div>
          <p className="text-muted leading-relaxed mb-4">
            Counterfeit medication is a serious public health risk, and we take that threat seriously. Every product shipped from <strong>The Cheap Pharma</strong> comes with verifiable batch codes and manufacturer seals, allowing you to independently confirm the legitimacy of your purchase. We have a zero-tolerance policy for gray-market or unverified stock — period.
          </p>

          <div className="content-section-header">Reliability:</div>
          <p className="text-muted leading-relaxed mb-4">
            Consistency is what separates a trustworthy pharmacy from a temporary storefront. We have served hundreds of thousands of repeat customers across all 50 states, maintaining a fulfillment accuracy rate above 99.5%. Our cold-chain infrastructure ensures temperature-sensitive medications like insulin are stored and shipped under precise conditions, preserving full efficacy upon delivery.
          </p>

          <div className="content-section-header">Save Money At The Cheap Pharma:</div>
          <p className="text-muted leading-relaxed mb-4">
            Healthcare costs in the United States have skyrocketed — but your medication bill does not have to. <strong>The Cheap Pharma</strong> regularly benchmarks its prices against both retail and competing online pharmacies to ensure you are always getting the best deal available. Stack our first-time buyer discounts with ongoing seasonal sales, and you can routinely save 40–70% compared to standard pharmacy retail prices.
          </p>

          <div className="content-section-header">Easy Return And Refund:</div>
          <p className="text-muted leading-relaxed mb-4">
            We stand firmly behind every order we ship. In the unlikely event that your package arrives damaged, incorrect, or incomplete, our customer resolution team will process a priority replacement or issue a full refund — no lengthy forms, no back-and-forth delays. Simply reach out within 48 hours of delivery, and we will make it right. Most refunds are reflected within 5–7 business days.
          </p>

          <div className="content-section-header">Offers And Discounts:</div>
          <p className="text-muted leading-relaxed mb-4">
            Savings at <strong>The Cheap Pharma</strong> are not limited to sale events. We run year-round discount programs that include first-order coupon codes, referral rewards, bulk-buy pricing tiers, and exclusive newsletter-subscriber deals. Popular savings favorites include deep discounts on Vidalista, Fildena, Cenforce, Modalert, and Waklert — medications that otherwise carry steep retail markups at traditional pharmacies.
          </p>

          <div className="content-section-header">Affordable Prices:</div>
          <p className="text-muted leading-relaxed mb-4">
            Affordability is in our name and in our DNA. We eliminate the middleman markups that inflate prices at traditional pharmacies by sourcing directly from manufacturers. This direct-to-consumer model means you pay only for the medication itself — not for advertising budgets, premium shelf space, or franchisee margins. The result is some of the lowest per-pill prices you will find on any legitimate US-facing pharmacy platform.
          </p>

          <div className="content-section-header">A Hassle-Free Home Delivery Service:</div>
          <p className="text-muted leading-relaxed mb-4">
            We have got the fastest, safest, and most efficient shipping service. We give a great tracking number system around the world so the customer can track the package. You can also view every detail and an approximation. A package will arrive within 7-22 business days to arrive at the customer’s doorstep if the estimated time of arrival (ETA) is met.
          </p>

          <div className="content-section-header">Free Delivery:</div>
          <p className="text-muted leading-relaxed mb-4">
            We do provide free delivery of medications through our website, but not all brands of pills may be eligible for this service.
          </p>

          <div className="content-section-header">Free Delivery Order Over $199:</div>
          <p className="text-muted leading-relaxed mb-4">
            Our goal is to provide top-notch quality medicine at low prices. On our website, you will find many custom benefits available to every customer. When ordering on time, we offer a discount and free delivery on orders over $199.
          </p>

          <div className="content-section-header">Customer Support At The Cheap Pharma</div>
          <p className="text-muted leading-relaxed mb-4">
            Our main aim is to satisfy the customer rather than just completing the order promptly. We consistently go above and beyond to make sure that everything runs well in order to assure the happiness of our consumers.
          </p>

          <div className="content-section-header">Best Customer Support:</div>
          <p className="text-muted leading-relaxed mb-4">
            It is our goal to provide worry-free after-sale service to all of our customers, for this reason, we are informed at every step of the ordering process, from placing an order to delivering the shipment to the customer by E-mail and SMS. If you have any grievances, recommendations, or would like to share your experience, just let us know.
          </p>

          <div className="content-section-header">Hassle-Free Procedure:</div>
          <p className="text-muted leading-relaxed mb-4">
            It is quite simple to order products from <strong>The Cheap Pharma</strong>. You only need to add the product to your shopping cart and then you need to proceed to the checkout page where you just need to choose a payment method and you need to give your shipping address, and that is it.
          </p>

          <div className="content-section-header">Important Disclaimer:</div>
          <p className="text-muted leading-relaxed text-danger fw-500 mb-4">
            It is understood that all content such as information made available and media files is intended solely for informational purposes. Any action based on the information should always be preceded by consultation with a health professional.
          </p>

          <div className="content-section-header">Total Security:</div>
          <p className="text-muted leading-relaxed mb-4">
            You won’t need to worry about your personal information being stolen at <strong>The Cheap Pharma</strong>. All shopping carts and pages are secured by Alpha SSL and McAfee Secure, so you can shop worry-free.
          </p>

          <div className="content-section-header">FDA-Approved:</div>
          <p className="text-muted leading-relaxed mb-4">
            We only sell FDA-approved medications. We sell generic pills and FDA-Approved brands online through our portal, so you can cross-check that all generic substances of the medicines we sell have the FDA’s recommendation.
          </p>

          <div className="content-section-header">Secure Payment Method:</div>
          <p className="text-muted leading-relaxed mb-3">
            All debit and credit cards, including American Express, VISA, Mastercard, and Maestro, are accepted.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            After you pay by card over the Internet, you enter your card information on the lender’s secure page. The charge card chip provides the security of card payment information on the pages where the entire payment process is carried out. Your information is transmitted over a safe and fully secure SSL technology to avoid spamming.
          </p>

          <div className="content-section-header">Popular Generic Medicine:</div>
          <p className="text-muted leading-relaxed mb-0">
            Many generic drugs are available on the market, such as Cenforce 100 Mg, Fildena 100 Mg, Aurogra 100 Mg, Super P Force, Bluemen, and Malegra 100 Mg, among others.
          </p>
        </div>

        {/* Latest Blogs Section */}
        <div className="py-5 text-center mt-5">
          <h2 className="fw-bold text-dark mb-4">Latest Blogs</h2>
          <Row className="mt-4 justify-content-center">
            {blogs.map(blog => (
              <Col xs={12} md={4} key={blog.id} className="mb-4">
                <Card 
                  className="h-100 border-0 shadow-sm rounded-4 overflow-hidden text-start cursor-pointer blog-card-home"
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                >
                  <div className="overflow-hidden" style={{ height: '220px' }}>
                    <Card.Img 
                      variant="top" 
                      src={blog.image} 
                      alt={blog.title}
                      className="h-100 w-100 object-fit-cover"
                    />
                  </div>
                  <Card.Body className="p-4 bg-white d-flex flex-column">
                    <Card.Title className="fw-bold fs-5 text-dark mb-3 text-truncate">
                      {blog.title}
                    </Card.Title>
                    <div className="mt-auto text-muted d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                      <span className="me-2">📅</span> {blog.date}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>


      </Container>
      
      <Footer />
    </>
  );
}

export default Home;
