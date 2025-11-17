const PostCard = ({ post }) => {

   return (
      <div className="post-card">
         <div className="post-header">
            {/* <img src={post.user.avatar_url} alt={`${post.user.username}'s avatar`} className="avatar" /> */}
            <div className="user-info">
               <h3>{post.user.username}</h3>
               <p>{post.type}</p>
            </div>
         </div>
         <div className="post-content">
            <h2>{post.title}</h2>
            <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
            <p>{post.content}</p>
            {/* {post.image_url && <img src={post.image_url} alt="Post visual content" className="post-image" />} */}
         </div>
         <div className="post-footer">
            <span className="upvotes">👍 {post.upvotes}</span>
            {/* <span className={`post-type ${post.type}`}>{post.type === 'rose' ? '🌹 Rose' : '🌵 Thorn'}</span> */}
         </div>
      </div>
   )
}

export default PostCard
