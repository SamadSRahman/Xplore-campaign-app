import React, { useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import PropTypes from "prop-types";
import { FaArrowRightLong } from "react-icons/fa6";

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const handleSearch = () => {
    if (input.trim() !== "") {
      onSearch(input);
      setInput("");
    }
  };
 

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Auto-resize logic
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  };
  return (
    <div className={styles.searchBar}>
      <textarea
        ref={textareaRef}
        placeholder={"Ask anything..."}
        className={styles.input}
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent line break
            handleSearch();
          }
        }}
        rows={1} // Default number of rows
        style={{ resize: "none", overflow: "hidden" }} // Prevent manual resizing
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        <FaArrowRightLong />
      </button>
     
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
