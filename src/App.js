import './App.css';
import styled from 'styled-components';
import { useState, useMemo } from "react";

const Header = styled.header`
  width: 100%;
  padding: 20px;
  background: #222;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px 14px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 16px;
`;

const AppWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
`;

const Gallery = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 0;
  margin: 0 0 30px;
`;

const GalleryItem = styled.li`
  background: #f4f4f4;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
`;

const LoadMoreBtn = styled.button`
  display: block;
  margin: 0 auto;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #007aff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #005ad1;
  }
`;

function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(16);

  const fetchImages = (q, perPage) => {
    fetch(
      `https://pixabay.com/api/?key=50978158-2e1c075068d4fb19bda657fd9&q=${q}&image_type=photo&orientation=horizontal&per_page=${perPage}`
    )
      .then(res => res.json())
      .then(data => setImages(data.hits));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setCount(16);
    fetchImages(value, 16);
  };

  const handleLoadMore = () => {
    const newCount = count + 16;
    setCount(newCount);
    fetchImages(query, newCount);
  };

  const imagesToShow = useMemo(() => images, [images]);

  return (
    <>
      <Header>
        <SearchInput
          placeholder="Search images..."
          value={query}
          onChange={handleSearch}
        />
      </Header>

      <AppWrapper>
        <Gallery>
          {imagesToShow.map(img => (
            <GalleryItem key={img.id}>
              <img src={img.largeImageURL} alt={img.tags} />
            </GalleryItem>
          ))}
        </Gallery>

        {imagesToShow.length > 0 && (
          <LoadMoreBtn onClick={handleLoadMore}>Load more</LoadMoreBtn>
        )}
      </AppWrapper>
    </>
  );
}

export default App;
