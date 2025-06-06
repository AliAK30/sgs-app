import ContentLoader, { Rect, Circle } from "react-content-loader/native";


export default function SkeletonLoader({ w, h }: any)  {

    return (
  <ContentLoader
    speed={2}
    width={w}
    height={h}
    backgroundColor="#ffffff"
    foregroundColor="#ecebeb"
  >
    <Circle cx={w / 2.6} cy={h / 2} r={w / 7} />
    <Circle cx={w / 2.6} cy={h / 4} r={w / 7} />
    <Circle cx={w / 1.65} cy={h / 4} r={w / 7} />
    <Circle cx={w / 1.65} cy={h / 2} r={w / 7} />
    <Rect x={w / 5.4} y={h / 1.39} width={w * 0.6} height={h * 0.15} />
  </ContentLoader>);
};