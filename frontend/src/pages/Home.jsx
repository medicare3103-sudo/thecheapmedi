import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

function Home() {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState({
    title: "The Cheap Pharma - Online Pharmacy",
    description: "Buy high-quality, affordable generic medicines online. The Cheap Pharma is your trusted online pharmacy portal for safe, reliable, and discreet home delivery with deals on every purchase.",
    keywords: ""
  });
  const navigate = useNavigate();

  useSEO({
    title: seoSettings.title,
    description: seoSettings.description,
    keywords: seoSettings.keywords || undefined
  });

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

      try {
        const response = await axios.get(`${baseUrl}/settings/seo`);
        const data = response.data;
        if (data) {
          setSeoSettings({
            title: data.homepage_meta_title || "The Cheap Pharma - Online Pharmacy",
            description: data.homepage_meta_description || "Buy high-quality, affordable generic medicines online. The Cheap Pharma is your trusted online pharmacy portal for safe, reliable, and discreet home delivery with deals on every purchase.",
            keywords: data.homepage_focus_keyword || ""
          });
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
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
              { name: "MEN'S HEALTH", dbName: "Men's Health", img: '/categories/mens_health.png' },
              { name: "WOMEN'S HEALTH", dbName: "Women's Health", img: '/categories/womens_health.png' },
              { name: 'ANTI CANCER', dbName: 'Anti Cancer', img: '/categories/anti_cancer.png' },
              { name: 'EYE CARE', dbName: 'Eye Care', img: '/categories/eye_care.png' },
              { name: 'HIV AND HERPES', dbName: 'HIV & Herpes', img: '/categories/hiv_herpes.png' }
            ].map(cat => (
              <Col xs={6} md={4} lg={2} key={cat.name} className="mb-4">
                <div 
                  className="category-card" 
                  onClick={() => {
                    const slug = cat.dbName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    navigate(`/category/${slug}`);
                  }}
                >
                  <div className="category-image-circle">
                    <img src={cat.img} alt={cat.name} />
                  </div>
                  <div className="category-title-text mt-2 fw-bold text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>{cat.name}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Dynamic Product Sections */}
        <ProductSection 
          title="Featured Products" 
          products={(products || []).filter(p => p.is_featured)} 
          isLoading={isLoading} 
        />
        
        <ProductSection 
          title="Trending Products" 
          products={(products || []).filter(p => p.is_trending)} 
          isLoading={isLoading} 
        />
        
        <ProductSection 
          title="Best Selling Products" 
          products={(products || []).filter(p => p.is_bestselling)} 
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
        <div className="py-5 text-start bg-white p-4 p-md-5 rounded-4 shadow-sm border mt-5 choose-us-wrapper animate__animated animate__fadeIn">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">Our Promise</span>
            <h2 className="fw-bold text-dark mb-2 font-display fs-1">Why Choose The Cheap Pharma?</h2>
            <p className="text-muted mx-auto fs-5" style={{ maxWidth: '700px' }}>
              We are dedicated to building a platform that delivers premium-quality healthcare products directly to your doorstep with absolute security, complete transparency, and unmatched affordability.
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="h-100 border-0 bg-light rounded-4 p-4 feature-item-card">
                <div className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-tags-fill fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Direct-to-Consumer Savings</h5>
                <p className="text-muted small mb-0 leading-relaxed">
                  Save 40% to 70% compared to traditional retail prices. By sourcing directly from manufacturers and removing middleman margins, we ensure your healthcare budget goes much further.
                </p>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="h-100 border-0 bg-light rounded-4 p-4 feature-item-card">
                <div className="d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-3 mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-shield-check-fill fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">100% Quality Assurance</h5>
                <p className="text-muted small mb-0 leading-relaxed">
                  Every product comes with batch codes and manufacturer seals sourced from WHO-GMP certified facilities. We have a zero-tolerance policy for gray-market or counterfeit stock.
                </p>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="h-100 border-0 bg-light rounded-4 p-4 feature-item-card">
                <div className="d-flex align-items-center justify-content-center bg-info-subtle text-info rounded-3 mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-truck fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Hassle-Free Home Delivery</h5>
                <p className="text-muted small mb-0 leading-relaxed">
                  Enjoy reliable shipping across the United States. Packages are tracked end-to-end and arrive within 7 to 22 business days. Delivery is free for all orders above $189.
                </p>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="h-100 border-0 bg-light rounded-4 p-4 feature-item-card">
                <div className="d-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-3 mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-capsule fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Generic & FDA-Approved Choices</h5>
                <p className="text-muted small mb-0 leading-relaxed">
                  Get the same therapeutic benefits as brand-name drugs at a fraction of the cost. We stock popular FDA-equivalent generics such as Cenforce, Fildena, Vidalista, and more.
                </p>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="h-100 border-0 bg-light rounded-4 p-4 feature-item-card">
                <div className="d-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-3 mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-eye-slash-fill fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Discreet & Secure Packaging</h5>
                <p className="text-muted small mb-0 leading-relaxed">
                  To protect your medical privacy, all orders are shipped in unmarked, neutral packaging. There are no pharmacy labels or contents listed on the box, ensuring total confidentiality.
                </p>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="h-100 border-0 bg-light rounded-4 p-4 feature-item-card">
                <div className="d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary rounded-3 mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-lock-fill fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Total Security & Encryption</h5>
                <p className="text-muted small mb-0 leading-relaxed">
                  Your privacy and data security are absolute. All transactions and checkout processes are fully encrypted and protected using Alpha SSL and McAfee Secure.
                </p>
              </Card>
            </Col>
          </Row>

          
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
                  <div 
                    className="overflow-hidden" 
                    style={{ height: '200px', backgroundColor: '#f0f4f8' }}
                  >
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          objectPosition: 'center',
                          display: 'block'
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <i className="bi bi-image text-muted" style={{fontSize: '2.5rem'}}></i>
                      </div>
                    )}
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
