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
      alert(`${product.name} added to your wishlist!`);
    } else {
      alert(`${product.name} is already in your wishlist!`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-5">Loading {title.toLowerCase()}...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-5">
        <h3 className="section-title">{title}</h3>
        <p className="text-muted">No products available in this category.</p>
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
                <Link to={`/product/${product.id}`}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <div className="text-muted opacity-50">No Image</div>
                  )}
                </Link>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                  <span className="text-warning">★★★★☆</span>
                  <span className="text-muted small ms-2">(12)</span>
                </div>
                
                <Card.Title className="fs-5 fw-bold mb-1">
                  <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                    {product.name}
                  </Link>
                </Card.Title>
                
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="price-tag">${parseFloat(product.price).toFixed(2)}</div>
                  <del className="text-muted small">${(parseFloat(product.price) * 1.15).toFixed(2)}</del>
                </div>
                
                {/* Floating details section on hover */}
                <div className="product-hover-details">
                  <Card.Text className="text-muted small mb-3 text-start">
                    {product.description?.substring(0, 80)}...
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
