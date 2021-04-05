import styled from "styled-components";

// export type Props = {
//   auto?: boolean,
//   column?: boolean,
//   reverse?: boolean,
//   justify?: JustifyValue,
//   align?: AlignValue,
//   wrap?: WrapValue,
//   className?: string,
//   center?: boolean,
//   onClick?: Function,
// };

const Flex = styled.div`
  display: flex;
  ${props => (props.auto ? "flex: 1 1 auto;" : "")};
  ${props => (props.onClick ? "cursor: pointer;" : "")};
  ${props => (props.wrap ? `flex-wrap: ${props.wrap};` : "")};
  ${props => (props.align ? `align-items: ${props.align};` : "")};
  ${props => (props.justify ? `justify-content: ${props.justify};` : "")};
  ${props => (props.center ? `justify-content: center; align-items: center;` : ``)};
  flex-direction: ${({ column, reverse }) => {
    const postFix = reverse ? "-reverse" : "";
    return column ? `column${postFix}` : `row${postFix}`;
  }};
`;

Flex.displayName = "Flex";

export default Flex;
