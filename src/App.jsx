import { useState } from 'react'
import './App.css'
import PostCard from './components/PostCard';

// Mock data for posts
export const mockPosts = [
  {
    id: 1,
    type: "rose",
    title: "Went on a morning walk",
    content: "It felt really peaceful today. Finally got some fresh air.",
    image_url: "https://images.unsplash.com/photo-1520975918318-3f8da8bb07f1",
    upvotes: 12,
    created_at: "2025-02-10T08:21:00Z",
    user: {
      id: "user_1",
      username: "mario",
      avatar_url: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    id: 2,
    type: "thorn",
    title: "Didn't do well on my quiz",
    content: "Kinda disappointed in myself, but trying to keep moving.",
    image_url: "",
    upvotes: 7,
    created_at: "2025-02-09T22:10:00Z",
    user: {
      id: "user_2",
      username: "alex",
      avatar_url: "https://i.pravatar.cc/150?img=12"
    }
  },
  {
    id: 3,
    type: "rose",
    title: "Cooked dinner for myself!",
    content: "I'm proud of this one. It wasn't perfect, but it tasted good!",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    upvotes: 20,
    created_at: "2025-02-08T18:05:00Z",
    user: {
      id: "user_3",
      username: "sophia",
      avatar_url: "https://i.pravatar.cc/150?img=32"
    }
  },
  {
    id: 4,
    type: "thorn",
    title: "Feeling overwhelmed",
    content: "Just a rough mental day. I'm hoping tomorrow is lighter.",
    image_url: "",
    upvotes: 3,
    created_at: "2025-02-10T14:47:00Z",
    user: {
      id: "user_1",
      username: "mario",
      avatar_url: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    id: 5,
    type: "rose",
    title: "Had coffee with a friend",
    content: "Really needed this conversation. Made me feel grounded.",
    image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    upvotes: 18,
    created_at: "2025-02-07T11:30:00Z",
    user: {
      id: "user_4",
      username: "jason",
      avatar_url: "https://i.pravatar.cc/150?img=9"
    }
  }
];

function App() {

  return (
    <div>
      {/* Add filers for feed */}
      {/* Button for creating a post */}
      <h2>Feed</h2>
      <div className='feed'>
        {mockPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default App
