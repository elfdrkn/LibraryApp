import React, { useState, useEffect } from "react";
import { getBooks, addBook, deleteBook, updateBook } from "../../api/bookApi"; // API calls for fetching, adding, updating, and deleting books
import { getAuthors } from "../../api/authorApi"; // API call to fetch authors
import { getPublishers } from "../../api/publisherApi"; // API call to fetch publishers
import { getCategories } from "../../api/categoryApi"; // API call to fetch categories
import { toast } from "react-toastify"; // For displaying toast notifications
import "./BookPage.css"; // Importing the CSS styles for this page
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons for edit and delete buttons for this page

const AddBook = () => {
  const [books, setBooks] = useState([]); // State to store the list of books
  const [authors, setAuthors] = useState([]); // State to store the list of authors
  const [publishers, setPublishers] = useState([]); // State to store the list of publishers
  const [categories, setCategories] = useState([]); // State to store the list of categories
  const [editingBook, setEditingBook] = useState(null); // State to hold the book being edited
  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    publisherId: "",
    categoryIds: [],
  }); // State to store the data for the new or edited book

  // Fetch data for books, authors, publishers, and categories  when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await getBooks(); // Fetch books from API
        setBooks(booksResponse); // Store fetched books in state
        const authorsResponse = await getAuthors(); // Fetch authors from API
        setAuthors(authorsResponse); // Store fetched authors in state
        const publishersResponse = await getPublishers(); // Fetch publishers from API
        setPublishers(publishersResponse); // Store fetched publishers in state
        const categoriesResponse = await getCategories(); // Fetch categories from API
        setCategories(categoriesResponse); // Store fetched categories in state
      } catch (error) {
        console.error("Error fetching data:", error);  // Log any errors during the fetch
        toast.error("Error fetching data"); // Display an error toast
      }
    };
    fetchData(); // Call the function to fetch data
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  // Handle adding a new book

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all necessary fields are filled
    if (
      !newBook.name ||
      !newBook.publicationYear ||
      !newBook.stock ||
      !newBook.authorId ||
      !newBook.publisherId ||
      !newBook.categoryIds.length
    ) {
      toast.warn("Please fill all required fields"); // Display a warning toast if fields are missing
      return;
    }

    try {
      // Prepare the book data for submission
      console.log("newBook", newBook);
      const bookData = {
        ...newBook,
        author: { id: newBook.authorId }, // Add the author ID to the book data
        publisher: { id: newBook.publisherId }, // Add the publisher ID to the book data
        categories: newBook.categoryIds.map((id) => ({ id })), // Mapping categories
      };

      // Call API to add the book
      await addBook(bookData);
      const booksResponse = await getBooks(); // Fetch the updated list of books
      setBooks(booksResponse); // Update the state with the new list of books

      toast.success("New book added successfully"); // Display a success toast
      setNewBook({
        name: "",
        publicationYear: "",
        stock: "",
        authorId: "",
        publisherId: "",
        categoryIds: [],
      }); // Reset form fields after successful addition
    } catch (error) {
      console.error("Error adding book:", error); // Log any errors during the add
      toast.error("Error adding book"); // Display an error toast
    }
  };

  // Handle editing a book
  const handleEdit = (book) => {
    setEditingBook(book); // Set the book to be edited
    setNewBook({
      name: book.name,
      publicationYear: book.publicationYear,
      stock: book.stock,
      authorId: book.author.id,
      publisherId: book.publisher.id,
      categoryIds: book.categories.map((category) => category.id),
    }); // Pre-fill the form with the book data
  };

  // Handle updating a book
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    if ( // Check if all necessary fields are filled
      !newBook.name ||
      !newBook.publicationYear ||
      !newBook.stock ||
      !newBook.authorId ||
      !newBook.publisherId ||
      !newBook.categoryIds.length
    ) {
      toast.warn("Please fill all required fields."); /// Display a warning toast if fields are missing
      return;
    }

     // Create an updated book object with data from the form
    const updatedBookData = {
      ...editingBook, // Retain the existing book data
      name: newBook.name,
      publicationYear: newBook.publicationYear,
      stock: newBook.stock,
      author: { id: newBook.authorId }, // Update the author ID
      publisher: { id: newBook.publisherId }, // Update the publisher ID
      categories: newBook.categoryIds.map((id) => ({ id })), // Update the categories
    };

    try {
      // Call the API to update the book
      const updatedBook = await updateBook(editingBook.id, updatedBookData);

// Update the books list in the state with the newly updated book
      setBooks(
        books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      ); 
      toast.success("Book updated successfully"); // Display a success toast
      setEditingBook(null); // Reset the editing state
      setNewBook({
        name: "",
        publicationYear: "",
        stock: "",
        authorId: "",
        publisherId: "",
        categoryIds: [],
      }); // Reset the form fields after successful update
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Error updating book"); // Display an error toast
    }
  };

  // Handle deleting a book
  const handleDelete = async (id) => {
    try {
      await deleteBook(id); // Call the API to delete the book
      setBooks(books.filter((book) => book.id !== id));  // Remove the deleted book from the state
      toast.success("Book deleted successfully"); // Display a success toast
    } catch (error) {
      console.error("Error deleting book:", error); // Log any errors during deletion
      toast.error("Error deleting book"); // Display an error toast
    }
  };

  return (
    <div className="book-container">
      <h1 className="book-header">Books List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id} className="book-row">
            <div>
              <strong>{book.name}</strong> ({book.publicationYear}) - Stock:{" "}
              {book.stock}
              <br />
              <strong>Author:</strong> {book.author?.name} <br />
              <strong>Publisher:</strong> {book.publisher?.name} <br />
              <strong>Categories:</strong>{" "}
              {book.categories?.map((category) => category.name).join(", ")}{" "}
              <br />
            </div>
            <div className="button-group">
              <button
                className="update-button"
                onClick={() => handleEdit(book)}
                aria-label="Update Book"
              >
                <FaEdit size={20} /> {/* Edit icon */}
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(book.id)}
                aria-label="Delete Book"
              >
                <FaTrash size={20} /> {/* Trash icon */}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>
      <form onSubmit={editingBook ? handleUpdate : handleSubmit}>
        <div>
          <label>Book Name:</label>
          <input
            className="form-input"
            type="text"
            value={newBook.name}
            onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Publication Year:</label>
          <input
            className="form-input"
            type="number"
            value={newBook.publicationYear}
            onChange={(e) =>
              setNewBook({ ...newBook, publicationYear: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Stock:</label>
          <input
            className="form-input"
            type="number"
            value={newBook.stock}
            onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Author:</label>
          <select
            value={newBook.authorId}
            onChange={(e) =>
              setNewBook({ ...newBook, authorId: e.target.value })
            }
            required
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Publisher:</label>
          <select
            value={newBook.publisherId}
            onChange={(e) =>
              setNewBook({ ...newBook, publisherId: e.target.value })
            }
            required
          >
            <option value="">Select Publisher</option>
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Categories:</label>
          <select
            multiple
            value={newBook.categoryIds}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                categoryIds: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => {
            setEditingBook(null); // Clear Edit mode
            setNewBook({
              name: "",
              publicationYear: "",
              stock: "",
              authorId: "",
              publisherId: "",
              categoryIds: [],
            }); // Clear form
          }}
          className="cancel-button"
        >
          Cancel
        </button>

        <button className="add-form-button" type="submit">
          {editingBook ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
