import React, { useState } from 'react';
import Modal from './Modal';
import classes from "./PostDetails.module.css"

const PostDetails = ({ post, onClose,onDelete,onSave}) => {
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);
  const [isEditing, setIsEditing] = useState(false);

  
    const handleEditClick = () => {
        setIsEditing(true);
    };
  
    const handleCancelClick =()=>{
      setIsEditing(false)
    }

    const handleSaveClick = () => {
      const updatedPost = {
        blog_id: post.id,
        title: editedTitle,
        body: editedBody
      };
      onSave(updatedPost)
      onClose()
    };
    

    const handleDeleteClick = () => {
      onDelete(post.id)
      onClose()
    };


  return (
    <Modal onClose={onClose}>
      <div className={classes.details}>
          {isEditing ? (
        <div className={classes.header}>
            <form className={classes.form}>
            <p>
                <label htmlFor="name">Title</label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
            </p>
            <p>
                <label htmlFor="body">Content</label>
                    <textarea
                        id="body"
                        required rows={3}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                    ></textarea>
            </p>
              
            <div className={classes.buttons1}>
                <button type="button" onClick={handleSaveClick}>Save</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
            </div> 
            </form>
        </div>
          ) : (
            <>
                {!isEditing &&
                    <div className={classes.buttons}>
                    <button onClick={handleEditClick}>Edit</button>
                    <button onClick={handleDeleteClick}>Delete</button>
                </div>
                }
                <h2 className={classes.title}>{post.title}</h2>
                <p className={classes.text}>{post.body}</p>
            </>
          )}
          
        
      </div>
    </Modal>
  );
}

export default PostDetails;
