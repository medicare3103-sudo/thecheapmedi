import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';

const CATEGORIES = [
  'Diabetes', "Men's Health", 'Eye Care', 'Asthma', 
  'Skin Care', 'Blood Pressure', "Women's Health", 'Antibiotics'
];

const BRANDS = ['Pfizer', 'Novartis', 'Merck', 'Sanofi', 'GSK', 'AstraZeneca'];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for products
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Read current filters from URL
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sort_by') || '';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  // Local state for UI inputs (so it doesn't fetch on every keystroke for price/search)
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]); // Re-fetch when URL changes

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const skip = (currentPage - 1) * limit;
      
      const params = {
        skip,
        limit,
        ...(currentSearch && { search: currentSearch }),
        ...(currentCategory && { category: currentCategory }),
        ...(currentBrand && { brand: currentBrand }),
        ...(currentMinPrice && { min_price: currentMinPrice }),
        ...(currentMaxPrice && { max_price: currentMaxPrice }),
        ...(currentSort && { sort_by: currentSort })
      };

      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/products/`, { params });
      setProducts(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to update URL params
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter change
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    if (localSearch) newParams.set('search', localSearch);
    else newParams.delete('search');
    
    if (localMinPrice) newParams.set('min_price', localMinPrice);
    else newParams.delete('min_price');
    
    if (localMaxPrice) newParams.set('max_price', localMaxPrice);
    else newParams.delete('max_price');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Header />
      
      <div className="bg-light py-4 border-bottom">
        <Container>
          <h2 className="fw-bold mb-0">
            {currentSearch ? `Search Results` : 'Shop All Products'}
          </h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">
                {currentSearch ? 'Search Results' : 'Products'}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <Container className="my-5 min-vh-100">
        <Row>
          {/* SIDEBAR FILTERS */}
          <Col lg={3} className="mb-4">
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Header className="bg-white border-bottom pt-3 pb-2 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Filters</h5>
                <Button variant="link" size="sm" className="text-decoration-none p-0" onClick={handleClearFilters}>Clear All</Button>
              </Card.Header>
              <Card.Body>
                
                {/* Search */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Search</h6>
                  <InputGroup>
                    <Form.Control
                      placeholder="Keyword..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                    />
                    <Button variant="outline-primary" onClick={handleApplyFilters}>Go</Button>
                  </InputGroup>
                </div>

                {/* Categories */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Categories</h6>
                  <div className="d-flex flex-column gap-2">
                    <Form.Check 
                      type="radio" 
                      label="All Categories" 
                      name="categoryGroup"
                      checked={currentCategory === ''}
                      onChange={() => updateParam('category', '')}
                    />
                    {CATEGORIES.map(cat => (
                      <Form.Check 
                        key={cat}
                        type="radio" 
                        label={cat} 
                        name="categoryGroup"
                        checked={currentCategory === cat}
                        onChange={() => updateParam('category', cat)}
                      />
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Brands</h6>
                  <Form.Select 
                    value={currentBrand} 
                    onChange={(e) => updateParam('brand', e.target.value)}
                  >
                    <option value="">All Brands</option>
                    {BRANDS.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </Form.Select>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Price Range ($)</h6>
                  <Row className="g-2 align-items-center">
                    <Col xs={5}>
                      <Form.Control 
                        type="number" 
                        placeholder="Min" 
                        value={localMinPrice} 
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                      />
                    </Col>
                    <Col xs={2} className="text-center">-</Col>
                    <Col xs={5}>
                      <Form.Control 
                        type="number" 
                        placeholder="Max" 
                        value={localMaxPrice} 
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Button variant="outline-primary" className="w-100 mt-3 btn-sm" onClick={handleApplyFilters}>Apply Price</Button>
                </div>

              </Card.Body>
            </Card>
          </Col>

          {/* MAIN PRODUCT GRID */}
          <Col lg={9}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded-3">
              <span className="text-muted fw-500 mb-2 mb-md-0">
                Showing <strong>{products.length}</strong> of <strong>{total}</strong> results
              </span>
              <div className="d-flex align-items-center">
                <span className="me-2 text-muted fw-500">Sort by:</span>
                <Form.Select 
                  value={currentSort} 
                  onChange={(e) => updateParam('sort_by', e.target.value)}
                  style={{ width: 'auto' }}
                  className="fw-500"
                >
                  <option value="">Best Match</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </Form.Select>
              </div>
            </div>

            {/* Product Grid */}
            <ProductSection 
              title={currentSearch ? `Search Results for "${currentSearch}"` : currentCategory ? currentCategory : "All Products"} 
              products={products} 
              isLoading={isLoading} 
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination className="shadow-sm">
                  <Pagination.Prev 
                    disabled={currentPage === 1} 
                    onClick={() => updateParam('page', currentPage - 1)} 
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item 
                      key={i + 1} 
                      active={i + 1 === currentPage}
                      onClick={() => updateParam('page', i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next 
                    disabled={currentPage === totalPages} 
                    onClick={() => updateParam('page', currentPage + 1)} 
                  />
                </Pagination>
              </div>
            )}

          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default Products;
