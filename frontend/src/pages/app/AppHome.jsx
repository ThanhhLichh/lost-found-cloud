import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
    HiPlus,
    HiMapPin,
    HiCalendarDays,
    HiTag,
    HiMagnifyingGlass,
    HiEnvelope,
    HiPhone,
    HiMagnifyingGlassCircle,
    HiArchiveBox,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import "./AppHome.css";
import { Notify } from "../../utils/notify";
import { getCategoriesApi } from "../../api/categoryApi";
import { createPostApi, getPostsApi } from "../../api/postApi";
import CreatePostModal from "../../components/feed/CreatePostModal";
import PostSkeleton from "../../components/feed/PostSkeleton";

function AppHome() {
    const { user } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const [postForm, setPostForm] = useState({
        title: "",
        type: "LOST",
        category_id: "",
        description: "",
        location: "",
        event_date: "",
        image_url: null,
        contact_email: user?.email || "",
        contact_phone: user?.phone || "",
        status: "SEARCHING",
    });

    const loadPosts = async (pageToLoad = 1, isReset = false) => {
        if (loadingPosts) return;

        setLoadingPosts(true);

        try {
            const res = await getPostsApi({
                page: pageToLoad,
                limit: 10,
            });

            const newPosts = res.data;

            if (isReset) {
                setPosts(newPosts);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
            }

            setHasMore(newPosts.length === 10);
           
        } catch {
            Notify.error("Không tải được danh sách bài đăng");
        } finally {
            setLoadingPosts(false);
        }
    };

const loadCategories = async () => {
    try {
        const res = await getCategoriesApi();
        setCategories(res.data);
    } catch {
        Notify.error("Không tải được danh mục");
    }
};

useEffect(() => {
    if (searchParams.get("createPost") === "1") {
        setShowCreateModal(true);
        setSearchParams({});
    }
}, [searchParams, setSearchParams]);

useEffect(() => {
    loadPosts(1, true);
    loadCategories();
}, []);

useEffect(() => {
    setPostForm((prev) => ({
        ...prev,
        contact_email: user?.email || "",
        contact_phone: user?.phone || "",
    }));
}, [user]);

const lastPostRef = (node) => {
    if (loadingPosts) return;

    if (observerRef.current) {
        observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
                const nextPage = page + 1;

                setPage(nextPage);

                setTimeout(() => {
                    loadPosts(nextPage);
                }, 0);
            }
    });

    if (node) {
        observerRef.current.observe(node);
    }
};

const handlePostFormChange = (e) => {
    const { name, value } = e.target;

    setPostForm((prev) => {
        const nextForm = {
            ...prev,
            [name]: value,
        };

        if (name === "type") {
            nextForm.status = value === "LOST" ? "SEARCHING" : "WAITING_OWNER";
        }

        return nextForm;
    });
};

