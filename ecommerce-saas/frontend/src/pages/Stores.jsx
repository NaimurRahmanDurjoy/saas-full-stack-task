import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Stores = () => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        api.get('/api/stores').then(res => setStores(res.data));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Your Stores Context</h2>
            <ul>
                {stores.map(store => (
                    <li key={store.id} style={{ marginBottom: '1rem' }}>
                        <strong>{store.name}</strong>
                        <div style={{ marginTop: '0.5rem' }}>
                            <Link to={`/stores/${store.id}/categories`} style={{ marginRight: '1rem' }}>Manage Categories</Link>
                            <Link to={`/stores/${store.id}/products`}>Manage Products</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Stores;
