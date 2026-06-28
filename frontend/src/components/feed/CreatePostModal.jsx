import {
    HiPhoto,
    HiXMark,
} from "react-icons/hi2";

function CreatePostModal({
    categories,
    postForm,
    onChange,
    onSubmit,
    onClose,
}) {
    return (
        <div className="create-modal-overlay">
            <div className="create-modal">
                <div className="create-modal-header">
                    <h2>Tạo bài đăng mới</h2>
                    <button onClick={onClose}>
                        <HiXMark />
                    </button>
                </div>

                <form className="create-post-form" onSubmit={onSubmit}>
                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Tiêu đề bài đăng</label>
                            <input
                                name="title"
                                placeholder="Ví dụ: Mất balo màu xanh ở thư viện"
                                value={postForm.title}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Loại tin</label>
                            <select
                                name="type"
                                value={postForm.type}
                                onChange={onChange}
                            >
                                <option value="LOST">Mất đồ</option>
                                <option value="FOUND">Nhặt được đồ</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Danh mục</label>
                            <select
                                name="category_id"
                                value={postForm.category_id}
                                onChange={onChange}
                            >
                                <option value="">Chọn danh mục</option>
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
                                placeholder="Ví dụ: Thư viện tầng 2"
                                value={postForm.location}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Ngày mất / nhặt được</label>
                            <input
                                name="event_date"
                                type="date"
                                value={postForm.event_date}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email liên hệ</label>
                            <input
                                name="contact_email"
                                placeholder="email@example.com"
                                value={postForm.contact_email}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                name="contact_phone"
                                placeholder="0901234567"
                                value={postForm.contact_phone}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group full">
                            <label>Mô tả chi tiết</label>
                            <textarea
                                name="description"
                                placeholder="Mô tả đặc điểm món đồ, thời gian, địa điểm, dấu hiệu nhận biết..."
                                value={postForm.description}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group full">
                            <label>Hình ảnh món đồ</label>
                            <label className="upload-box">
                                <HiPhoto />
                                <span>Chọn ảnh từ thiết bị</span>
                                <small>PNG, JPG, JPEG</small>
                                <input type="file" accept="image/*" hidden />
                            </label>
                        </div>
                    </div>

                    <div className="create-modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

                        <button type="submit" className="btn-submit-post">
                            Đăng bài
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePostModal;