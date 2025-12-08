import "./CreatePost.css";
import { useState, useRef } from "react";
import { supabase } from "../client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faImage } from "@fortawesome/free-solid-svg-icons";
import tape from "../assets/tape.png";


function CreatePost() {

  console.log(supabase.storage.from("post-images"));


  const [postData, setPostData] = useState({
    type: "", title: "", content: "", image_url: ""
  });
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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

  const CreatePost = async (event) => {

    event.preventDefault();

    if (!postData.type || (postData.type !== "Rose" && postData.type !== "Thorn")){
  // show an error and stop
    setError("Please choose Rose or Thorn before submitting.");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("No logged in user", userError);
      // ChANGE TO REDIRECT TO LOGIN AND SHOW MESSAGE
      return;
    }

    if (!postData.type) {
  // show an error and stop
    setError("Please choose Rose or Thorn before submitting.");
      return;
    }


    const user = userData.user;
    const userId = user.id;
    const username = user.user_metadata?.username || user.email

    const { error } = await supabase
    .from('posts')
    .insert({title: postData.title, type: postData.type, content: postData.content, image_url: postData.image_url, user_id: userId, username: username })
    .select();

    if (error) {
      console.error("Error creating post:", error);
      return;
    }

    window.location = "/feed";
  }


  return (
<div className="create-page">
  <div className="create-post-container entry-paper">
    <h2 className="entry-header">✦ New Entry</h2>
    <p className="entry-subtitle">
      Take a moment to reflect. Share today’s rose or thorn in your journal.
    </p>

    <form className="create-post-form" onSubmit={CreatePost}>

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
          <span className="tooltip rose">A positive moment or highlight from your day.</span>
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
          <span className="tooltip thorn">A challenge or difficult moment you want to reflect on.</span>
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
          />
          <textarea
            className="entry-textarea"
            name="content"
            placeholder="Write your thoughts here, just like a journal page..."
            onChange={handleChange}
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
        <button className="edit-button submit-entry" type="submit">
          Post Entry
        </button>
      </div>

      

      { error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faCircleExclamation}/> 
          <p className="error-message">{error}</p>
        </div>
      )}
    </form>
  </div>
</div>
  );
 }
 
 export default CreatePost;