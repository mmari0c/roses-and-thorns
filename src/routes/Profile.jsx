import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router";
import { supabase } from "../client";
import "./Profile.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

function Profile () {

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      // 1️⃣ Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/");
        return; // stop running fetchPosts
      }
  
      // 2️⃣ Fetch posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", sessionData.session.user.id)
        .order("created_at", { ascending: false });
      
      setPosts(postsData || []);
    };
  
    loadData();
  }, [navigate]);

  // const handleAvatarChange = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !currentUser) return;

  //   setUploading(true);
  //   setError("");

  //   try {
  //     // 1️⃣ Make a unique file path
  //     const fileExt = file.name.split(".").pop();
  //     const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
  //     const filePath = `avatars/${fileName}`;

  //     // 2️⃣ Upload to storage
  //     const { error: uploadError } = await supabase.storage
  //       .from("avatars")
  //       .upload(filePath, file);

  //     if (uploadError) {
  //       throw uploadError;
  //     }

  //     // 3️⃣ Get a public URL
  //     const { data } = supabase.storage
  //       .from("avatars")
  //       .getPublicUrl(filePath);

  //     const publicUrl = data.publicUrl;

  //     // 4️⃣ Save URL on user_metadata
  //     const { error: updateError } = await supabase.auth.updateUser({
  //       data: { avatar_url: publicUrl },
  //     });

  //     if (updateError) {
  //       throw updateError;
  //     }

  //     // 5️⃣ Let parent know so UI updates
  //     if (onAvatarChange) onAvatarChange(publicUrl);
  //   } catch (err) {
  //     console.error("Error uploading avatar:", err);
  //     setError("Something went wrong uploading your picture.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };


  return (
    <div>
      <div className="profile-header">
        <h2>My Journal</h2>
        <label>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            // onChange={handleAvatarChange}
          />
          {/* <FontAwesomeIcon icon={faCircleUser} size="2x" style={{ cursor: "pointer" }} /> */}
        </label>
      </div>
      {posts.length === 0 ? (
        <p>You have not made any posts yet.</p>
      ) : (
        <div className="feed">
          {posts && posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p>No posts available.</p>
          )
          }
        </div>
      )}
    </div>
  );
}

export default Profile;