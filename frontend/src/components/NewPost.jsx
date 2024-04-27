import { useState } from 'react';
import classes from './NewPost.module.css';

function NewPost({onCancel,onAddPost}) {

    let [enteredBody,setEnteredBody] = useState('')
    let [enteredTitle,setEnteredTitle] = useState('')


    function bodyChangeHandler(event){
        setEnteredBody(event.target.value)
    }

    function titleChangeHandler(event){
        setEnteredTitle(event.target.value)
    }

    function submitHandler(event){
        event.preventDefault()
        const postData={
          title : enteredTitle,
          body : enteredBody,
        };
        onAddPost(postData)
        onCancel()
    }


  return (
    <form className={classes.form} onSubmit={submitHandler}>
      

      <p>
        <label htmlFor="name">Title</label>
        <input type="text" id="name" required onChange={titleChangeHandler}/>
      </p>

      <p>
        <label htmlFor="body">Content</label>
        <textarea id="body" required rows={3} onChange={bodyChangeHandler} />
      </p>

      <p className={classes.actions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button>Submit</button>
      </p>
    </form>
  );
}

export default NewPost;