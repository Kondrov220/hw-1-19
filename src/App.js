import "./App.css";
import styled from "styled-components";
import { useReducer, useEffect } from "react";

const Header = styled.header`
  width: 100%;
  padding: 20px;
  background: #222;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  border-radius: 20px;
  border: none;
`;

const Gallery = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const LoadMoreBtn = styled.button`
  margin: 0 auto;
  display: block;
  padding: 10px 20px;
`;
const initialState = {
  images: [],
  query: "",
  count: 16,
};

function reducer(state, action) {
  switch (action.type) {
    case "SEARCH":
      return { ...state, query: action.payload, count: 16 };
    case "SET_IMAGES":
      return { ...state, images: action.payload };
    case "LOAD_MORE":
      return { ...state, count: state.count + 16 };
    default:
      return state;
  }
}

function useImages(query, count, dispatch) {
  useEffect(() => {
    if (!query) return;

    fetch(
      `https://pixabay.com/api/?key=50978158-2e1c075068d4fb19bda657fd9&q=${query}&per_page=${count}`
    )
      .then(res => res.json())
      .then(data =>
        dispatch({ type: "SET_IMAGES", payload: data.hits })
      );
  }, [query, count, dispatch]);
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { images, query, count } = state;

  useImages(query, count, dispatch);

  return (
    <>
      <Header>
        <SearchInput
          placeholder="Search..."
          value={query}
          onChange={(e) =>
            dispatch({ type: "SEARCH", payload: e.target.value })
          }
        />
      </Header>

      <Gallery>
        {images.map(img => (
          <li key={img.id}>
            <img src={img.previewURL} alt="" />
          </li>
        ))}
      </Gallery>

      {images.length > 0 && (
        <LoadMoreBtn
          onClick={() => dispatch({ type: "LOAD_MORE" })}
        >
          Load more
        </LoadMoreBtn>
      )}
    </>
  );
}
