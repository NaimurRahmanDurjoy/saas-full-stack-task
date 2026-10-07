import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ManagementLayout.css';

export default function ManagementLayout({ children, title, description }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isAdmin = user?.type === 'admin';

    const adminLinks = [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/packages', label: 'Packages' },
        { path: '/admin/stores', label: 'Stores' },
        { path: '/admin/payment-channels', label: 'Payment Channels' },
        { path: '/admin/orders', label: 'Orders' },
        { path: '/admin/sales-reports', label: 'Sales Reports' }
    ];

    const ownerLinks = [
        { path: '/stores', label: 'My Stores' },
        // These need explicit store selection first, typically handled inside Stores page.
        // We'll keep the sidebar general for owner.
    ];

    const links = isAdmin ? adminLinks : ownerLinks;

    return (
        <div className="management-layout">
            <aside className={`management-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>SaaS Management</h2>
                    <button className="close-menu" onClick={() => setIsMobileMenuOpen(false)}>×</button>
                </div>

                <nav className="sidebar-nav">
                    {links.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className="management-main">
                <header className="management-header">
                    <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
                        ☰
                    </button>

                    <div className="header-user">
                        <span>{user?.name} ({user?.role})</span>
                        <button onClick={logout} className="btn btn-secondary">Logout</button>
                    </div>
                </header>

                <main className="management-content">
                    {(title || description) && (
                        <div className="page-header">
                            {title && <h1>{title}</h1>}
                            {description && <p>{description}</p>}
                        </div>
                    )}

                    <div className="content-inner">
                        {children}
                    </div>
                </main>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}
        </div>
    );
}
