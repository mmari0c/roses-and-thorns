import "./CreatePost.css";
import { useState, useEffect } from "react";
import { supabase } from "../client";
import { useParams, useLocation } from "react-router";

function EditPost() {

  const {postId} = useParams();
  const { state } = useLocation();

  const [postData, setPostData] = useState({
   type: "",
   title: "",
   content: "",
   image_url: ""
 });
 
 useEffect(() => {
   // 1. If post was passed through route state
   if (state?.post) {
     setPostData({
       type: state.post.type || "",
       title: state.post.title || "",
       content: state.post.content || "",
       image_url: state.post.image_url || ""
     });
     return; // stop, no need to fetch
   }
 
   // 2. If user refreshed page or navigated directly → fetch by ID
   const fetchPost = async () => {
     const { data, error } = await supabase
       .from("posts")
       .select("*")
       .eq("id", postId)
       .single();
 
     if (error) {
       console.error("Error fetching post:", error);
       return;
     }
 
     setPostData({
       type: data.type || "",
       title: data.title || "",
       content: data.content || "",
       image_url: data.image_url || ""
     });
   };
 
   fetchPost();
 }, [postId, state]);

 console.log(postData);
 

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);

    const { name, value } = e.target;
    setPostData( (prevData) => {
      return { ...prevData, [name]: value }
    })

    console.log(postData);
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // optional: show something while uploading
    console.log("Uploading image:", file.name);
  
    // upload to a bucket in Supabase Storage, e.g. "post-images"
    const filePath = `posts/${Date.now()}-${file.name}`;
  
    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(filePath, file);
  
    if (error) {
      console.error("Error uploading image:", error);
      return;
    }
  
    // get public URL
    const { data: publicData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);
  
    const publicUrl = publicData.publicUrl;
  
    // store in postData so you can save it with your post
    setPostData((prev) => ({
      ...prev,
      image_url: publicUrl
    }));
  
    console.log("Image uploaded! URL:", publicUrl);
  };

  const updatePost = async (event) => {

    console.log(postData);
    event.preventDefault();

    await supabase
    .from('posts')
    .update({title: postData.title, type: postData.type, content: postData.content, image_url: postData.image_url})
    .eq('id', postId)
    .select();

    window.history.back();
  }

  const deletePost = async (event) => {
   event.preventDefault();

   await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

   window.location = "/";
  }


  return (
    <div>
      <button className="create-post-button" onClick={() => window.history.back()}>
      &larr; Back to Post
      </button>
    <div className="create-post-container">

     <h2>Edit Post</h2>
     <form className="create-post-form">
        <div className="form-item">
          <label>
          Type
        </label>
        <div className="create-type">
            <button className={`rose-type ${postData.type === "Rose" ? "active" : ""}`} name="type" type="button" value="Rose" onClick={handleChange}>
                    Roses
            </button>

            <button className={`thorn-type ${postData.type === "Thorn" ? "active" : ""}`} name="type" type="button" value="Thorn" onClick={handleChange}>
                    Thorns
            </button>
          </div>
        </div>
        <div className="form-item">
          <label> Title</label>
          <input value={`${postData.title}`} type="text" name="title" placeholder="Enter post title" onChange={handleChange} />
        </div>
        <div className="form-item">
          <label>Content</label>
          <textarea value={`${postData.content}`} name="content" placeholder="Share your thoughts..." onChange={handleChange}></textarea>
        </div>
      <div className="form-item">
       <label>Image URL</label>
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
        />
      </div>
      <button className="edit-button" type="submit" onClick={updatePost}>Edit Post</button>
      <button className="delete-button" type="button" onClick={deletePost}>Delete Post</button>
     </form>
    </div>

    </div>

  );
 }
 
 export default EditPost;