const validatePostForm = () => {
    if (!postForm.title.trim()) {
        Notify.error("Vui lòng nhập tiêu đề");
        return false;
    }

    if (!postForm.category_id) {
        Notify.error("Vui lòng chọn danh mục");
        return false;
    }

    if (!postForm.description.trim()) {
        Notify.error("Vui lòng nhập mô tả");
        return false;
    }

    if (!postForm.location.trim()) {
        Notify.error("Vui lòng nhập địa điểm");
        return false;
    }

    if (!postForm.event_date) {
        Notify.error("Vui lòng chọn ngày");
        return false;
    }

    if (!postForm.contact_email.trim()) {
        Notify.error("Vui lòng nhập email liên hệ");
        return false;
    }

    if (!postForm.contact_phone.trim()) {
        Notify.error("Vui lòng nhập số điện thoại liên hệ");
        return false;
    }

    return true;
};

    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!validatePostForm()) return;

        try {
            await createPostApi({
                ...postForm,
                category_id: Number(postForm.category_id),
                image_url: null,
            });

            Notify.info(
                    "Bài đăng đã được gửi và đang chờ Admin duyệt."
                );

            setShowCreateModal(false);

            setPostForm({
                title: "",
                type: "LOST",
                category_id: "",
                description: "",
                location: "",
                event_date: "",
                image_url: null,
                contact_email: user?.email || "",
                contact_phone: user?.phone || "",
                status: "SEARCHING",
            });
            setHasMore(true);
            setPage(1);

        } catch (err) {
            Notify.error(err.response?.data?.detail || "Đăng bài thất bại");
        }
    };

    return (
        <div className="feed-page">
            <div className="feed-composer">
                <div className="composer-avatar">
                    {user?.full_name?.charAt(0) || "U"}
                </div>

                <button
                    className="composer-input"
                    onClick={() => setShowCreateModal(true)}
                >
                    Có gì mới? Bạn muốn tìm đồ hay trả đồ?
                </button>

                <button
                    className="composer-add"
                    onClick={() => setShowCreateModal(true)}
                >
                    <HiPlus />
                </button>
            </div>

            <div className="quick-actions">
                <button onClick={() => setShowCreateModal(true)}>
                    <HiMagnifyingGlass />
                    Bạn muốn tìm đồ?
                </button>

                <button onClick={() => setShowCreateModal(true)}>
                    <HiTag />
                    Bạn muốn trả đồ?
                </button>
            </div>

            <div className="post-list">
                {loadingPosts && posts.length === 0 ? (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    ) : posts.length === 0 ? (
                        <p className="feed-message">Chưa có bài đăng nào.</p>
                    ) : (
                        posts.map((post, index) => (
                            <article
                                className="post-card"
                                key={post.id}
                                ref={index === posts.length - 1 ? lastPostRef : null}
                            >
                        <div className="post-header">
                            <div className="post-avatar">
                                {post.user?.full_name?.charAt(0) || "U"}
                            </div>

                            <div>
                                <h3>{post.user?.full_name || "Người dùng"}</h3>
                                <p className="post-subtitle">
                                    {post.type === "LOST" ? (
                                        <>
                                            <HiMagnifyingGlassCircle />
                                            Tin mất đồ
                                        </>
                                    ) : (
                                        <>
                                            <HiArchiveBox />
                                            Tin nhặt được
                                        </>
                                    )}

                                    <span>•</span>

                                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                                </p>
                            </div>

                            <span className={`post-type ${post.type === "LOST" ? "lost" : "found"}`}>
                                <>
                                    {post.type === "LOST" ? (
                                        <HiMagnifyingGlassCircle />
                                    ) : (
                                        <HiArchiveBox />
                                    )}

                                    {post.type === "LOST"
                                        ? "Mất đồ"
                                        : "Nhặt được"}
                                </>
                            </span>
                        </div>

                        <h2>{post.title}</h2>

                        <p className="post-description">{post.description}</p>

                        <div className="post-meta">
                            <span className="meta-category">
                                <HiTag />
                                {post.category?.name || "Khác"}
                            </span>

                            <span className="meta-location">
                                <HiMapPin />
                                {post.location}
                            </span>

                            <span
                                className={`meta-status ${
                                    post.status === "SEARCHING"
                                        ? "status-searching"
                                        : post.status === "FOUND"
                                        ? "status-found"
                                        : post.status === "WAITING_OWNER"
                                        ? "status-waiting"
                                        : "status-returned"
                                }`}
                            >
                                <span className="status-dot"></span>

                                <HiCalendarDays />

                                {post.status === "SEARCHING"
                                    ? "Đang tìm"
                                    : post.status === "FOUND"
                                    ? "Đã tìm thấy"
                                    : post.status === "WAITING_OWNER"
                                    ? "Chờ chủ nhận"
                                    : "Đã trả lại"}
                            </span>
                        </div>

                        <div className="post-contact">
                            <span className="meta-email">
                                <HiEnvelope />
                                {post.contact_email}
                            </span>

                            <span className="meta-phone">
                                <HiPhone />
                                {post.contact_phone}
                            </span>
                        </div>
                    </article>
                    ))
                
                
                )}
                {loadingPosts && posts.length > 0 && (
                        <PostSkeleton />
                    )}

                    {!hasMore && posts.length > 0 && (
                        <p className="feed-message">Bạn đã xem hết bài đăng.</p>
                    )}
            </div>

            {showCreateModal && (
                <CreatePostModal
                    categories={categories}
                    postForm={postForm}
                    onChange={handlePostFormChange}
                    onSubmit={handleCreatePost}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
}

export default AppHome;