import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
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
        alert(`Failed to ${action} user.`);
      }
    }
  };

  return (
    <AdminLayout title="User Management">
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
    </AdminLayout>
  );
}

export default AdminUsers;
