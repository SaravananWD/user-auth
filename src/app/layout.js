"use client";
import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

import "@/styles/global.css";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import AuthProvider from "@/context/AuthContext";
import Wrapper from "@/components/Wrapper";
import styled from "styled-components";

export default function AuthPrototypeLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Wrapper>
            <AuthProvider>
              <DemoWrapper>{children}</DemoWrapper>
            </AuthProvider>
            <Footer>
              <span>
                *User accounts may be periodically cleared for maintenance
                purposes.
              </span>
              <span>
                This demo showcases a user authentication system built by{" "}
                <Link
                  href="https://github.com/SaravananWD/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Saravanan
                </Link>{" "}
                during his systematic React development journey.
                <br /> Source code available at{" "}
                <Link
                  href="https://github.com/SaravananWD/user-auth"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
                .
              </span>
            </Footer>
          </Wrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

AuthPrototypeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
const Footer = styled.div`
  font-size: var(--type-size-xs);
  span {
    font-size: var(--type-size-xs);
    margin-bottom: 12px;
    display: block;
  }
`;

const DemoWrapper = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        border: "2px dashed var(--color-muted)",
        outline: "var(--space-2) solid var(--color-surface)",
        backgroundColor: "var(--color-surface)",
        padding: "var(--space-4) var(--space-4)",
        marginBottom: "var(--space-5)",
        borderRadius: "var(--space-3)",
        textAlign: "center",
        minHeight: "200px",
      }}
    >
      {children}
    </div>
  );
};
