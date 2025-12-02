import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../client";
import { Link } from "react-router";
import "./PostDetails.css"

const PostDetails = () => {

   const { postId } = useParams()

   const [post, setPost] = useState(null);
   const [comments, setComments] = useState([]);
   const [newComment, setNewComment] = useState(null);
   const [currentUser, setCurrentUser] = useState(null);
   const [menuOpen, setMenuOpen] = useState(false);

   const toggleMenu = () => {
   setMenuOpen((prev) => !prev);
   };

   useEffect( () => {

      const fetchPostDetails = async () => {

         const { data: userData, error: userError } = await supabase.auth.getUser();
         if (userError || !userData) {
            console.error("Error fetching user data:", userError);
         } else {
            console.log("user data:", userData.user);
            setCurrentUser(userData.user);
         }


         const data = await supabase
         .from('posts')
         .select(`*, comments(*)`)
         .eq('id', postId)
         .single();

         if (data.error) {
            console.error("Error fetching post details:", data.error);
         } else {
            setPost(data.data);
            console.log("Fetched post details:", data.data);
         }

         const fetchComments = await supabase
         .from('comments')
         .select('*')
         .eq('post_id', postId)
         .order('created_at', { ascending: true });

         if (fetchComments.error) {
            console.error("Error fetching comments:", fetchComments.error);
         } else {
            setComments(fetchComments.data);
            console.log("Fetched comments:", fetchComments.data);
         }
      }
      fetchPostDetails();
   }, [postId]);

   const handleCommentChange = (e) => {
      setNewComment(e.target.value);
    };
    
    const CreateComment = async (e) => {
      e.preventDefault();
    
      if (!newComment.trim()) return;
    
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content: newComment,
          user_id: currentUser.id,
          username: currentUser.user_metadata?.username || currentUser.email,
          // user_id: currentUserId (later, if you have auth)
        })
        .select('*')
        .single(); // get the inserted row back
      
      await supabase
      .from("posts")
      .update({ comments_count: post.comments_count + 1 })
      .eq("id", postId);
    
      if (error) {
        console.error("Error adding comment:", error);
        return;
      }
    

      setComments((prev) => [...prev, data]);
      setNewComment("");
    };

   return (
   <div>
      { !post ? (
         <div>Loading post details...</div>
      ) : (
         <div className="post-details-container">
            <button className="create-post-button" onClick={() => window.history.back()}>
               &larr; Back to Feed
            </button>
            <div className="post-detail">
               <div className="post-info">
                  <div className="post-header">
                     <div className="post-detail-header">
                        <h3>{post.title}</h3>
                        <p className={`${post.type}-header`}>{post.type}</p>

                     </div>
                     {currentUser?.id === post.user_id && (
                        <>
                           <button onClick={toggleMenu}>
                              <FontAwesomeIcon style={{ fontSize: "1.25rem", color: "black" }} icon={faEllipsis} />
                           </button>
                           {menuOpen && (
                              <div className="user-dropdown post-dropdown">
                                 <button>
                                    <Link to={`/edit-post/${post.id}`} state={post}>
                                       Edit
                                    </Link>
                                 </button>
                                 <button>Delete</button>
                              </div>
                           )}
                        </>
                     )}


                  </div>
                  <img src={`${post.image_url}`} alt="Post" />
                  {/* <h3>{post.title}</h3> */}
                  <p className="post-contents">{post.content}</p>
                  <p>Posted by {post.username}</p>
               </div>
               <div className="comment-section">
                  <div className="comment-input-wrapper">
                     <textarea 
                        placeholder="Add comment..." 
                        value={newComment || ""} 
                        onChange={handleCommentChange} 
                     />
                     <button type="submit" onClick={CreateComment}>Submit</button>
                  </div>
                  <h3>Comments</h3>
                  {/* comments list */}
                  { comments && comments.length > 0 ? (
                     <div>
                        <ul className="comment-list">
                           {comments.map((comment) => (
                              <li key={comment.id} className="comment-item">
                                 <div className="user-info">
                                    <FontAwesomeIcon icon={faUser} className="user-icon"/>
                                    <div className="user-header">
                                       <h3>{comment.username}</h3>
                                       <p className="comment-content">{comment.content}</p>
                                    </div>
                                 </div>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ) : <p>No comments yet. Be the first to comment!</p> }

               </div>
            </div>
         </div>
      )}
   </div>
);
};

export default PostDetails