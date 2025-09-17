import space from "@/utils/space";
import styled from "styled-components";

export default function AuthProtoHeader({ children }) {
  return (
    <>{children ? <Header>{children}</Header> : <Header>Auth Home</Header>}</>
  );
}

const Header = styled.h3`
  max-width: ${space(70)}px;
  border-bottom: 1px solid var(--color-text);
  margin-left: auto;
  margin-right: auto;
`;
