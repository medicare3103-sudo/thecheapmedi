import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductSection({ title, products, isLoading }) {
  const { addToCart } = useCart();

  const handleAddToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.some(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlist-updated'));
      alert(`${product.name} added to your wishlist!`);
    } else {
      alert(`${product.name} is already in your wishlist!`);
    }
  };

  const getProductPriceDisplay = (product) => {
    if (product.pack_sizes && product.pack_sizes.length > 0) {
      const prices = product.pack_sizes.map(p => parseFloat(p.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return `$${minPrice.toFixed(2)}`;
      }
      return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
    }
    return `$${parseFloat(product.price).toFixed(2)}`;
  };

  const getProductOldPriceDisplay = (product) => {
    if (product.pack_sizes && product.pack_sizes.length > 0) {
      const prices = product.pack_sizes.map(p => parseFloat(p.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return `$${(minPrice * 1.15).toFixed(2)}`;
      }
      return `$${(minPrice * 1.15).toFixed(2)} - $${(maxPrice * 1.15).toFixed(2)}`;
    }
    return `$${(parseFloat(product.price) * 1.15).toFixed(2)}`;
  };

  if (isLoading) {
    return <div className="text-center py-5">Loading {title.toLowerCase()}...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-5 text-center my-4">
        <h3 className="section-title text-start mb-4">{title}</h3>
        <div className="py-5 bg-white rounded-4 shadow-sm border d-flex flex-column align-items-center justify-content-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="rounded-circle bg-primary bg-opacity-10 p-4 mb-3 text-primary d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-capsule fs-1"></i>
          </div>
          <h4 className="fw-bold text-dark mb-2">Medicine Coming Soon</h4>
          <p className="text-muted mb-0">We are currently updating our inventory for this category. Please check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <h3 className="section-title">{title}</h3>
      <Row className="g-4">
        {products.map((product) => (
          <Col xs={6} md={6} lg={4} xl={3} key={product.id} className="product-col mb-3">
            <Card className="product-card h-100">
              {/* Discount Badge Placeholder */}
              <div className="position-absolute top-0 end-0 mt-3 me-3" style={{ zIndex: 2 }}>
                <span className="badge bg-danger rounded-pill px-2 py-1">-15%</span>
              </div>
              
              <div className="product-img-wrap">
                <Link to={`/product/${product.slug || product.id}`}>
                  {product.image_url && product.image_url !== '__has_image__' ? (
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                  ) : (
                    <div className="text-muted opacity-50" style={{fontSize: '2rem'}}>💊</div>
                  )}
                </Link>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                  <span className="text-warning">★★★★☆</span>
                  <span className="text-muted small ms-2">(12)</span>
                </div>
                
                <Card.Title className="fs-5 fw-bold mb-1">
                  <Link to={`/product/${product.slug || product.id}`} className="text-decoration-none text-dark">
                    {product.name}
                  </Link>
                </Card.Title>
                
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="price-tag">{getProductPriceDisplay(product)}</div>
                  <del className="text-muted small">{getProductOldPriceDisplay(product)}</del>
                </div>
                
                {/* Floating details section on hover */}
                <div className="product-hover-details">
                  <Card.Text className="text-muted small mb-3 text-start">
                    {product.description 
                      ? product.description.replace(/<[^>]+>/g, '').substring(0, 80).trim() + '...' 
                      : ''}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-danger" 
                      className="px-2"
                      onClick={() => handleAddToWishlist(product)}
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="bi bi-heart"></i>
                    </Button>
                    <Button 
                      variant="primary" 
                      className="flex-grow-1 fw-bold text-white"
                      onClick={() => addToCart(product)}
                      style={{ borderRadius: '8px' }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductSection;
