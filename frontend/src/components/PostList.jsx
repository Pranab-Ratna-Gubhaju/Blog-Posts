import { useState, useEffect } from "react";
import classes from "./PostList.module.css";
import Post from "./Post";
import NewPost from "./NewPost";
import Modal from "./Modal";
import PostDetails from "./PostDetails";

const PostList = ({ isPosting, onStopPosting, onPosting }) => {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); 

  async function fetchPosts() {
    setIsFetching(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/blogs");
      if (response.ok) {
        const resData = await response.json();
        setPosts(resData);
        // console.log(posts)
        setIsFetching(false);
      }
    } catch (error) {
      setError(error.message);
      setIsFetching(false);
    }
  }
  
  useEffect(() => {
    fetchPosts();
  }, []);

  function addPostHandler(postData) {
    fetch("http://127.0.0.1:8000/create_blogs", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add post");
        }
        return response.json();
      })
      .then((data) => {
        setPosts((existingPosts) => [ ...existingPosts,data]);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handlePostClick(post) {
    setSelectedPost(post);
    onPosting(); 
  }

  function handleClosePostDetails() {
    setSelectedPost(null);
    onStopPosting();
  }

  function onSave(updatedPost){
    fetch(`http://127.0.0.1:8000/blogs/${updatedPost.blog_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      console.log(response.body)
    })
    .catch(error => {
      console.error('Error updating post:', error);
    });
    fetchPosts();
  }

  function onDelete(id){
    fetch(`http://127.0.0.1:8000/blogs/${id}`, {
        method: 'DELETE',
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
    fetchPosts();
  }

  return (
    <div>
      {!selectedPost && !isFetching && isPosting && (
        <Modal onClose={onStopPosting}>
          <NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
        </Modal>
      )}
      {selectedPost && (
        <PostDetails post={selectedPost} onClose={handleClosePostDetails} onDelete = {onDelete} onSave={onSave} />
      )}
      {error && (
        <div style={{ textAlign: "center", color: "white" }}>
          <h2>Error: {error}</h2>
        </div>
      )}
      {posts.length > 0 ? (
        <ul className={classes.posts}>
          {posts.map((post) => (
            <Post
              key={post.id}
              title={post.title}
              body={post.body}
              onClick={() => handlePostClick(post)} 
            />
          ))}
        </ul>
      ) : !isFetching ? (
        <div style={{ textAlign: "center", color: "white" }}>
          <h2>There are no posts yet.</h2>
          <p>Start adding some!</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "white" }}>
          <h2>Loading posts...</h2>
        </div>
      )}
    </div>
  );
};

export default PostList;
