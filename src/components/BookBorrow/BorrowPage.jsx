import React, { useState, useEffect } from 'react';
import { getBorrowings, addBorrowing, updateBorrowing, deleteBorrowing } from '../../api/bookBorrowApi';
import { getBooks } from '../../api/bookApi';
import { toast } from 'react-toastify';
import './BorrowPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const BookBorrowingPage = () => {
  const [borrowings, setBorrowings] = useState([]); // State to store the list of borrowings
  const [books, setBooks] = useState([]); // State to store the list of books
  const [selectedBook, setSelectedBook] = useState(null); // State to store the selected book for borrowing
  const [newBorrowing, setNewBorrowing] = useState({ // State to store the new borrowing form data
    borrowerName: '',
    borrowerMail: '',
    borrowingDate: '',
    returnDate: '', // Return date field
  });
  const [editingBorrowing, setEditingBorrowing] = useState(null); /// State for editing an existing borrowing

   // Fetch books and borrowings data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBooks = await getBooks(); // Fetching books data
        setBooks(fetchedBooks);
  
        const fetchedBorrowings = await getBorrowings(); // Fetching borrowings data
        setBorrowings(fetchedBorrowings);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Failed to fetch data. Please try again later.', { position: 'top-center' });
      }
    };
  
    fetchData(); // Empty dependency array ensures this effect runs once when the component mounts
  }, []);

  // Handle book selection from the dropdown
  const handleBookSelection = (bookId) => {
    const selected = books.find((book) => book.id === parseInt(bookId));
    setSelectedBook(selected); // Set the selected book
  };

  // Handle adding a new borrowing
  const handleAddBorrowing = async (e) => {
    e.preventDefault();

    // Validation: Check if all required fields are filled
  if (!newBorrowing.borrowerName || !newBorrowing.borrowerMail || !newBorrowing.borrowingDate) {
    toast.error('Please fill in all required fields.', { position: 'top-center' });
    return;
  }

    if (!selectedBook) {
      toast.error('Please choose a book.', { position: 'top-center' });
      return;
    }
  
    if (selectedBook.stock <= 0) {
      toast.error('This book is out of stock.', { position: 'top-center' });
      return;
    }
    // Attempt to add borrowing and update stock
    try {
      const addedBorrowing = await addBorrowing({
        ...newBorrowing,
        bookForBorrowingRequest: {
          id: selectedBook.id,
          name: selectedBook.name,
          publicationYear: selectedBook.publicationYear,
          stock: selectedBook.stock - 1,
        },
      });
      
      // Update the books state with new stock value
      setBooks(
        books.map((book) =>
          book.id === selectedBook.id
            ? { ...book, stock: book.stock - 1 }
            : book
        )
      );
  
      setBorrowings([...borrowings, addedBorrowing]); // Add the new borrowing to the list
      setNewBorrowing({
        borrowerName: '',
        borrowerMail: '',
        borrowingDate: '',
      }); // Clear form fields after submission
      setSelectedBook(null);
      toast.success('Borrowing successfully added!', { position: 'top-center' });
    } catch (error) {
      console.error('Borrowing ekleme hatası:', error);
      toast.error('Failed to add borrowing. Please try again.', { position: 'top-center' });
    }
  };

  // Begin editing a borrowing
  const handleEditClick = (borrowing) => {
    setEditingBorrowing(borrowing); // Set the borrowing to be edited
  };
  // Handle updating an existing borrowing
  const handleUpdateBorrowing = async (e) => {
    e.preventDefault();

    if (!editingBorrowing) return;

    const updatedRequest = {
      borrowerName: editingBorrowing.borrowerName,
      borrowingDate: editingBorrowing.borrowingDate,
      returnDate: editingBorrowing.returnDate,
    };

    try { // Attempt to update the borrowing
      const updatedBorrowing = await updateBorrowing(editingBorrowing.id, updatedRequest);
      setBorrowings((prev) =>
        prev.map((borrowing) =>
          borrowing.id === editingBorrowing.id ? updatedBorrowing : borrowing
        )
      );
      toast.success('Borrowing successfully updated!', { position: 'top-center' });
      setEditingBorrowing(null); // Reset form after updating
    } catch (error) {
      console.error('Error updating borrowing:', error);
      toast.error('Failed to update borrowing. Please try again.', { position: 'top-center' });
    }
  };

  // Handle deleting a borrowing
  const handleDeleteBorrowing = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this borrowing?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBorrowing(id); // Delete the borrowing from the backend
      setBorrowings((prev) => prev.filter((borrowing) => borrowing.id !== id)); // Remove from state
      toast.success('Borrowing successfully deleted!', {
        position: 'top-center',
      });
    } catch (error) {
      console.error('Error deleting borrowing:', error);
      toast.error('Failed to delete borrowing. Please try again.', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="book-container">
      <h1 className="book-header">Book Borrowing</h1>
      {/* Display list of borrowings */}
      <ul>
        {borrowings.map((borrowing) => (
          <li key={borrowing.id} className="book-row">
            <div>
            <strong>Borrower:</strong> {borrowing.borrowerName}<br />
            <strong>Email:</strong> {borrowing.borrowerMail}<br />
            <strong>Borrow Date:</strong> {borrowing.borrowingDate}<br />
            <strong>Return Date:</strong> {borrowing.returnDate || 'Not returned yet'}<br />
            <strong>Book:</strong> {borrowing.book?.name}<br />
            </div>
            

            <div className='button-group'>
              {/* Edit button */}
            <button
                className="update-button"
                onClick={() => handleEditClick(borrowing)}
                aria-label="Update Borrow"
              >
                <FaEdit size={20} /> {/* Edit icon */}
              </button>
              {/* Delete button */}
              <button
                className="delete-button"
                onClick={() => handleDeleteBorrowing(borrowing.id)}
                aria-label="Delete Book"
              >
                <FaTrash size={20} /> {/* Trash icon */}
              </button>
            </div>            
          </li>
        ))}
      </ul>

        {/* Borrowing Form */}
      <form onSubmit={handleAddBorrowing} className="book-form">
        <input className="form-input"
          type="text"
          placeholder="Borrower Name"
          value={newBorrowing.borrowerName}
          onChange={(e) =>
            setNewBorrowing({ ...newBorrowing, borrowerName: e.target.value })
          }
        />
        <input className="form-input"
          type="email"
          placeholder="Borrower Mail"
          value={newBorrowing.borrowerMail}
          onChange={(e) =>
            setNewBorrowing({ ...newBorrowing, borrowerMail: e.target.value })
          }
        />
        <input className="form-input"
          type="date"
          placeholder="Borrowing Date"
          value={newBorrowing.borrowingDate}
          onChange={(e) =>
            setNewBorrowing({ ...newBorrowing, borrowingDate: e.target.value })
          }
        />     

        <select onChange={(e) => handleBookSelection(e.target.value)} className="form-input">
          <option value="">Select a Book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id} disabled={book.stock === 0}>
              {book.name} (Stock: {book.stock})
            </option>
          ))}
        </select>

        <button className="add-form-button" type="submit">Add Borrowing</button>
      </form>

      {/* Update Borrowing Form */}
      {editingBorrowing && (
        <form onSubmit={handleUpdateBorrowing} className="update-form">
          <h2>Update Borrowing</h2>
          <input className="form-input"
            type="text"
            value={editingBorrowing.borrowerName}
            onChange={(e) =>
              setEditingBorrowing({ ...editingBorrowing, borrowerName: e.target.value })
            }
          />
          <input className="form-input"
            type="date"
            value={editingBorrowing.borrowingDate}
            onChange={(e) =>
              setEditingBorrowing({ ...editingBorrowing, borrowingDate: e.target.value })
            }
          />
          <input className="form-input"
            type="date"
            value={editingBorrowing.returnDate || ''}
            onChange={(e) =>
              setEditingBorrowing({ ...editingBorrowing, returnDate: e.target.value })
            }
          />
          <button className="submit-button" type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default BookBorrowingPage;
