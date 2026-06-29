import { useEffect, useState } from "react";
import {
    HiCheckCircle,
    HiXCircle,
    HiMapPin,
    HiTag,
    HiCalendarDays,
    HiEnvelope,
    HiPhone,
    HiTrash,
} from "react-icons/hi2";

import {
    approvePostApi,
    getPendingPostsApi,
    rejectPostApi,
    adminDeletePostApi,
} from "../../api/adminApi";

import { Notify } from "../../utils/notify";
import "./AdminPosts.css";

function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadPendingPosts = async () => {
        setLoading(true);

        try {
            const res = await getPendingPostsApi();
            setPosts(res.data);
        } catch {
            Notify.error("Không tải được danh sách bài chờ duyệt");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingPosts();
    }, []);

    const handleApprove = async (postId) => {
        try {
            await approvePostApi(postId);
            Notify.success("Đã chấp thuận bài đăng");

            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch {
            Notify.error("Chấp thuận bài đăng thất bại");
        }
    };

    const handleReject = async (postId) => {
        try {
            await rejectPostApi(postId);
            Notify.success("Đã từ chối bài đăng");

            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch {
            Notify.error("Từ chối bài đăng thất bại");
        }
    };

    const handleDelete = async (postId) => {
        const ok = window.confirm("Bạn có chắc muốn xóa bài đăng này không?");
        if (!ok) return;

        try {
            await adminDeletePostApi(postId);
            Notify.success("Đã xóa bài đăng");

            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Xóa bài đăng thất bại");
        }
    };

    return (
        <div className="admin-posts-page">
            <div className="admin-page-header">
                <div>
                    <h1>Quản lý bài đăng</h1>
                    <p>Duyệt các bài đăng đang chờ xác nhận từ người dùng.</p>
                </div>

                <span>{posts.length} bài chờ duyệt</span>
            </div>

            {loading ? (
                <div className="admin-empty">Đang tải bài đăng...</div>
            ) : posts.length === 0 ? (
                <div className="admin-empty">Không có bài đăng chờ duyệt.</div>
            ) : (
                <div className="admin-post-list">
                    {posts.map((post) => (
                        <article className="admin-post-card" key={post.id}>
                            <div className="admin-post-top">
                                <div>
                                    <h2>{post.title}</h2>
                                    <p>
                                        {post.type === "LOST"
                                            ? "Tin mất đồ"
                                            : "Tin nhặt được"}
                                        {" • "}
                                        {post.user?.full_name || "Người dùng"}
                                    </p>
                                </div>

                                <span className="pending-badge">
                                    Chờ duyệt
                                </span>
                            </div>

                            <p className="admin-post-desc">
                                {post.description}
                            </p>

                            {post.image_url && (
                                <div className="admin-post-image">
                                    <img src={post.image_url} alt={post.title} />
                                </div>
                            )}

                            <div className="admin-post-meta">
                                <span>
                                    <HiTag />
                                    {post.category?.name || "Khác"}
                                </span>

                                <span>
                                    <HiMapPin />
                                    {post.location}
                                </span>

                                <span>
                                    <HiCalendarDays />
                                    {new Date(post.event_date).toLocaleDateString("vi-VN")}
                                </span>

                                <span>
                                    <HiEnvelope />
                                    {post.contact_email}
                                </span>

                                <span>
                                    <HiPhone />
                                    {post.contact_phone}
                                </span>
                            </div>

                            <div className="admin-post-actions">
                                <button
                                    className="admin-delete-btn"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    <HiTrash />
                                    Xóa bài
                                </button>
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApprove(post.id)}
                                >
                                    <HiCheckCircle />
                                    Chấp thuận
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={() => handleReject(post.id)}
                                >
                                    <HiXCircle />
                                    Từ chối
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminPosts;