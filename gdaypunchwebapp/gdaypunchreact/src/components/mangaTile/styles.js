import styled from "styled-components";

export const MangaTile = styled.div`
  margin: 20pt;

  a {
    &:hover {
      cursor: pointer;
    }
  }

  img {
    &:hover {
      transition-duration: 0.3s;
      box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
      -webkit-transform: scale(1.1);
      transform: scale(1.05);
    }
  }
`;

export const MangaImage = styled.img`
  max-height: 15em;
`;

export const MangaTitle = styled.h2`
  font-size: 1em;
  margin: unset;
  max-width: 12em;
`;

export const MangaArtist = styled.h4`
  font-size: 0.8em;
  margin: unset;
  max-width: 12em;
  white-space: nowrap;
`;

export const MangaDetails = styled.div`
  display: flex;
  flex-direction: row;
  text-align: start;
  margin-left: auto;
  margin-right: auto;
  width: max-content;
  margin-top: 10pt;
  margin-bottom: 10pt;
  align-items: flex-end;

  a {
    text-decoration: none;
    color: black;
  }

  svg {
    margin-left: 20pt;
    height: 1em;

    &:hover {
      cursor: pointer;
      transition-duration: 0.3s;
      box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);
      -webkit-transform: scale(1.02);
      transform: scale(1.1);
    }
  }

  p {
    margin-bottom: unset;
  }
`;

export const ActionButton = styled.button`
  font-size: 0.9em;
  width: 100%;
  height: 3em;
  background: transparent;
  border: 2px solid #d4882d;
  color: #d4882d;
  font-weight: 600;
  text-transform: uppercase;
  background: linear-gradient(
    45deg,
    transparent 89%,
    #d69e5a 30%,
    #d69e5a 114%,
    transparent 5%
  );
  margin-bottom: 1em;

  &:hover {
    background: #ffbc6a;
    border: 2px solid #ffbc6a;
    color: white;
    cursor: pointer;
  }
`;
