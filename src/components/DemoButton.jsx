"use-client";
import React from "react";
import styled from "styled-components";
import space from "@/utils/space";
import PropTypes from "prop-types";

function DemoButton({ children, mb = 0, icon, ...props }) {
  return (
    <StyledButton $mb={mb} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </StyledButton>
  );
}

DemoButton.propTypes = {
  children: PropTypes.node.isRequired,
  mb: PropTypes.number,
  icon: PropTypes.node,
};

export default DemoButton;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${space(2)}px;
  background-color: var(--color-text);
  color: var(--color-bg);
  cursor: pointer;
  padding: ${space(2)}px ${space(5)}px;
  border: 0;
  border-radius: ${space(0)}px;
  margin-top: ${space(1)}px; /* added to balance mb spacing of H1 */
  margin-bottom: ${({ $mb = 0 }) => ($mb > 0 ? `${space($mb)}px` : `${$mb}px`)};
  transition: background 0.2s;

  &:hover {
    background-color: var(--color-secondary);
  }
  .btn-icon {
    display: flex;
    align-items: center;
  }
`;
