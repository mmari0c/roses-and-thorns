import "./PostCard.css"
import { useState } from "react";
import { Link } from "react-router";
import { faUser, faComment } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../client";

const PostCard = ({ post: initialPost }) => {

   const [post, setPost] = useState(initialPost);

   function timeAgo(dateString) {
      const now = new Date();
      const past = new Date(dateString);
      const diff = (now - past) / 1000; // seconds
    
      if (diff < 60) return "just now";
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
      return past.toLocaleDateString();
   }

   const updateUpvotes = async () => {
      // Optimistically update UI
         console.log("Upvoting post ID:", post.id);
         const newUpvotes = post.upvotes + 1;

         setPost((prev) => ({ ...prev, upvotes: newUpvotes }));

         // Update in database

         const { data, error } = await supabase.rpc("increment_post_upvotes", {
           p_post_id: post.id,
         });
       
         if (error) {
           console.error("Error incrementing upvotes:", error);
           // rollback if you want:
           setPost((prev) => ({ ...prev, upvotes: prev.upvotes - 1 }));
         }
   } 

   return (

      <div className={`post-card ${post.type}`}>
            {/* <img src={post.user.avatar_url} alt={`${post.user.username}'s avatar`} className="avatar" /> */}
            <div className="user-info">
               <div className="user">
                  <FontAwesomeIcon icon={faUser} className="user-icon"/>
                  <p>{post.username}</p>
               </div>
               <div className="user-header">
                  {/* <h3>username</h3> */}
                  <p className={`${post.type}-header`}>{post.type}</p>
               </div>
            </div> 
            {post.image_url && (
               <Link to={`/post/${post.id}`}>
                  <img src={`${post.image_url}`} alt="" />
               </Link>
            )} 
            <div className="post-content">
               <Link to={`/post/${post.id}`}>
               <h2>{post.title}</h2>
               </Link>
               <p className="post-date">{timeAgo(post.created_at)}</p>
         </div>
         <div className="post-footer">
            <span onClick={updateUpvotes} className="upvotes"><FontAwesomeIcon icon={faHeart} />{post.upvotes}</span>
            <span className="comments"><FontAwesomeIcon icon={faComment} />{post.comments_count}</span>
            {/* <span className={`post-type ${post.type}`}>{post.type === 'rose' ? '🌹 Rose' : '🌵 Thorn'}</span> */}
         </div>
      </div>
   )
}

export default PostCard
