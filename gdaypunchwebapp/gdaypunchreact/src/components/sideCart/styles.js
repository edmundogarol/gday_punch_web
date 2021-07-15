import styled from "styled-components";
import { device } from "utils/styles";

export const SideCartContainer = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  background: transparent;
  z-index: 11;
`;

export const SideCartPopOut = styled.div`
  width: 35%;
  height: 100%;
  margin-left: auto;
  background: white;
  z-index: 12;
  box-shadow: 7px 0px 12px 6px #888888;
`;
