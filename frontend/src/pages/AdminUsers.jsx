import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUsers, updateUserStatus } from '../api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus ? "block" : "unblock";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await updateUserStatus(userId, !currentStatus);
        fetchUsers(); // Refresh list after update
      } catch (error) {
        console.error(`Error trying to ${action} user:`, error);
        alert(`Failed to ${action} user.`);
      }
    }
  };

  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="g-0">
        
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-dark text-white min-vh-100 p-0 d-flex flex-column">
          <div className="p-4 bg-primary text-white text-center fw-bold fs-4">
            Medicare Admin
          </div>
          <Nav className="flex-column p-3 gap-2 flex-grow-1">
            <Nav.Link as={Link} to="/admin" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/orders" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-box-seam me-2"></i> Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-tags me-2"></i> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/categories" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-grid me-2"></i> Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white bg-white bg-opacity-10 rounded px-3 py-2">
              <i className="bi bi-people me-2"></i> Customers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/coupons" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-ticket-perforated me-2"></i> Coupons
            </Nav.Link>
            <Nav.Link className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-bar-chart me-2"></i> Analytics
            </Nav.Link>
          </Nav>
          <div className="p-3 mt-auto">
            <Nav.Link as={Link} to="/" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-arrow-left-circle me-2"></i> Back to Store
            </Nav.Link>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="bg-light min-vh-100">
          
          {/* Topbar */}
          <div className="bg-white px-4 py-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 fw-bold">User Management</h4>
          </div>

          <div className="px-4 pb-5">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">ID</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">User Details</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Status</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-5 text-muted">
                            No users registered yet.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 py-3 text-muted">#{user.id}</td>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: '40px', height: '40px'}}>
                                  <i className="bi bi-person text-primary"></i>
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{user.email || user.phone_number || 'N/A'}</div>
                                  {user.username && <div className="small text-muted">@{user.username}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge bg={user.is_active ? 'success' : 'danger'} className="px-3 py-2 rounded-pill fw-normal">
                                {user.is_active ? 'Active' : 'Blocked'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-end">
                              {user.is_active ? (
                                <Button variant="outline-danger" size="sm" className="fw-500 rounded-pill px-3 shadow-sm" onClick={() => handleToggleStatus(user.id, user.is_active)}>
                                  <i className="bi bi-slash-circle me-1"></i> Block
                                </Button>
                              ) : (
                                <Button variant="outline-success" size="sm" className="fw-500 rounded-pill px-3 shadow-sm" onClick={() => handleToggleStatus(user.id, user.is_active)}>
                                  <i className="bi bi-check-circle me-1"></i> Unblock
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminUsers;
