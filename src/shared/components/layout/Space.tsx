export const Space :React.FC<{ h?: number, w?: number }> = ({ h, w }) => {
  return <div style={h ? { height: `${h}px` } : w ? { width: `${w}px` } : {}} />;
};