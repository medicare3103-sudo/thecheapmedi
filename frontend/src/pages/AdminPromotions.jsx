import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Table, Button, Badge, Form, Spinner, Tabs, Tab } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getProducts, updateProduct } from '../api';

function AdminPromotions() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [activeSection, setActiveSection] = useState('featured'); // 'featured', 'trending', 'bestselling'

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.items || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Memoize per-section filtered lists — only recalculates when products array changes
  const featuredProducts = useMemo(() => products.filter(p => p.is_featured), [products]);
  const trendingProducts = useMemo(() => products.filter(p => p.is_trending), [products]);
  const bestsellingProducts = useMemo(() => products.filter(p => p.is_bestselling), [products]);

  // Determine which list/prop is active based on tab selection
  const { list: activeList, prop: activeProp, title: sectionTitle } = useMemo(() => {
    if (activeSection === 'featured') {
      return { list: featuredProducts, prop: 'is_featured', title: 'Featured Products' };
    } else if (activeSection === 'trending') {
      return { list: trendingProducts, prop: 'is_trending', title: 'Trending Products' };
    } else {
      return { list: bestsellingProducts, prop: 'is_bestselling', title: 'Best Selling Products' };
    }
  }, [activeSection, featuredProducts, trendingProducts, bestsellingProducts]);

  // Products NOT in the active section — memoized so the dropdown doesn't thrash
  const availableProducts = useMemo(
    () => products.filter(p => !p[activeProp]),
    [products, activeProp]
  );

  // useCallback: handleAddProduct/handleRemoveProduct are onSubmit/onClick on form and table rows.
  // activeSection changes on every tab click — without useCallback that recreates both handlers
  // and gives every table row button a new reference.
  const handleAddProduct = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    const prodToUpdate = products.find(p => p.id === parseInt(selectedProductId));
    if (!prodToUpdate) return;
    try {
      const payload = { ...prodToUpdate, [activeProp]: true };
      delete payload.id;
      await updateProduct(prodToUpdate.id, payload);
      setSelectedProductId('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product to promotion:', error);
      alert('Failed to add product to section.');
    }
  }, [selectedProductId, products, activeProp]);

  const handleRemoveProduct = useCallback(async (product) => {
    if (window.confirm(`Remove "${product.name}" from ${sectionTitle}?`)) {
      try {
        const payload = { ...product, [activeProp]: false };
        delete payload.id;
        await updateProduct(product.id, payload);
        fetchProducts();
      } catch (error) {
        console.error('Error removing product from promotion:', error);
        alert('Failed to remove product from section.');
      }
    }
  }, [activeProp, sectionTitle]);

  return (
    <AdminLayout title="Manage Promotions">
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          <Tabs
            activeKey={activeSection}
            onSelect={(k) => {
              setActiveSection(k);
              setSelectedProductId('');
            }}
            className="mb-4 border-bottom custom-seller-tabs"
            variant="underline"
          >
            <Tab eventKey="featured" title={<span className="fw-bold px-2 py-1"><i className="bi bi-star me-2"></i>Featured Section</span>} />
            <Tab eventKey="trending" title={<span className="fw-bold px-2 py-1"><i className="bi bi-graph-up-arrow me-2"></i>Trending Section</span>} />
            <Tab eventKey="bestselling" title={<span className="fw-bold px-2 py-1"><i className="bi bi-award me-2"></i>Best Selling Section</span>} />
          </Tabs>

          {/* Add Product Form for active tab */}
          <Form onSubmit={handleAddProduct} className="bg-light p-3 rounded-4 mb-4 border d-flex gap-3 align-items-end flex-wrap">
            <Form.Group className="flex-grow-1" style={{minWidth: '250px'}}>
              <Form.Label className="fw-bold text-muted small text-uppercase">Select Product to Add</Form.Label>
              <Form.Select 
                value={selectedProductId} 
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="bg-white border-0 py-2 shadow-sm"
              >
                <option value="">Choose a product from catalog...</option>
                {availableProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary" className="fw-bold py-2 px-4 shadow-sm" disabled={!selectedProductId}>
              <i className="bi bi-plus-lg me-2"></i>Add to {sectionTitle}
            </Button>
          </Form>

          {/* Products list in active tab */}
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Product</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Category</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Price</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : activeList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No products are currently in {sectionTitle}.
                    </td>
                  </tr>
                ) : (
                  activeList.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded d-flex justify-content-center align-items-center me-3" style={{width: '40px', height: '40px', overflow: 'hidden'}}>
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            ) : (
                              <i className="bi bi-image text-muted"></i>
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge bg="secondary" className="fw-normal">{product.category || 'Uncategorized'}</Badge>
                      </td>
                      <td className="px-4 py-3 fw-bold">${parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-end">
                        <Button variant="light" size="sm" className="text-danger shadow-sm fw-bold px-3" onClick={() => handleRemoveProduct(product)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

        </Card.Body>
      </Card>
    </AdminLayout>
  );
}

export default AdminPromotions;
