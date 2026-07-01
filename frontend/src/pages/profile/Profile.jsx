import { useEffect, useState, useRef } from "react";
import {
    HiEnvelope,
    HiPhone,
    HiUserCircle,
    HiPencilSquare,
    HiTrash,
    HiTag,
    HiMapPin,
    HiCalendarDays,
    HiCheckCircle,
    HiClock,
    HiXCircle,
    HiEye,
    HiCamera,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import { getCategoriesApi } from "../../api/categoryApi";
import {
    deletePostApi,
    getMyPostsApi,
    updatePostApi,
    updatePostStatusApi,
} from "../../api/postApi";
import { changePasswordApi, updateProfileApi, updateAvatarApi, deleteAvatarApi } from "../../api/userApi";
import { uploadAvatarApi } from "../../api/uploadApi";
import { Notify } from "../../utils/notify";
import "./Profile.css";

function Profile() {
    const { user, setUser } = useAuth();


    const fileInputRef = useRef(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            Notify.error("Vui lòng chọn file hình ảnh");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { 
            Notify.error("Kích thước ảnh tối đa là 5MB");
            return;
        }

        try {
            setUploadingAvatar(true);
            const uploadRes = await uploadAvatarApi(file);
            const newAvatarUrl = uploadRes.data.image_url;

            const res = await updateAvatarApi({ avatar_url: newAvatarUrl });
            
            setUser(res.data);
            Notify.success("Cập nhật ảnh đại diện thành công");
        } catch (err) {
            Notify.error("Có lỗi xảy ra khi cập nhật ảnh đại diện");
        } finally {
            setUploadingAvatar(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
   

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const loadMyPosts = async () => {
        setLoading(true);

        try {
            const res = await getMyPostsApi();
            setPosts(res.data);
        } catch {
            Notify.error("Không tải được bài đăng của bạn");
        } finally {
            setLoading(false);
        }
    };

    const [showProfileModal, setShowProfileModal] = useState(false);

    const [profileForm, setProfileForm] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const loadCategories = async () => {
        try {
            const res = await getCategoriesApi();
            setCategories(res.data);
        } catch {
            Notify.error("Không tải được danh mục");
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            Notify.error("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            await changePasswordApi({
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password,
            });

            Notify.success("Đổi mật khẩu thành công");
            setShowPasswordModal(false);

            setPasswordForm({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Đổi mật khẩu thất bại");
        }
    };

    useEffect(() => {
        loadMyPosts();
        loadCategories();
    }, []);

    useEffect(() => {
        setProfileForm({
            full_name: user?.full_name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        setProfileForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!profileForm.full_name.trim()) {
            Notify.error("Vui lòng nhập họ tên");
            return;
        }

        try {
            const res = await updateProfileApi(profileForm);

            setUser(res.data);
            Notify.success("Cập nhật thông tin cá nhân thành công");
            setShowProfileModal(false);
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Cập nhật thông tin thất bại");
        }
    };

    const openEditModal = (post) => {
        setEditingPost(post);

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

    const handleUpdateStatus = async (post) => {
        const newStatus =
            post.type === "LOST"
                ? post.status === "SEARCHING"
                    ? "FOUND"
                    : "SEARCHING"
                : post.status === "WAITING_OWNER"
                ? "RETURNED"
                : "WAITING_OWNER";

        try {
            await updatePostStatusApi(post.id, newStatus);

            Notify.success("Cập nhật trạng thái thành công");

            setPosts((prev) =>
                prev.map((item) =>
                    item.id === post.id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Cập nhật trạng thái thất bại");
        }
    };
    const closeEditModal = () => {
        setEditingPost(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();

        if (!editForm.title.trim()) {
            Notify.error("Vui lòng nhập tiêu đề");
            return;
        }

        try {
            await updatePostApi(editingPost.id, {
                ...editForm,
                category_id: Number(editForm.category_id),
                image_url: editForm.image_url || null,
            });

            Notify.success("Cập nhật bài đăng thành công");
            closeEditModal();
            loadMyPosts();
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Cập nhật thất bại");
        }
    };

    const handleDeletePost = async (postId) => {
        const ok = window.confirm("Bạn có chắc muốn xóa bài đăng này không?");

        if (!ok) return;

        try {
            await deletePostApi(postId);
            Notify.success("Đã xóa bài đăng");

            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Xóa bài đăng thất bại");
        }
    };

    const getApprovalLabel = (approvalStatus) => {
        if (approvalStatus === "APPROVED") return "Đã duyệt";
        if (approvalStatus === "REJECTED") return "Bị từ chối";
        return "Chờ duyệt";
    };

    const getStatusLabel = (status) => {
        if (status === "SEARCHING") return "Đang tìm";
        if (status === "FOUND") return "Đã tìm thấy";
        if (status === "WAITING_OWNER") return "Chờ chủ nhận";
        return "Đã trả lại";
    };

    return (
        <div className="profile-page">
            <section className="profile-card">
                
                
                <div className="profile-avatar-wrapper">
    <div className="profile-avatar" onClick={() => !uploadingAvatar && fileInputRef.current?.click()}>
    {user?.avatar_url && user.avatar_url.trim() !== "" ? (
        <img src={user.avatar_url} alt="Avatar" className="avatar-image" />
    ) : (
        <span>{user?.full_name?.charAt(0) || "U"}</span>
    )}
</div>
    
    
    <div className="avatar-overlay" onClick={() => !uploadingAvatar && fileInputRef.current?.click()}>
        {uploadingAvatar ? "Đang tải..." : <HiCamera size={24}/>}
    </div>

    
    {user?.avatar_url && !uploadingAvatar && (
        <button 
            className="avatar-delete-btn" 
           onClick={async () => {
    if(window.confirm("Bạn muốn xóa ảnh đại diện?")) {
        try {
            const res = await deleteAvatarApi(); 
            setUser(res.data);
            Notify.success("Đã xóa ảnh đại diện");
        } catch (err) {
            console.error(err);
            Notify.error("Xóa thất bại");
        }
    }
}}
        >
            <HiTrash />
        </button>
    )}

    <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        style={{ display: "none" }} 
    />
</div>
                <div className="profile-info">
                    <h1>{user?.full_name}</h1>
                    <p>
                        <HiUserCircle />
                        {user?.role}
                    </p>
                    <p>
                        <HiEnvelope />
                        {user?.email}
                    </p>
                    <p>
                        <HiPhone />
                        {user?.phone}
                    </p>
                </div>

                <button
                    className="edit-profile-btn"
                    onClick={() => setShowProfileModal(true)}
                >
                    <HiPencilSquare />
                    Sửa thông tin
                </button>
                <button
                    className="change-password-btn"
                    onClick={() => setShowPasswordModal(true)}
                >
                    <HiEye />
                    Đổi mật khẩu
                </button>
            </section>

            <section className="my-posts-section">
                <div className="section-header">
                    <div>
                        <h2>Bài đăng của tôi</h2>
                        <p>Quản lý tất cả bài đăng đã gửi, đang duyệt hoặc bị từ chối.</p>
                    </div>

                    <span>{posts.length} bài đăng</span>
                </div>

                {loading ? (
                    <div className="profile-empty">Đang tải bài đăng...</div>
                ) : posts.length === 0 ? (
                    <div className="profile-empty">Bạn chưa có bài đăng nào.</div>
                ) : (
                    <div className="my-post-list">
                        {posts.map((post) => (
                            <article className="my-post-card" key={post.id}>
                                <div className="my-post-top">
                                    <div>
                                        <h3>{post.title}</h3>
                                        <p>
                                            {post.type === "LOST"
                                                ? "Tin mất đồ"
                                                : "Tin nhặt được"}
                                        </p>
                                    </div>

                                    <span
                                        className={`approval-badge ${
                                            post.approval_status === "APPROVED"
                                                ? "approved"
                                                : post.approval_status === "REJECTED"
                                                ? "rejected"
                                                : "pending"
                                        }`}
                                    >
                                        {post.approval_status === "APPROVED" ? (
                                            <HiCheckCircle />
                                        ) : post.approval_status === "REJECTED" ? (
                                            <HiXCircle />
                                        ) : (
                                            <HiClock />
                                        )}

                                        {getApprovalLabel(post.approval_status)}
                                    </span>
                                </div>

                                <p className="my-post-desc">{post.description}</p>
                                {post.image_url && (
                                    <div className="my-post-image">
                                        <img src={post.image_url} alt={post.title} />
                                    </div>
                                )}
                                <div className="my-post-meta">
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
                                        {getStatusLabel(post.status)}
                                    </span>
                                </div>

                                <div className="my-post-actions">

                                    <button
                                        className="status-post-btn"
                                        onClick={() => handleUpdateStatus(post)}
                                    >
                                        <HiCheckCircle />
                                        {post.type === "LOST"
                                            ? post.status === "SEARCHING"
                                                ? "Đã tìm thấy"
                                                : "Đang tìm"
                                            : post.status === "WAITING_OWNER"
                                            ? "Đã trả lại"
                                            : "Chờ chủ nhận"}
                                    </button>
                                    <button
                                        className="edit-post-btn"
                                        onClick={() => openEditModal(post)}
                                    >
                                        <HiPencilSquare />
                                        Sửa
                                    </button>

                                    <button
                                        className="delete-post-btn"
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        <HiTrash />
                                        Xóa
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {editingPost && (
                <div className="profile-modal-overlay">
                    <div className="profile-edit-modal">
                        <div className="profile-modal-header">
                            <h2>Sửa bài đăng</h2>
                            <button onClick={closeEditModal}>×</button>
                        </div>

                        <form onSubmit={handleUpdatePost} className="profile-edit-form">
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Tiêu đề</label>
                                    <input
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Danh mục</label>
                                    <select
                                        name="category_id"
                                        value={editForm.category_id}
                                        onChange={handleEditChange}
                                    >
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Địa điểm</label>
                                    <input
                                        name="location"
                                        value={editForm.location}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Ngày mất / nhặt</label>
                                    <input
                                        type="date"
                                        name="event_date"
                                        value={editForm.event_date}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email liên hệ</label>
                                    <input
                                        name="contact_email"
                                        value={editForm.contact_email}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        name="contact_phone"
                                        value={editForm.contact_phone}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="form-group full">
                                    <label>Link ảnh</label>
                                    <input
                                        name="image_url"
                                        value={editForm.image_url}
                                        onChange={handleEditChange}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="form-group full">
                                    <label>Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                    />
                                </div>
                            </div>

                            <div className="profile-modal-actions">
                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={closeEditModal}
                                >
                                    Hủy
                                </button>

                                <button type="submit" className="save-edit-btn">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showProfileModal && (
                <div className="profile-modal-overlay">
                    <div className="profile-edit-modal">
                        <div className="profile-modal-header">
                            <h2>Sửa thông tin cá nhân</h2>
                            <button onClick={() => setShowProfileModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Họ và tên</label>
                                    <input
                                        name="full_name"
                                        value={profileForm.full_name}
                                        onChange={handleProfileChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        name="phone"
                                        value={profileForm.phone}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                            </div>

                            <div className="profile-modal-actions">
                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={() => setShowProfileModal(false)}
                                >
                                    Hủy
                                </button>

                                <button type="submit" className="save-edit-btn">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPasswordModal && (
                <div className="profile-modal-overlay">
                    <div className="profile-edit-modal">
                        <div className="profile-modal-header">
                            <h2>Đổi mật khẩu</h2>
                            <button onClick={() => setShowPasswordModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleChangePassword} className="profile-edit-form">
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        name="old_password"
                                        value={passwordForm.old_password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <div className="form-group full">
                                    <label>Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        value={passwordForm.new_password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <div className="form-group full">
                                    <label>Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        value={passwordForm.confirm_password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                            </div>

                            <div className="profile-modal-actions">
                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Hủy
                                </button>

                                <button type="submit" className="save-edit-btn">
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;