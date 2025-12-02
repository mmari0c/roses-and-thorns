import "./CreatePost.css";
import { useState } from "react";
import { supabase } from "../client";

function CreatePost() {

  console.log(supabase.storage.from("post-images"));


  const [postData, setPostData] = useState({
    type: "", title: "", content: "", image_url: ""
  });

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

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("No logged in user", userError);
      // ChANGE TO REDIRECT TO LOGIN AND SHOW MESSAGE
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
    <div>
      <button className="create-post-button" onClick={() => window.history.back()}>
      &larr; Back to Feed
      </button>
    <div className="create-post-container">

     <h2>Create a New Post</h2>
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
          <input type="text" name="title" placeholder="Enter post title" onChange={handleChange} />
        </div>
        <div className="form-item">
          <label>Content</label>
          <textarea name="content" placeholder="Share your thoughts..." onChange={handleChange}></textarea>
        </div>
      <div className="form-item">
       <label>Image URL</label>
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
        />
      </div>


      <button className="edit-button"type="submit" onClick={CreatePost}>Submit Post</button>
     </form>
    </div>

    </div>

  );
 }
 
 export default CreatePost;