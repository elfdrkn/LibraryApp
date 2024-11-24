import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import PublisherPage from './components/Publisher/PublisherPage';
import CategoryPage from './components/Category/CategoryPage';
import BookPage from './components/Book/BookPage';
import AuthorPage from './components/Author/AuthorPage';
import BorrowPage from './components/BookBorrow/BorrowPage';
import Navbar from './components/Navbar/Navbar'; // import Navbar
import { ToastContainer } from 'react-toastify';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> {/* Add navbar */}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publishers" element={<PublisherPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/authors" element={<AuthorPage />} />
        <Route path="/books" element={<BookPage />} />        
        <Route path="/borrow" element={<BorrowPage />} />
      </Routes>
    </Router>
  );
}

export default App;