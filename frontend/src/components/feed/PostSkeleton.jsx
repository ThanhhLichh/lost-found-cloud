import "./PostSkeleton.css";

function PostSkeleton() {
    return (
        <div className="post-skeleton">
            <div className="skeleton-header">
                <div className="skeleton-avatar skeleton"></div>
                <div className="skeleton-lines">
                    <div className="skeleton skeleton-line short"></div>
                    <div className="skeleton skeleton-line tiny"></div>
                </div>
            </div>

            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text small"></div>

            <div className="skeleton-tags">
                <div className="skeleton skeleton-pill"></div>
                <div className="skeleton skeleton-pill"></div>
                <div className="skeleton skeleton-pill"></div>
            </div>
        </div>
    );
}

export default PostSkeleton;