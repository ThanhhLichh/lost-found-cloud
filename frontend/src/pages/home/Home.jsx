import { useEffect, useState } from "react";
import "./Home.css";

import logo from "../../assets/landing/logo.png";
import heroBag from "../../assets/landing/hero-bag.jpg";
import heroCard from "../../assets/landing/hero-card.jpg";
import heroKeys from "../../assets/landing/hero-keys.jpg";
import heroWatch from "../../assets/landing/hero-watch.jpg";

import {
    HiUsers,
    HiArchiveBox,
    HiCheckBadge,
    HiShieldCheck 
} from "react-icons/hi2";

const heroItems = [
    {
        image: heroBag,
        title: "Balo màu xanh",
        location: "Thư viện tầng 2",
    },
    {
        image: heroCard,
        title: "Thẻ sinh viên",
        location: "Khu tự học",
    },
    {
        image: heroKeys,
        title: "Chìa khóa gấu nâu",
        location: "Sảnh A",
    },
    {
        image: heroWatch,
        title: "Đồng hồ bạc",
        location: "Căn tin trường",
    },
];

function Home() {
    const [authModal, setAuthModal] = useState(null);
    const [activeHero, setActiveHero] = useState(0);

    const getHeroItem = (offset) => {
        return heroItems[(activeHero + offset) % heroItems.length];
    };

    const handleNextHero = () => {
        setActiveHero((prev) => (prev + 1) % heroItems.length);
    };

    const handlePrevHero = () => {
        setActiveHero((prev) =>
            prev === 0 ? heroItems.length - 1 : prev - 1
        );
    };

    useEffect(() => {
    const timer = setInterval(() => {
        setActiveHero((prev) => (prev + 1) % heroItems.length);
    }, 3000);

    return () => clearInterval(timer);
}, []);

    return (
        <div className="landing-page">
            <header className="landing-navbar">
                <div className="landing-brand">
                    <img src={logo} alt="Lost & Found" />
                    <span>
                        Lost & <strong>Found</strong>
                    </span>
                </div>

                <nav className="landing-nav-links">
                    <a href="#">Trang chủ</a>
                    <a href="#">Danh mục</a>
                    <a href="#">Hướng dẫn</a>
                    <a href="#">Liên hệ</a>
                </nav>

                <div className="landing-actions">
                    <button
                        className="btn-outline"
                        onClick={() => setAuthModal("login")}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => setAuthModal("register")}
                    >
                        Đăng ký
                    </button>
                </div>
            </header>

            <main className="landing-hero">
                <section className="hero-content">
                    <h1>
                        Tìm lại những gì <br />
                        bạn đã đánh mất, <br />
                        <span>trao lại điều</span> bạn tìm thấy.
                    </h1>

                    <p>
                        Lost & Found giúp kết nối cộng đồng để tìm lại đồ thất lạc
                        hoặc trả lại những món đồ bạn nhặt được.
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="btn-primary"
                            onClick={() => setAuthModal("register")}
                        >
                            Bắt đầu ngay
                        </button>
                        <button className="btn-outline">
                            Tìm hiểu thêm
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-icon">
                                <HiUsers />
                            </span>
                            <div>
                                <strong>10K+</strong>
                                <p>Thành viên</p>
                            </div>
                        </div>

                        <div className="stat-item">
                            <span className="stat-icon">
                            <HiArchiveBox />
                        </span>
                            <div>
                                <strong>25K+</strong>
                                <p>Đồ đã tìm thấy</p>
                            </div>
                        </div>

                        <div className="stat-item">
                            <span className="stat-icon">
                            <HiCheckBadge />
                        </span>
                            <div>
                                <strong>98%</strong>
                                <p>Tỷ lệ hoàn trả</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="hero-gallery">
    <div className="dot-pattern"></div>

    <div className="gallery-stack">
        <div className="gallery-card card-main">
            <img src={getHeroItem(0).image} alt={getHeroItem(0).title} />
            <div className="item-badge">
                <span></span>
                <div>
                    <strong>{getHeroItem(0).title}</strong>
                    <p>{getHeroItem(0).location}</p>
                </div>
            </div>
        </div>

        <div className="gallery-card card-back card-back-1">
            <img src={getHeroItem(1).image} alt={getHeroItem(1).title} />
        </div>

        <div className="gallery-card card-back card-back-2">
            <img src={getHeroItem(2).image} alt={getHeroItem(2).title} />
        </div>

        <button className="gallery-next" onClick={handleNextHero}>
            ›
        </button>
    </div>

    <div className="gallery-dots">
        {heroItems.map((_, index) => (
            <button
                key={index}
                className={index === activeHero ? "active" : ""}
                onClick={() => setActiveHero(index)}
            />
        ))}
    </div>
</section>
            </main>

            <section className="trust-banner">
                <div className="trust-icon">
                        <HiShieldCheck />
                    </div>
                <div>
                    <h3>An toàn - Minh bạch - Kết nối cộng đồng</h3>
                    <p>
                        Lost & Found cam kết mang đến môi trường đáng tin cậy
                        để mọi người giúp đỡ và hỗ trợ lẫn nhau.
                    </p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2026 Lost & Found. Được tạo bởi <strong>Nhóm 5</strong>.</p>
            </footer>

            {authModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setAuthModal(null)}
                >
                    <div
                        className="auth-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setAuthModal(null)}
                        >
                            ×
                        </button>

                        {authModal === "login" ? (
                            <>
                                <h2>Đăng nhập</h2>
                                <input placeholder="Email" />
                                <input placeholder="Mật khẩu" type="password" />
                                <button className="btn-primary modal-btn">
                                    Đăng nhập
                                </button>
                                <p>
                                    Chưa có tài khoản?{" "}
                                    <button onClick={() => setAuthModal("register")}>
                                        Đăng ký ngay
                                    </button>
                                </p>
                            </>
                        ) : (
                            <>
                                <h2>Đăng ký tài khoản</h2>
                                <input placeholder="Họ và tên" />
                                <input placeholder="Email" />
                                <input placeholder="Số điện thoại" />
                                <input placeholder="Mật khẩu" type="password" />
                                <button className="btn-primary modal-btn">
                                    Đăng ký
                                </button>
                                <p>
                                    Đã có tài khoản?{" "}
                                    <button onClick={() => setAuthModal("login")}>
                                        Đăng nhập
                                    </button>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;