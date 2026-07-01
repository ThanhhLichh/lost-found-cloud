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
    HiEllipsisVertical,
    HiPencilSquare,
    HiTrash,
    HiCheckCircle,
} from "react-icons/hi2";
import {
    createPostApi,
    deletePostApi,
    getPostsApi,
    updatePostApi,
    updatePostStatusApi,
} from "../../api/postApi";
import { uploadImageApi } from "../../api/uploadApi";
import { adminDeletePostApi } from "../../api/adminApi";
import { useFilter } from "../../context/FilterContext";
import { useAuth } from "../../context/AuthContext";
import "./AppHome.css";
import { Notify } from "../../utils/notify";
import { getCategoriesApi } from "../../api/categoryApi";
import CreatePostModal from "../../components/feed/CreatePostModal";
import PostSkeleton from "../../components/feed/PostSkeleton";
import { useLoading } from "../../context/LoadingContext";

function AppHome() {
    const { user } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const { selectedCategory } = useFilter();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openMenuPostId, setOpenMenuPostId] = useState(null);
    const { showLoading, hideLoading } = useLoading();

    const [editingPost, setEditingPost] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        category_id: "",
        description: "",
        location: "",
        event_date: "",
        image_url: "",
        contact_email: "",
        contact_phone: "",
    });

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
                category_id: selectedCategory,
            });

            const newPosts = res.data;

            if (isReset) {
                setPosts(newPosts);
            } else {
                setPosts((prev) => {
                    const ids = new Set(prev.map((item) => item.id));

                    return [
                        ...prev,
                        ...newPosts.filter((item) => !ids.has(item.id)),
                    ];
                });
            }

            setHasMore(newPosts.length === 10);
           
        } catch {
            Notify.error("Không tải được danh sách bài đăng");
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleSelectImage = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setUploadingImage(true);

            const res = await uploadImageApi(file);

            setPostForm((prev) => ({
                ...prev,
                image_url: res.data.image_url,
            }));

            Notify.success("Tải ảnh lên thành công");
        } catch {
            Notify.error("Tải ảnh lên thất bại");
        } finally {
            setUploadingImage(false);
        }
    };

    const isMyPost = (post) => {
        return post.user_id === user?.id;
    };

    const openEditPostModal = (post) => {
        setEditingPost(post);
        setOpenMenuPostId(null);

        setEditForm({
            title: post.title || "",
            category_id: post.category_id || "",
            description: post.description || "",
            location: post.location || "",
            event_date: post.event_date || "",
            image_url: post.image_url || "",
            contact_email: post.contact_email || "",
            contact_phone: post.contact_phone || "",
        });
    };

    const closeEditPostModal = () => {
        setEditingPost(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        showLoading();
        try {
            await updatePostApi(editingPost.id, {
                ...editForm,
                category_id: Number(editForm.category_id),
                image_url: editForm.image_url || null,
            });

            Notify.info("Bài đăng đã được cập nhật và đang chờ Admin duyệt lại.");

            setEditingPost(null);

            setPosts((prev) =>
                prev.filter((post) => post.id !== editingPost.id)
            );
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Cập nhật bài đăng thất bại");
        } finally {
            hideLoading();
        }
    };

    const handleDeletePost = async (postId) => {
        const ok = window.confirm("Bạn có chắc muốn xóa bài đăng này không?");
        if (!ok) return;
        showLoading();
        try {
            await deletePostApi(postId);

            Notify.success("Đã xóa bài đăng");

            setOpenMenuPostId(null);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Xóa bài đăng thất bại");
        }
          finally {
            hideLoading();
        }
    };

    const handleUpdateStatus = async (post) => {
        const newStatus =
            post.type === "LOST"
                ? post.status === "SEARCHING"
                    ? "FOUND"
                    : "SEARCHING"
                : post.status === "WAITING_OWNER"
                ? "RETURNED"
                : "WAITING_OWNER";
        
                showLoading();
        try {
            await updatePostStatusApi(post.id, newStatus);

            Notify.success("Cập nhật trạng thái thành công");

            setOpenMenuPostId(null);

            setPosts((prev) =>
                prev.map((item) =>
                    item.id === post.id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Cập nhật trạng thái thất bại");
        } finally {
            hideLoading();
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

const handleAdminDeletePost = async (postId) => {
    const ok = window.confirm(
        "Bạn có chắc muốn xóa bài đăng này không?"
    );

    if (!ok) return;
    showLoading();
    try {
        await adminDeletePostApi(postId);

        Notify.success("Đã xóa bài đăng");

        setOpenMenuPostId(null);

        setPosts((prev) =>
            prev.filter((post) => post.id !== postId)
        );

    } catch (err) {
        Notify.error(
            err.response?.data?.detail ||
            "Xóa bài đăng thất bại"
        );
    }
        finally {
        hideLoading();
    }
};

useEffect(() => {
    if (searchParams.get("createPost") === "1") {
        setShowCreateModal(true);
        setSearchParams({});
    }
}, [searchParams, setSearchParams]);

useEffect(() => {
    loadCategories();
}, []);

useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    loadPosts(1, true);
}, [selectedCategory]);

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

        showLoading();

        try {
            await createPostApi({
                ...postForm,
                category_id: Number(postForm.category_id),
                image_url: postForm.image_url,
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
        finally {
            hideLoading();
        }
    };

    return (
        <div className="feed-page">
            <div className="feed-composer">
                <div className="composer-avatar">
    {user?.avatar_url && user.avatar_url.trim() !== "" ? (
        <img src={user.avatar_url} alt="Avatar" />
    ) : (
        user?.full_name?.charAt(0) || "U"
    )}
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
    {post.user?.avatar_url && post.user.avatar_url.trim() !== "" ? (
        <img src={post.user.avatar_url} alt={post.user.full_name} />
    ) : (
        post.user?.full_name?.charAt(0) || "U"
    )}
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
                                    {post.type === "LOST" ? <HiMagnifyingGlassCircle /> : <HiArchiveBox />}
                                    {post.type === "LOST" ? "Mất đồ" : "Nhặt được"}
                                </span>

                                {(isMyPost(post) || user?.role === "ADMIN") && (
                                    <div className="post-owner-actions">
                                        <button
                                            className="post-menu-btn"
                                            onClick={() =>
                                                setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)
                                            }
                                        >
                                            <HiEllipsisVertical />
                                        </button>

                                        {openMenuPostId === post.id && (
                                            <div className="post-menu-dropdown">

                                                {isMyPost(post) && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(post)}>
                                                            <HiCheckCircle />
                                                            {post.type === "LOST"
                                                                ? post.status === "SEARCHING"
                                                                    ? "Đã tìm thấy"
                                                                    : "Đang tìm"
                                                                : post.status === "WAITING_OWNER"
                                                                ? "Đã trả lại"
                                                                : "Chờ chủ nhận"}
                                                        </button>

                                                        <button onClick={() => openEditPostModal(post)}>
                                                            <HiPencilSquare />
                                                            Sửa bài
                                                        </button>

                                                        <button
                                                            className="danger"
                                                            onClick={() => handleDeletePost(post.id)}
                                                        >
                                                            <HiTrash />
                                                            Xóa bài
                                                        </button>
                                                    </>
                                                )}

                                                {!isMyPost(post) && user?.role === "ADMIN" && (
                                                    <button
                                                        className="danger"
                                                        onClick={() => handleAdminDeletePost(post.id)}
                                                    >
                                                        <HiTrash />
                                                        Xóa bài đăng
                                                    </button>
                                                )}

                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>

                        <h2>{post.title}</h2>

                        <p className="post-description">
                            {post.description}
                        </p>

                        {post.image_url && (
                            <div className="post-image">
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                />
                            </div>
                        )}

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

            {editingPost && (
                <CreatePostModal
                    categories={categories}
                    postForm={editForm}
                    onChange={handleEditFormChange}
                    onSubmit={handleUpdatePost}
                    onClose={closeEditPostModal}
                />
            )}

            {showCreateModal && (
                <CreatePostModal
                    categories={categories}
                    postForm={postForm}
                    onChange={handlePostFormChange}
                    onSubmit={handleCreatePost}
                    onClose={() => setShowCreateModal(false)}
                    onSelectImage={handleSelectImage}
                    uploading={uploadingImage}
                />
            )}
        </div>
    );
}

export default AppHome;