import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import PostCard from './components/PostCard';
import { supabase } from './client';


function App() { 

  const navigate = useNavigate();

  const [originalPosts, setOriginalPosts] = useState([]); // keep full list;
  const [posts, setPosts] = useState([]);
  const [filterBy, setFilterBy] = useState("all");
  const [searchInput, setSearchInput] = useState("");

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
        .order("created_at", { ascending: false });
  
        if (postsData) {
          setOriginalPosts(postsData);
          setPosts(postsData);
        }
    };
  
    loadData();
  }, [navigate]);
  


    const handleFilterChange = (e) => {
      const choice = e
      setFilterBy(choice);
      switch (choice) {
        case "all":
          setPosts(originalPosts);
          break;
    
        case "rose":
          setPosts(originalPosts.filter((p) => p.type === "Rose"));
          break;
    
        case "thorn":
          setPosts(originalPosts.filter((p) => p.type === "Thorn"));
          break;
      }
    };
    
    const handleSort = (e) => {
      let sorted = [...posts]; // clone so you don’t mutate
      const type = e.target.value;

      console.log(type)
    
      if (type === "latest") {
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    
      if (type === "mostSupported") {
        sorted.sort((a, b) => b.upvotes - a.upvotes);
      }
    
      setPosts(sorted);
    };

    const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchInput(value);
    
      if (!value.trim()) {
        // empty search → reset to full list
        setPosts(originalPosts);
        return;
      }
    
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(value)
      );
    
      setPosts(filtered);
    };
    

  return (
  <div className="feed-container">
    <h2>Community Journal</h2>
    <div className="feed-header">
    {/* <input  onChange={handleSearch}placeholder='Search post...'></input> */}
      <div className='settings'>
        
          <div className="filter-bar">
            <button 
              className={ filterBy === "all" ? "all-active" : ""} 
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>

            <button 
              className={filterBy === "rose" ? "rose-active" : ""} 
              onClick={() => handleFilterChange("rose")}
            >
              Roses
            </button>

            <button 
              className={filterBy === "thorn" ? "thorn-active" : ""} 
              onClick={() => handleFilterChange("thorn")}
            >
              Thorns
            </button>
            
          </div>
        <select onChange={ (inputString) => handleSort(inputString.target.value)}>
          <option disabled selected>Sort</option>
          <option value="latest">Latest</option>
          <option value="mostSupported">Most Supported</option>
        </select>
      </div>
    </div>

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
  </div>
  )
}

export default App
