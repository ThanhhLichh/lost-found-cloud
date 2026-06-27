import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    HiHome,
    HiPlusCircle,
    HiUser,
    HiChartBar,
    HiArrowRightOnRectangle,
    HiEnvelope,
    HiFunnel,
    HiTrophy,
    HiTag,
    HiMapPin,
} from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/landing/logo.png";
import "./MainLayout.css";

function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="app-shell">
            <header className="app-navbar">
                <div className="navbar-brand">
                    <img src={logo} alt="Lost & Found" />
                    <span>
                        Lost & <strong>Found UTH</strong>
                    </span>
                </div>

                <nav className="navbar-center">
                    <NavLink to="/app" end title="Trang chủ">
                        <HiHome />
                    </NavLink>

                    <NavLink to="/app/create-post" title="Đăng bài">
                        <HiPlusCircle />
                    </NavLink>

                    <NavLink to="/app/profile" title="Trang cá nhân">
                        <HiUser />
                    </NavLink>

                    {user?.role === "ADMIN" && (
                        <NavLink to="/app/admin" title="Quản trị">
                            <HiChartBar />
                        </NavLink>
                    )}
                </nav>

                <div className="navbar-right">
                    <div className="navbar-user">
                        <div className="navbar-avatar">
                            {user?.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <strong>{user?.full_name}</strong>
                            <span>{user?.role}</span>
                        </div>
                    </div>

                    <button className="navbar-logout" onClick={handleLogout}>
                        <HiArrowRightOnRectangle />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </header>

            <div className="app-body">
                <aside className="left-sidebar">
                    <nav className="side-menu">
                        <NavLink to="/app" end>
                            <HiHome />
                            <span>Trang chủ</span>
                        </NavLink>

                        <NavLink to="/app/create-post">
                            <HiPlusCircle />
                            <span>Đăng bài mới</span>
                        </NavLink>

                        <NavLink to="/app/profile">
                            <HiUser />
                            <span>Trang cá nhân</span>
                        </NavLink>

                        {user?.role === "ADMIN" && (
                            <NavLink to="/app/admin">
                                <HiChartBar />
                                <span>Quản trị hệ thống</span>
                            </NavLink>
                        )}
                    </nav>

                    <div className="support-card">
                        <div className="support-icon">
                            <HiEnvelope />
                        </div>
                        <div>
                            <h4>Cần hỗ trợ?</h4>
                            <p>Liên hệ nhóm quản trị để được hỗ trợ nhanh.</p>
                            <button>Gửi email</button>
                        </div>
                    </div>
                </aside>

                <main className="feed-content">
                    <Outlet />
                </main>

                <aside className="right-sidebar">
                    <section className="ranking-card">
                <div className="ranking-header">
                    <div className="ranking-title-icon">
                        <HiTrophy />
                    </div>
                    <div>
                        <h3>Bảng xếp hạng</h3>
                        <p>Những người trả đồ tích cực nhất</p>
                    </div>
                </div>

                <div className="rank-item rank-gold">
                    <span className="rank-number">1</span>
                    <div className="rank-avatar">A</div>
                    <div className="rank-info">
                        <strong>Nguyễn Văn A</strong>
                        <p>12 món đã trả</p>
                        <small>Top Helper</small>
                    </div>
                </div>

                <div className="rank-item rank-silver">
                    <span className="rank-number">2</span>
                    <div className="rank-avatar">B</div>
                    <div className="rank-info">
                        <strong>Trần Thị B</strong>
                        <p>9 món đã trả</p>
                    </div>
                </div>

                <div className="rank-item rank-bronze">
                    <span className="rank-number">3</span>
                    <div className="rank-avatar">C</div>
                    <div className="rank-info">
                        <strong>Lê Minh C</strong>
                        <p>7 món đã trả</p>
                    </div>
                </div>
            </section>

                    <section className="filter-card">
                        <div className="sidebar-section-title">
                            <HiFunnel />
                            <h3>Bộ lọc</h3>
                        </div>

                        <button className="filter-item active">
                            <HiTag />
                            Tất cả danh mục
                        </button>

                        <button className="filter-item">
                            <HiTag />
                            Điện thoại
                        </button>

                        <button className="filter-item">
                            <HiTag />
                            Balo
                        </button>

                        <button className="filter-item">
                            <HiTag />
                            Chìa khóa
                        </button>

                        <button className="filter-item">
                            <HiMapPin />
                            Gần đây
                        </button>
                    </section>

                    
                </aside>
            </div>
        </div>
    );
}

export default MainLayout;