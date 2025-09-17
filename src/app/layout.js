"use client";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import "@/styles/global.css";

import AuthProvider from "@/context/AuthContext";
import space from "@/utils/space";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";

export default function AuthPrototypeLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Wrapper>
          <AuthProvider>
            <DemoWrapper>{children}</DemoWrapper>
          </AuthProvider>
          <Footer />
        </Wrapper>
      </body>
    </html>
  );
}

const DemoWrapper = styled.div`
  position: relative;
  border: 2px dashed var(--color-muted);
  outline: ${space(2)}px solid var(--color-surface);
  background-color: var(--color-surface);
  padding: ${space(4)}px ${space(4)}px;
  margin-bottom: ${space(5)}px;
  border-radius: ${space(3)}px;
  text-align: center;
  min-height: ${space(50)}px;
`;

AuthPrototypeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const Footer = () => {
  return (
    <div style={{ fontSize: "var(--type-size-xs)" }}>
      <span
        style={{
          fontSize: "var(--type-size-xs)",
          marginBottom: "12px",
          display: "block",
        }}
      >
        *User accounts may be periodically cleared for maintenance purposes.
      </span>
      <span>
        This demo showcases a user authentication system built by Saravanan
        during his systematic React development journey.
      </span>{" "}
      <br />
      Source code available at{" "}
      <Link
        href="https://github.com/SaravananWD/user-auth"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </Link>
      .
    </div>
  );
};
