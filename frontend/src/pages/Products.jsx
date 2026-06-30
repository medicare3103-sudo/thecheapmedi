import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Pagination, Offcanvas, Badge } from 'react-bootstrap';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { getCategories } from '../api';
import useSEO from '../hooks/useSEO';



function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryName, searchQuery } = useParams();
  const navigate = useNavigate();
  
  // State for products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read current filters from URL
  const currentSearch = searchQuery ? decodeURIComponent(searchQuery) : (searchParams.get('search') || '');
  const slugToCategory = (slug) => {
    if (!slug) return '';
    const decoded = decodeURIComponent(slug).toLowerCase().trim();
    
    const slugifyName = (name) => {
      if (!name) return '';
      return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    // Check dynamic categories list first
    const found = categories.find(cat => 
      slugifyName(cat.name) === decoded || 
      cat.name.toLowerCase() === decoded
    );
    
    if (found) return found.name;

    // Fallback map for common categories to resolve immediately
    const knownMappings = {
      'men-s-health': "Men's Health",
      'women-s-health': "Women's Health",
      'beauty-skin-care': "Beauty & Skin Care",
      'beauty-and-skin-care': "Beauty & Skin Care",
      'hiv-herpes': "HIV & Herpes",
      'hiv-and-herpes': "HIV & Herpes",
      'anti-cancer': "Anti Cancer",
      'pain-relief': "Pain Relief",
      'eye-care': "Eye Care",
      'herbal-products': "Herbal Products",
      'respiratory': "Respiratory",
      'anti-worm': "Anti Worm",
      'anthelmintic-anti-worm': "Anthelmintic & Anti-worm"
    };

    if (knownMappings[decoded]) {
      return knownMappings[decoded];
    }

    // Capitalize words as standard fallback
    return decoded
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const currentCategory = categoryName ? slugToCategory(categoryName) : (searchParams.get('category') || '');

  useSEO({
    title: currentCategory 
      ? `Buy ${currentCategory} Online - Affordable Generic Medicines | The Cheap Pharma` 
      : currentSearch 
        ? `Search Results for "${currentSearch}" | The Cheap Pharma` 
        : "Our Generic Medicines & Healthcare Products | The Cheap Pharma",
    description: currentCategory 
      ? `Browse our wide selection of high-quality, affordable ${currentCategory} generic medications. Safe, reliable, and discreet home delivery with deals on every purchase.` 
      : currentSearch 
        ? `Find affordable generic medicines and healthcare items for "${currentSearch}". Safe, secure online ordering and fast shipping.` 
        : "Browse our wide selection of high-quality, affordable prescription & OTC medicines including antibiotics, erectile dysfunction pills, skincare products, and more."
  });


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
    async function fetchCategoriesList() {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategoriesList();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const skip = (currentPage - 1) * limit;
      
      const params = {
        skip,
        limit,
        ...(currentSearch && { search: currentSearch }),
        ...(currentCategory && { category: currentCategory }),
        ...(currentMinPrice && { min_price: currentMinPrice }),
        ...(currentMaxPrice && { max_price: currentMaxPrice }),
        ...(currentSort && { sort_by: currentSort })
      };

      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
      const response = await axios.get(`${baseUrl}/products/`, { params });
      setProducts(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setLocalSearch(currentSearch);
    setLocalMinPrice(currentMinPrice);
    setLocalMaxPrice(currentMaxPrice);
    fetchProducts();
  }, [searchParams, categoryName, searchQuery, currentCategory]); // Re-fetch when URL or resolved category changes

  // Helper to update URL params
  const updateParam = (key, value) => {
    if (key === 'category') {
      if (value) {
        const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/category/${slug}`);
      } else {
        navigate('/products');
      }
      return;
    }
    
    if (key === 'search') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      newParams.set('page', '1');
      const queryString = newParams.toString();
      const querySuffix = queryString ? `?${queryString}` : '';
      if (value) {
        navigate(`/search/${encodeURIComponent(value)}${querySuffix}`);
      } else if (categoryName) {
        navigate(`/category/${categoryName}${querySuffix}`);
      } else {
        navigate(`/products${querySuffix}`);
      }
      return;
    }

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
    newParams.delete('search');
    
    if (localMinPrice) newParams.set('min_price', localMinPrice);
    else newParams.delete('min_price');
    
    if (localMaxPrice) newParams.set('max_price', localMaxPrice);
    else newParams.delete('max_price');

    newParams.set('page', '1');
    const queryString = newParams.toString();
    const querySuffix = queryString ? `?${queryString}` : '';

    if (localSearch) {
      navigate(`/search/${encodeURIComponent(localSearch)}${querySuffix}`);
    } else if (categoryName) {
      navigate(`/category/${categoryName}${querySuffix}`);
    } else {
      navigate(`/products${querySuffix}`);
    }
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    navigate('/products');
  };

  const totalPages = Math.ceil(total / limit);

  // Memoized — only re-runs when categories list or the sidebar search term changes
  const filteredCategoryOptions = useMemo(
    () => categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase())),
    [categories, categorySearch]
  );

  // Memoized — only recalculates when the filtered list or showAll toggle changes
  const displayedCategories = useMemo(
    () => showAllCategories ? filteredCategoryOptions : filteredCategoryOptions.slice(0, 8),
    [showAllCategories, filteredCategoryOptions]
  );

  const renderFilterContent = () => (
    <>
      {/* Search */}
      <div className="mb-4">
        <h6 className="fw-bold mb-2 text-dark">Search</h6>
        <InputGroup>
          <Form.Control
            placeholder="Keyword..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            id="filter-search-input"
          />
          <Button variant="outline-primary" onClick={handleApplyFilters} id="filter-search-btn">Go</Button>
        </InputGroup>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <h6 className="fw-bold mb-2 text-dark">Categories</h6>
        
        {categories.length > 8 && (
          <Form.Control
            type="text"
            placeholder="Search categories..."
            size="sm"
            className="mb-2 bg-light border-0 py-1"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            style={{ fontSize: '0.825rem' }}
          />
        )}
        
        <div className="d-flex flex-column gap-2" style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '5px' }}>
          <Form.Check 
            type="radio" 
            label="All Categories" 
            name="categoryGroup"
            checked={currentCategory === ''}
            onChange={() => { updateParam('category', ''); setShowMobileFilters(false); }}
            id="cat-all"
          />
          {displayedCategories.map(cat => (
            <Form.Check 
              key={cat.id || cat.name}
              type="radio" 
              label={cat.name} 
              name="categoryGroup"
              checked={currentCategory === cat.name}
              onChange={() => { updateParam('category', cat.name); setShowMobileFilters(false); }}
              id={`cat-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
            />
          ))}
        </div>
        
        {filteredCategoryOptions.length > 8 && (
          <Button 
            variant="link" 
            size="sm" 
            className="text-decoration-none p-0 mt-2 fw-bold text-primary"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            {showAllCategories ? 'Show Less' : `Show More (${filteredCategoryOptions.length - 8} more)`}
          </Button>
        )}
      </div>



      {/* Price */}
      <div className="mb-4">
        <h6 className="fw-bold mb-2 text-dark">Price Range ($)</h6>
        <Row className="g-2 align-items-center">
          <Col xs={5}>
            <Form.Control 
              type="number" 
              placeholder="Min" 
              value={localMinPrice} 
              onChange={(e) => setLocalMinPrice(e.target.value)}
              id="filter-price-min"
              aria-label="Minimum price"
            />
          </Col>
          <Col xs={2} className="text-center text-muted">-</Col>
          <Col xs={5}>
            <Form.Control 
              type="number" 
              placeholder="Max" 
              value={localMaxPrice} 
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              id="filter-price-max"
              aria-label="Maximum price"
            />
          </Col>
        </Row>
        <Button variant="outline-primary" className="w-100 mt-3 btn-sm fw-bold rounded-pill" onClick={() => { handleApplyFilters(); setShowMobileFilters(false); }} id="filter-price-apply-btn">Apply Price</Button>
      </div>
    </>
  );

  // Memoized — these are derived from URL params; rebuilding the array with closures
  // on every render (pagination, loading state, sort change) is wasteful
  const activeFilters = useMemo(() => {
    const filters = [];
    if (currentSearch) {
      filters.push({
        key: 'search',
        label: `Search: "${currentSearch}"`,
        onClear: () => {
          updateParam('search', '');
          setLocalSearch('');
        }
      });
    }
    if (currentCategory) {
      filters.push({
        key: 'category',
        label: `Category: ${currentCategory}`,
        onClear: () => updateParam('category', '')
      });
    }
    if (currentMinPrice || currentMaxPrice) {
      let label = 'Price: ';
      if (currentMinPrice && currentMaxPrice) label += `$${currentMinPrice} - $${currentMaxPrice}`;
      else if (currentMinPrice) label += `\u2265 $${currentMinPrice}`;
      else label += `\u2264 $${currentMaxPrice}`;
      filters.push({
        key: 'price',
        label,
        onClear: () => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('min_price');
          newParams.delete('max_price');
          newParams.set('page', '1');
          setSearchParams(newParams);
          setLocalMinPrice('');
          setLocalMaxPrice('');
        }
      });
    }
    return filters;
  }, [currentSearch, currentCategory, currentMinPrice, currentMaxPrice, searchParams]);

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
          {/* SIDEBAR FILTERS (DESKTOP) */}
          <Col lg={3} className="mb-4 d-none d-lg-block">
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Header className="bg-white border-bottom pt-3 pb-2 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Filters</h5>
                <Button variant="link" size="sm" className="text-decoration-none p-0 fw-bold" onClick={handleClearFilters} id="filter-clear-all-btn">Clear All</Button>
              </Card.Header>
              <Card.Body>
                {renderFilterContent()}
              </Card.Body>
            </Card>
          </Col>

          {/* MAIN PRODUCT GRID */}
          <Col lg={9}>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center mb-4 p-3 bg-white shadow-sm rounded-3 gap-3">
              <span className="text-muted fw-500 text-center text-sm-start">
                Showing <strong>{products.length}</strong> of <strong>{total}</strong> results
              </span>
              
              <div className="d-flex justify-content-between align-items-center gap-2">
                {/* Mobile Filters Toggle Button */}
                <Button 
                  variant="outline-primary" 
                  onClick={() => setShowMobileFilters(true)}
                  className="fw-bold d-lg-none d-flex align-items-center gap-2 flex-grow-1 justify-content-center"
                  style={{ minWidth: '120px' }}
                  id="mobile-filter-drawer-btn"
                >
                  <i className="bi bi-funnel-fill"></i> Filters
                </Button>
                
                <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-end">
                  <span className="text-muted fw-500 d-none d-md-inline text-nowrap">Sort by:</span>
                  <Form.Select 
                    value={currentSort} 
                    onChange={(e) => updateParam('sort_by', e.target.value)}
                    style={{ width: 'auto' }}
                    className="fw-500"
                    id="product-sort-select"
                    aria-label="Sort products by"
                  >
                    <option value="">Best Match</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </Form.Select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="d-flex flex-wrap align-items-center gap-2 mb-4 animate-fade-in">
                <span className="text-muted small fw-bold">Active Filters:</span>
                {activeFilters.map(filter => (
                  <Badge 
                    key={filter.key} 
                    bg="light" 
                    text="dark" 
                    className="border d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-500 shadow-xs"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <span>{filter.label}</span>
                    <button 
                      type="button" 
                      className="btn-close ms-1" 
                      style={{ fontSize: '0.55rem', padding: '0.2rem' }} 
                      onClick={filter.onClear} 
                      aria-label={`Clear ${filter.key} filter`}
                      id={`clear-filter-${filter.key}`}
                    ></button>
                  </Badge>
                ))}
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-decoration-none fw-bold p-0 ms-2 text-danger" 
                  onClick={handleClearFilters}
                  id="clear-all-filters-btn"
                >
                  Clear All
                </Button>
              </div>
            )}

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

      {/* Mobile Filters Drawer */}
      <Offcanvas show={showMobileFilters} onHide={() => setShowMobileFilters(false)} placement="start" className="d-lg-none" id="mobile-filter-offcanvas">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold"><i className="bi bi-funnel-fill text-primary me-2"></i>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">Tweak your criteria below</span>
            <Button variant="link" size="sm" className="text-decoration-none p-0 fw-bold" onClick={handleClearFilters} id="mobile-filter-clear-btn">Clear All</Button>
          </div>
          {renderFilterContent()}
          <Button variant="primary" className="w-100 mt-4 py-2 fw-bold rounded-pill" onClick={() => setShowMobileFilters(false)} id="mobile-filter-submit-btn">
            View {total} Results
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />
    </>
  );
}

export default Products;
