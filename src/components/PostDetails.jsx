const PostDetails = ({ post }) => {
   return (
      // Button to go back to feed
      <div className="post-detail">
         <div>
            <h3>{post.title}</h3>
            
            <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
            <p>{post.content}</p>
         </div>
         <div className="comment-section">

         </div>
      </div>
   )
}