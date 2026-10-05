import { useState, useEffect } from 'react';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading users...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  if (users.length === 0) {
    return <div className="empty-state" style={{textAlign: 'center', padding: '2rem'}}>No users found.</div>;
  }

  return (
    <div className="user-list-container">
      <h2>User Directory</h2>
      <div className="user-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3 className="user-name">{user.name}</h3>
            <p className="user-detail"><strong>Username:</strong> {user.username}</p>
            <p className="user-detail"><strong>Email:</strong> {user.email}</p>
            <p className="user-detail"><strong>Phone:</strong> {user.phone}</p>
            <p className="user-detail"><strong>Website:</strong> {user.website}</p>
            <p className="user-detail"><strong>Company:</strong> {user.company.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
