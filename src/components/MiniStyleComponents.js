import space from "@/utils/space";
import styled, { keyframes } from "styled-components";
import { Loader2 as Loader2Icon } from "lucide-react";
import { device } from "@/styles/breakpoints";

// Basic Form Elements
export const FormWrapper = styled.div`
  input,
  select {
    display: block;
    margin: auto;
    width: ${space(50)}px;
    height: ${space(7)}px;
    padding: ${space(1)}px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-muted);
    margin-bottom: ${space(3)}px;
  }
`;

// Overlay for loading text
export const Overlay = styled.div`
  position: absolute;
  border-radius: ${space(3)}px;
  background-color: var(--color-trans-text);
  color: var(--color-bg);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  span.overlayBlock {
    display: flex;
    flex-wrap: wrap;
    background-color: var(--color-trans-text-darker);
    padding: ${space(2)}px;
    margin: ${space(2)}px;
    border-radius: ${space(1)}px;
    align-items: center;
    justify-content: center;
  }

  span.overlayIcon {
    margin-right: ${space(2)}px;
  }

  &.fade-in {
    opacity: 1;
  }

  &.fade-out {
    opacity: 0;
  }
`;

// Spinner Icon  $color="var(--color-text)"
const spin = keyframes`
to {transform: rotate(360deg);}
`;

export const Spinner = styled(Loader2Icon)`
  animation: ${spin} 1s linear infinite;
  font-size: var(--type-size-md);
  color: ${(props) => props.$color || "var(--color-bg)"};
`;

export const Error = styled.div`
  color: var(--color-accent);
  font-size: var(--type-size-xs);
  font-weight: bold;
  margin-bottom: ${space(1)}px;
`;

// AuthButton
export const AuthButton = styled.button`
  background-color: var(--color-muted);
  color: var(--color-surface);
  padding-top: ${space(1)}px;
  padding-bottom: ${space(1)}px;
  height: auto;
  cursor: pointer;
  border: 1px solid var(--color-text);
  transition: background 0.3s;
  margin-bottom: ${space(5)}px;

  &:hover {
    background-color: var(--color-text);
  }
  &:disabled:hover {
    background-color: var(--color-muted);
    cursor: default;
  }
`;

export const Prompt = styled.div`
  max-width: ${space(80)}px;
  text-align: center;
  margin: auto;

  .iconContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: ${space(2)}px;
    padding-top: ${space(2)}px;
  }

  .text {
    margin-bottom: ${space(3)}px;
  }
`;

export const Alert = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: ${space(1)}px ${space(2)}px;
  flex-wrap: wrap;
  text-align: left;
  font-size: var(--type-size-xs);
  color: var(--color-muted);
  background-color: var(--color-bg);
  padding: ${space(2)}px;
  border: 0px solid var(--color-text);
  border-radius: ${space(3)}px;
  margin-bottom: ${space(5)}px;

  @media ${device.laptop} {
    flex-direction: row;
    align-items: center;

    flex-wrap: nowrap;
  }

  button {
    background-color: var(--color-muted);
    color: var(--color-surface);
    padding: ${space(1)}px ${space(0)}px;
    cursor: pointer;
    border: 1px solid var(--color-bg);
    transition: background 0.3s;
    border-radius: ${space(1)}px;
    min-width: ${space(45)}px;

    &:hover {
      background-color: var(--color-text);
    }
  }
  .maxWidth {
    flex: 1;
  }
  /* @media ${device.tablet} {
    .maxWidth {
      max-width: ${space(142)}px;
    }
  } */
`;

export const LinkButton = styled.button`
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-bottom: ${space(2)}px;
`;

export const IconWrapper = styled.div`
  width: ${space(20)}px;
  height: ${space(20)}px;
  margin-bottom: ${space(5)}px;
  background-color: var(--color-bg);
  padding: ${space(2)}px;
  border-radius: ${space(3)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
