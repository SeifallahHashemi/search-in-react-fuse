import Fuse from "fuse.js"
import './App.css'
import { useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const res = await fetch('/posts.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return data;
    } catch (error) {
      // console.log(error.message);
      return error.message;
    }
  }

  const retrieveSearchResults = async (query) => {
    const posts = await getPosts();
    // console.log("🚀 ~ file: App.jsx:19 ~ retrieveSearchResults ~ posts:", posts)
    const fuse = new Fuse(posts, {
      keys: ['title','description','tags'],
      includeScore: true,
      shouldSort: true,
      includeMatches: true,
      minMatchCharLength: 3,
      // threshold: 0.3,
    })
    const searchResults = fuse.search(query);
    return searchResults;
  }

  const submitFormHandler = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const query = formData.get('search')
    // console.log("🚀 ~ file: App.jsx:9 ~ submitFormHandler ~ query:", query)
    const postsToDisplay = await retrieveSearchResults(query);
    setPosts(prevState => [...postsToDisplay]);
  }
  
  return (
    <main>
      <form onSubmit={submitFormHandler}>
        <input type="search" name="search" id="search" autoFocus placeholder='search'/>
        <button type='submit' aria-label='search'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"></path></svg>
        </button>
      </form>
      <section aria-label='search results' id="search-results">
        {posts.map(post => {
          return <article key={Math.random().toString(36)+post.item.title}>
            <h2><a href={post.item.href}>{post.item.title}</a></h2>
            <p>{post.item.description}</p>
            <a href={post.item.href} className="btn">Read Pos</a>
          </article>
        })}
      </section>
    </main>
  )
}

export default App
