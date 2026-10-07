import { useState, useEffect } from 'react';
import api from '../../services/api';
import ManagementLayout from '../../components/management/ManagementLayout';

export default function AdminSalesReports() {
    const [report, setReport] = useState({ total_sales: 0, total_orders: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get('/admin/sales-report');
                setReport(res.data);
            } catch (err) {
                setError('Failed to fetch global sales report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    const avgOrder = report.total_orders > 0 ? (report.total_sales / report.total_orders).toFixed(2) : 0;

    return (
        <ManagementLayout
            title="Global Sales Report"
            description="Overview of cross-tenant sales metrics and revenue performance."
        >
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Loading reports...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div className="content-inner" style={{ background: '#f8fafc', borderLeft: '4px solid #3b82f6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Global Revenue</span>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>${parseFloat(report.total_sales).toFixed(2)}</span>
                    </div>

                    <div className="content-inner" style={{ background: '#f8fafc', borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</span>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{report.total_orders}</span>
                    </div>

                    <div className="content-inner" style={{ background: '#f8fafc', borderLeft: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Average Order Value</span>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>${avgOrder}</span>
                    </div>
                </div>
            )}
        </ManagementLayout>
    );
}
