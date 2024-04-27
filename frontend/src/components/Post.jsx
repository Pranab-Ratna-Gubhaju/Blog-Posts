import React from 'react'
import classes from './Post.module.css'

const Post = ({ title, body, onClick }) => {
  return (
    <li className={classes.post} onClick={onClick}>
        <p className={classes.title}>{title}</p>
        <p className={classes.text}>{body}</p>
    </li>
  )
}

export default Post