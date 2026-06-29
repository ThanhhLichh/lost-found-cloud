import { Outlet, NavLink, useNavigate, useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";
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
    HiArchiveBox,
} from "react-icons/hi2";

import { getCategoriesApi } from "../api/categoryApi";
import { useFilter } from "../context/FilterContext";
import { getRankingApi } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/landing/logo.png";
import "./MainLayout.css";
import { useLoading } from "../context/LoadingContext";

function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const { selectedCategory, setSelectedCategory } = useFilter();
    const { showLoading, hideLoading } = useLoading();

    const location = useLocation();

    const isAdminPage = location.pathname.startsWith("/app/admin");

    const [ranking, setRanking] = useState([]);
    

    const loadRanking = async () => {
    try {
        const res = await getRankingApi();
        setRanking(res.data);
    } catch {
        setRanking([]);
    }
};

    const openCreatePostModal = () => {
        navigate("/app?createPost=1");
    };

    const handleNavigateWithLoading = (path) => {
        showLoading();

        navigate(path);

        setTimeout(() => {
            hideLoading();
        }, 450);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        loadRanking();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategoriesApi();
                setCategories(res.data);
            } catch {
                setCategories([]);
            }
        };

        loadCategories();
    }, []);



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
                    <NavLink
                        to="/app"
                        end
                        title="Trang chủ"
                        onClick={() => {
                            showLoading();
                            setTimeout(hideLoading, 450);
                        }}
                    >
                        <HiHome />
                    </NavLink>

                    <button
                        type="button"
                        className="navbar-icon-button"
                        title="Đăng bài"
                        onClick={openCreatePostModal}
                    >
                        <HiPlusCircle />
                    </button>

                    {user?.role !== "ADMIN" && (
                        <NavLink
                            to="/app/profile"
                            title="Trang cá nhân"
                            onClick={() => {
                                showLoading();
                                setTimeout(hideLoading, 450);
                            }}
                        >
                            <HiUser />
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

                    <button
                        className="navbar-logout"
                        onClick={() => {
                            showLoading();
                            handleLogout();
                            setTimeout(hideLoading, 450);
                        }}
                    >
                        <HiArrowRightOnRectangle />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </header>

            <div className="app-body">
                <aside className="left-sidebar">
                    <nav className="side-menu">
                        <NavLink to="/app"
                         end 
                         onClick={() => {
                            showLoading();
                            setTimeout(hideLoading, 450);
                        }}>
                            <HiHome />
                            <span>Trang chủ</span>
                        </NavLink>

                        <button
                            type="button"
                            className="side-menu-button"
                            onClick={openCreatePostModal}
                        >
                            <HiPlusCircle />
                            <span>Đăng bài mới</span>
                        </button>

                        {user?.role !== "ADMIN" && (
                            <NavLink to="/app/profile"
                            onClick={() => {
                            showLoading();
                            setTimeout(hideLoading, 450);
                        }}>
                                
                                <HiUser />
                                <span>Trang cá nhân</span>
                            </NavLink>
                        )}

                        {user?.role === "ADMIN" && (
                            <>
                                <NavLink to="/app/admin/dashboard">
                                    <HiChartBar />
                                    <span>Dashboard</span>
                                </NavLink>

                                <NavLink to="/app/admin/posts">
                                    <HiArchiveBox />
                                    <span>Quản lý bài đăng</span>
                                </NavLink>

                                <NavLink to="/app/admin/users">
                                    <HiUser />
                                    <span>Quản lý người dùng</span>
                                </NavLink>
                            </>
                        )}
                    </nav>

                    <div className="support-card">
                        <div className="support-icon">
                            <HiEnvelope />
                        </div>

                        <div>
                            <h4>Cần hỗ trợ?</h4>
                            <p>Liên hệ nhóm quản trị để được hỗ trợ nhanh.</p>

                            <button
                                onClick={() =>
                                    window.location.href =
                                        "mailto:buithanhlich931@gmail.com?subject=Hỗ trợ Lost & Found Cloud&body=Xin chào Admin,%0D%0A%0D%0ATôi cần hỗ trợ về:%0D%0A%0D%0AMô tả vấn đề:%0D%0A"
                                }
                            >
                                Gửi email
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="feed-content">
                    <Outlet />
                </main>
                
                {!isAdminPage && (
                <aside className="right-sidebar">
                    <section className="ranking-card">
                <div className="ranking-header">
                    <div className="ranking-title-icon">
                        <HiTrophy />
                    </div>
                    <div>
                        <h3>Bảng vinh danh</h3>
                        <p>Những người trả đồ tích cực nhất</p>
                    </div>
                </div>

                {ranking.length === 0 ? (
                    <p className="ranking-empty">Chưa có dữ liệu xếp hạng.</p>
                ) : (
                    ranking.map((item, index) => (
                        <div
                            className={`rank-item ${
                                index === 0
                                    ? "rank-gold"
                                    : index === 1
                                    ? "rank-silver"
                                    : index === 2
                                    ? "rank-bronze"
                                    : ""
                            }`}
                            key={item.user_id}
                        >
                            <span className="rank-number">{index + 1}</span>

                            <div className="rank-avatar">
                                {item.full_name?.charAt(0) || "U"}
                            </div>

                            <div className="rank-info">
                                <strong>{item.full_name}</strong>
                                <p>{item.returned_count} món đã trả</p>
                                {index === 0 && <small>Top Helper</small>}
                            </div>
                        </div>
                    ))
                )}
            </section>

                    <section className="filter-card">
                        <div className="sidebar-section-title">
                            <HiFunnel />
                            <h3>Bộ lọc bài đăng</h3>
                        </div>

                        <button
                                className={`filter-item ${selectedCategory === null ? "active" : ""}`}
                                onClick={() => {
                                    showLoading();
                                    setSelectedCategory(null)
                                    setTimeout(hideLoading, 450);}}
                            >
                                <HiTag />
                                Tất cả danh mục
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`filter-item ${
                                        selectedCategory === category.id ? "active" : ""
                                    }`}
                                    onClick={() => {
                                    showLoading();
                                    setSelectedCategory(category.id);
                                    setTimeout(hideLoading, 450);
                                }}
                                >
                                    <HiTag />
                                    {category.name}
                                </button>
                            ))}
                    </section>

                    
                </aside>
                )}
            </div>
        </div>
    );
}

export default MainLayout;