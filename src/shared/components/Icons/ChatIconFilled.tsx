import * as React from "react";
import { IconProps } from "../../types/type";


function ChatIconFilled({
  title,
  titleId,
  ...props
}: IconProps, svgRef: React.Ref<SVGSVGElement>) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M27.9907 16.0256C27.9908 16.0171 27.9908 16.0085 27.9908 16C27.9908 9.37258 22.6203 4 15.9954 4C9.37052 4 4 9.37258 4 16C4 22.6274 9.37052 28 15.9954 28C16.0039 28 16.0124 28 16.021 28H29.79C29.9822 28 30.0731 27.7436 29.93 27.6153C29.2333 26.9908 27.9908 25.6954 27.9908 24.4L27.9907 16.0256Z",
    className: "fill-grey-800"
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 16.5C12 17.3284 11.3284 18 10.5 18C9.67157 18 9 17.3284 9 16.5C9 15.6716 9.67157 15 10.5 15C11.3284 15 12 15.6716 12 16.5ZM17.5 16.5C17.5 17.3284 16.8284 18 16 18C15.1716 18 14.5 17.3284 14.5 16.5C14.5 15.6716 15.1716 15 16 15C16.8284 15 17.5 15.6716 17.5 16.5ZM21.5 18C22.3284 18 23 17.3284 23 16.5C23 15.6716 22.3284 15 21.5 15C20.6716 15 20 15.6716 20 16.5C20 17.3284 20.6716 18 21.5 18Z",
    className: "fill-background"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(ChatIconFilled);
export default React.memo(ForwardRef);
