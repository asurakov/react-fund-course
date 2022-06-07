import React, { useState, useRef, useMemo, useEffect } from 'react';
// import Counter from './components/Counter';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import PostFilter from '../components/PostFilter';
import MyModal from '../components/UI/modal/MyModal';
import MyButton from '../components/UI/button/MyButton';
import { usePosts } from '../hooks/usePosts';
import axios from 'axios';
import PostService from '../API/PostService';
import Loader from '../components/UI/loader/Loader';
import { useFetching } from '../hooks/useFetching';
import { getPageCount, getPagesArray } from '../utils/pages';
import Pagination from '../components/UI/pagination/Pagination';
import { useObserver } from '../hooks/useObserver';
import MySelect from '../components/UI/select/MySelect';


function Posts() {
  //let likes = 0
  // function increment() {
  //   likes += 1
  //   console.log(likes)
  // }

  // const state = useState(0)
  // console.log(state)

  // const [likes, setlikes] = useState(5)
  // console.log(likes)
  // const [value, setValue] = useState('some text')

  // function increment() {
  //   setlikes(likes + 1)
  // }

  // function decrement() {
  //   setlikes(likes - 1)
  // }

  const [posts, setPosts] = useState([
    { id: 1, title: 'Javascript', body: 'Description' },
    { id: 2, title: 'Javascript 2', body: 'Description 2' },
    { id: 3, title: 'Javascript 3', body: 'Description 3' }
  ])

  // const [title, setTitle] = useState('')  
  // const [body, setBody] = useState('')

  const [filter, setFilter] = useState({ sort: '', query: '' })
  const [modal, setModal] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
  //const [isPostLoading, setIsPostLoading] = useState(false)
  const lastElement = useRef()
  
  const [fetchPosts, isPostLoading, postError] = useFetching(async (limit, page) => {
    const response = await PostService.getAll(limit, page)
    //setPosts(response.data)
    setPosts([...posts, ...response.data])
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit))
  })

  //podgruzka postov pri montirovanii komponenta
  useEffect(() => {
    fetchPosts(limit, page)
  }, [page, limit])

  const changePage = (page) => {
    setPage(page)
    //fetchPosts(limit, page)
  }

  useObserver(lastElement, page < totalPages, isPostLoading, () => {
    console.log('current page: ', page)
    setPage(page + 1)
  })    
  

  async function fetchPosts1() {
    //setIsPostLoading(true)
    //const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10')
    const response = await PostService.getAll(limit, page)
    //setPosts(response.data)
    setPosts(response.data)
    //setIsPostLoading(false)
  }

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    console.log(newPost)
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  // const sortedPosts = useMemo(() => {
  //   console.log('worked sortedPostd')
  //   if (filter.sort) {
  //     return [...posts].sort((a, b) => a[filter.sort].localeCompare(b[filter.sort]))
  //   }
  //   return posts
  // }, [filter.sort, posts])

  // const sortedAndSearchedPosts = useMemo(() => {
  //   return sortedPosts.filter(post => post.title.toLowerCase().includes(filter.query.toLowerCase()))
  // }, [filter.query, sortedPosts])

  return (
    <div className="App">
      {/* <div style={{border: '1px solid red'}}>
        <h2>{likes}</h2>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <h2>{value}</h2>
        <input type="text" value={value} onChange={event => setValue(event.target.value)} />
      </div>
      <hr/>
      <Counter />
      <About />
      <Counter /> */}

      <MyButton onClick={fetchPosts1}>Get posts</MyButton>
      <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
        Create post
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }} />
      <PostFilter filter={filter} setFilter={setFilter} />
      <MySelect 
        value={limit}
        onChange={value => setLimit(value)}
        defaultValue="Count elements on page"
        options={[
          {value: 5, name: '5'},
          {value: 10, name: '10'},
          {value: 25, name: '25'},
          {value: -1, name: 'Show all'},
        ]}
      />

      {postError &&
        <h2>An error has occurred: {postError}</h2>
      }
      {/* {isPostLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} ><Loader /></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title='List of posts' />
      } */}

      <PostList remove={removePost} posts={sortedAndSearchedPosts} title='List of posts' />
      <div ref={lastElement} style={{ height: 30, background: 'red' }} />
      {isPostLoading &&
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} ><Loader /></div>
      }

      <Pagination totalPages={totalPages} page={page} changePage={changePage} />

    </div>
  );
}


export default Posts;
