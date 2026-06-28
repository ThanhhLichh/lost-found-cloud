import { useEffect, useState } from "react";
import {
    HiUsers,
    HiArchiveBox,
    HiClock,
    HiCheckCircle,
    HiXCircle,
    HiMagnifyingGlassCircle,
} from "react-icons/hi2";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";

import { getAdminDashboardApi } from "../../api/adminApi";
import { Notify } from "../../utils/notify";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadDashboard = async () => {
        setLoading(true);

        try {
            const res = await getAdminDashboardApi();
            setStats(res.data);
        } catch {
            Notify.error("Không tải được Dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const postTypeData = [
        { name: "Mất đồ", value: stats?.lost_posts ?? 0 },
        { name: "Nhặt được", value: stats?.found_posts ?? 0 },
    ];

    const approvalData = [
        { name: "Chờ duyệt", value: stats?.pending_posts ?? 0 },
        { name: "Đã duyệt", value: stats?.approved_posts ?? 0 },
        { name: "Từ chối", value: stats?.rejected_posts ?? 0 },
    ];

    const APPROVAL_COLORS = ["#f59e0b", "#087a38", "#dc2626"];

    if (loading) {
        return <div className="dashboard-empty">Đang tải Dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Tổng quan hệ thống Lost & Found</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="dashboard-icon blue">
                        <HiUsers />
                    </div>
                    <div>
                        <span>Tổng người dùng</span>
                        <strong>{stats?.total_users ?? 0}</strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon green">
                        <HiArchiveBox />
                    </div>
                    <div>
                        <span>Tổng bài đăng</span>
                        <strong>{stats?.total_posts ?? 0}</strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon orange">
                        <HiClock />
                    </div>
                    <div>
                        <span>Chờ duyệt</span>
                        <strong>{stats?.pending_posts ?? 0}</strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon emerald">
                        <HiCheckCircle />
                    </div>
                    <div>
                        <span>Đã duyệt</span>
                        <strong>{stats?.approved_posts ?? 0}</strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon red">
                        <HiXCircle />
                    </div>
                    <div>
                        <span>Đã từ chối</span>
                        <strong>{stats?.rejected_posts ?? 0}</strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon yellow">
                        <HiMagnifyingGlassCircle />
                    </div>
                    <div>
                        <span>Tin mất đồ</span>
                        <strong>{stats?.lost_posts ?? 0}</strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon purple">
                        <HiArchiveBox />
                    </div>
                    <div>
                        <span>Tin nhặt được</span>
                        <strong>{stats?.found_posts ?? 0}</strong>
                    </div>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-card">
                    <h3>Tỷ lệ loại bài đăng</h3>

                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={postTypeData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {postTypeData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={index === 0 ? "#f59e0b" : "#087a38"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Trạng thái duyệt bài</h3>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={approvalData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                {approvalData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={APPROVAL_COLORS[index]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;