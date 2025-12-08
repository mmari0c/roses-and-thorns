import "./CreatePost.css";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../client";
import { useParams, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faImage } from "@fortawesome/free-solid-svg-icons";
import tape from "../assets/tape.png";

function EditPost() {

  const {postId} = useParams();
  const { state } = useLocation();
  const fileInputRef = useRef(null);

  const [postData, setPostData] = useState({
   type: "",
   title: "",
   content: "",
   image_url: ""
 });
  const [error, setError] = useState(null);
 
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
<div className="create-page">
  <button
    className="create-post-button back-button"
    onClick={() => window.history.back()}
  >
    &larr; Back to Post
  </button>

  <div className="create-post-container entry-paper">
    {/* <img class="tape tape-left" src={tape} alt="tape" />
    <img class="tape tape-right" src={tape} alt="tape" /> */}
    <h2 className="entry-header">✦ Edit Entry</h2>
    <p className="entry-subtitle">
      Update your reflection. Tweak your rose or thorn, or add more context.
    </p>

    <form className="create-post-form" onSubmit={updatePost}>
      <div className="form-item">
        <label>Type</label>
        <div className="create-type">
          <div className="type-option">
            <button
              className={`rose-type ${postData.type === "Rose" ? "active" : ""}`}
              name="type"
              type="button"
              value="Rose"
              onClick={handleChange}
            >
              Rose
            </button>
            <span className="tooltip rose">
              A positive moment or highlight from your day.
            </span>
          </div>

          <div className="type-option">
            <button
              className={`thorn-type ${postData.type === "Thorn" ? "active" : ""}`}
              name="type"
              type="button"
              value="Thorn"
              onClick={handleChange}
            >
              Thorn
            </button>
            <span className="tooltip thorn">
              A challenge or difficult moment you want to reflect on.
            </span>
          </div>
        </div>
      </div>

      {postData.image_url ? (
        <div
          className="upload-trigger"
          onClick={() => fileInputRef.current.click()}
        >
          <img
            src={postData.image_url}
            alt="Preview"
            className="preview-image"
            style={{pointer: "cursor"}}
          />
        </div>
        ) : ( null
      )}

      <div className="form-item">
        <div className="form-content">
          <input
            className="entry-title"
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
            value={postData.title}
          />
          <textarea
            className="entry-textarea"
            name="content"
            placeholder="Write your thoughts here, just like a journal page..."
            onChange={handleChange}
            value={postData.content}
            required
          ></textarea>
        </div>
      </div>

      <div className="form-item">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Clickable icon OR preview image */}
        <div
          className="upload-trigger"
          onClick={() => fileInputRef.current.click()}
        >
          {postData.image_url ? (
            null
          ) : (
            <FontAwesomeIcon icon={faImage} className="upload-icon" />
          )}
        </div>
      </div>
      

      <div className="edit-buttons">
        <button className="submit-entry delete-button" onClick={deletePost}>
          Trash Entry
        </button>
        <button className="edit-button submit-entry" type="submit">
          Save Changes
        </button>
      </div>

      {error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faCircleExclamation} />
          <p className="error-message">{error}</p>
        </div>
      )}
    </form>
  </div>
</div>


  );
 }
 
 export default EditPost;