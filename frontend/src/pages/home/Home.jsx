import { useEffect, useState } from "react";
import "./Home.css";
import { loginApi, registerApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
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
    const navigate = useNavigate();
    const { loadCurrentUser } = useAuth();

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateLoginForm = () => {
    if (!loginForm.email.trim()) {
        toast.error("Vui lòng nhập email");
        return false;
    }

    if (!isValidEmail(loginForm.email)) {
        toast.error("Email không hợp lệ");
        return false;
    }

    if (!loginForm.password.trim()) {
        toast.error("Vui lòng nhập mật khẩu");
        return false;
    }

    if (loginForm.password.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        return false;
    }

    return true;
};

    const validateRegisterForm = () => {
        if (!registerForm.full_name.trim()) {
            toast.error("Vui lòng nhập họ và tên");
            return false;
        }

        if (registerForm.full_name.trim().length < 2) {
            toast.error("Họ và tên phải có ít nhất 2 ký tự");
            return false;
        }

        if (!registerForm.email.trim()) {
            toast.error("Vui lòng nhập email");
            return false;
        }

        if (!isValidEmail(registerForm.email)) {
            toast.error("Email không hợp lệ");
            return false;
        }

        if (!registerForm.phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return false;
        }

        if (!/^[0-9]{10,11}$/.test(registerForm.phone)) {
            toast.error("Số điện thoại phải gồm 10-11 chữ số");
            return false;
        }

        if (!registerForm.password.trim()) {
            toast.error("Vui lòng nhập mật khẩu");
            return false;
        }

        if (registerForm.password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return false;
        }

        return true;
    };

    const handleLoginChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLoginForm()) return;
        setError("");
        setLoading(true);

        try {
            const res = await loginApi(loginForm);

            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);

            await loadCurrentUser();
            toast.success("Đăng nhập thành công ✔");
            setAuthModal(null);
            navigate("/app");

            // Sau này có trang chính thì đổi thành navigate("/app")
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Đăng nhập thất bại !"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateRegisterForm()) return;
        setError("");
        setLoading(true);

        try {
            await registerApi(registerForm);

            toast.success(
                "Đăng ký thành công. Hãy đăng nhập."
            );
            setAuthModal("login");
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Đăng ký thất bại"
            );
        } finally {
            setLoading(false);
        }
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
                        Lost & <strong>Found UTH</strong>
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
                    <form onSubmit={handleLoginSubmit}>
                        <h2>Đăng nhập</h2>

                        {error && <div className="form-error">{error}</div>}

                        <input
                            name="email"
                            placeholder="Email"
                            value={loginForm.email}
                            onChange={handleLoginChange}
                        />

                        <input
                            name="password"
                            placeholder="Mật khẩu"
                            type="password"
                            value={loginForm.password}
                            onChange={handleLoginChange}
                        />

                        <button className="btn-primary modal-btn" disabled={loading}>
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>

                        <p>
                            Chưa có tài khoản?{" "}
                            <button type="button" onClick={() => setAuthModal("register")}>
                                Đăng ký ngay
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                        <h2>Đăng ký tài khoản</h2>

                        {error && <div className="form-error">{error}</div>}

                        <input
                            name="full_name"
                            placeholder="Họ và tên"
                            value={registerForm.full_name}
                            onChange={handleRegisterChange}
                        />

                        <input
                            name="email"
                            placeholder="Email"
                            value={registerForm.email}
                            onChange={handleRegisterChange}
                        />

                        <input
                            name="phone"
                            placeholder="Số điện thoại"
                            value={registerForm.phone}
                            onChange={handleRegisterChange}
                        />

                        <input
                            name="password"
                            placeholder="Mật khẩu"
                            type="password"
                            value={registerForm.password}
                            onChange={handleRegisterChange}
                        />

                        <button className="btn-primary modal-btn" disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>

                        <p>
                            Đã có tài khoản?{" "}
                            <button type="button" onClick={() => setAuthModal("login")}>
                                Đăng nhập
                            </button>
                        </p>
                    </form>
                )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;