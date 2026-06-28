import { useEffect, useState } from "react";
import {
    HiLockClosed,
    HiLockOpen,
    HiEnvelope,
    HiPhone,
    HiUserCircle,
    HiShieldCheck,
} from "react-icons/hi2";

import {
    getUsersApi,
    lockUserApi,
    unlockUserApi,
} from "../../api/adminApi";

import { Notify } from "../../utils/notify";
import "./AdminUsers.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        setLoading(true);

        try {
            const res = await getUsersApi();
            setUsers(res.data);
        } catch {
            Notify.error("Không tải được danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleLock = async (userId) => {
        try {
            await lockUserApi(userId);
            Notify.success("Đã khóa tài khoản");

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? { ...user, status: "LOCKED" }
                        : user
                )
            );
        } catch (err) {
            Notify.error(err.response?.data?.detail || "Khóa tài khoản thất bại");
        }
    };

    const handleUnlock = async (userId) => {
        try {
            await unlockUserApi(userId);
            Notify.success("Đã mở khóa tài khoản");

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? { ...user, status: "ACTIVE" }
                        : user
                )
            );
        } catch {
            Notify.error("Mở khóa tài khoản thất bại");
        }
    };

    return (
        <div className="admin-users-page">
            <div className="admin-users-header">
                <div>
                    <h1>Quản lý người dùng</h1>
                    <p>Xem danh sách, khóa hoặc mở khóa tài khoản người dùng.</p>
                </div>

                <span>{users.length} tài khoản</span>
            </div>

            {loading ? (
                <div className="admin-users-empty">Đang tải người dùng...</div>
            ) : users.length === 0 ? (
                <div className="admin-users-empty">Chưa có người dùng nào.</div>
            ) : (
                <div className="users-table-card">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Người dùng</th>
                                <th>Liên hệ</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {user.full_name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <strong>{user.full_name}</strong>
                                                <p>ID: {user.id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="contact-cell">
                                            <span>
                                                <HiEnvelope />
                                                {user.email}
                                            </span>
                                            <span>
                                                <HiPhone />
                                                {user.phone}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`role-badge ${user.role === "ADMIN" ? "admin" : "user"}`}>
                                            {user.role === "ADMIN" ? <HiShieldCheck /> : <HiUserCircle />}
                                            {user.role}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-badge ${user.status === "ACTIVE" ? "active" : "locked"}`}>
                                            {user.status === "ACTIVE" ? "Đang hoạt động" : "Đã khóa"}
                                        </span>
                                    </td>

                                    <td>
                                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                                    </td>

                                    <td>
                                        {user.role === "ADMIN" ? (
                                            <span className="admin-note">Admin</span>
                                        ) : user.status === "ACTIVE" ? (
                                            <button
                                                className="lock-btn"
                                                onClick={() => handleLock(user.id)}
                                            >
                                                <HiLockClosed />
                                                Khóa
                                            </button>
                                        ) : (
                                            <button
                                                className="unlock-btn"
                                                onClick={() => handleUnlock(user.id)}
                                            >
                                                <HiLockOpen />
                                                Mở khóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;