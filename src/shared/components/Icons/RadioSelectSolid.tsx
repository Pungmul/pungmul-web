import * as React from "react";

interface RadioSelectSolidProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

function RadioSelectSolid({
  title,
  titleId,
  ...props
}: RadioSelectSolidProps, svgRef: React.Ref<SVGSVGElement>) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    stroke: "#A4A6AA",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "6",
    fill: "#A4A6AA"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, RadioSelectSolidProps>(RadioSelectSolid);
export default ForwardRef;