import { RadarChart } from "react-native-gifted-charts";
import { height } from "@/app/_layout";
import { User, LearningStyle } from "@/contexts/UserContext";
import Svg, { Text as SvgText, TextAnchor, AlignmentBaseline, Rect, G } from "react-native-svg";
import { View, Text } from "./Themed";
import {StyleSheet } from "react-native";
import { useState } from "react";
import DimensionInfo from "@/components/DimensionInfo";
type Props = {
  user: User | null;
};

//used for static labels
export type Label =
  | "Verbal"
  | "Global"
  | "Reflective"
  | "Sensing"
  | "Visual"
  | "Sequential"
  | "Active"
  | "Intuitive";

const figmaLabels: Array<Label> = [
  "Verbal",
  "Global",
  "Reflective",
  "Sensing",
  "Visual",
  "Sequential",
  "Active",
  "Intuitive",
];

const maxValue = 12;
const chartSize = height * 0.27;
const labelsContainer = chartSize * 1.5;
const center = labelsContainer / 2;
const radius = center * 0.8;
const labelsPositionXOffset = [-2, 13, 0, -15, 2, -12, 0, 4];
const labelsPositionYOffset = [8, 19, 22, 19, 8, 0, -11, 0];


export default function LearningStyleComponent({ user }: Props) {


  const [dimensionInfoVisible, setdimensionInfoVisible] =
    useState<boolean>(false);
  const [dimensionIndex, setDimensionIndex] = useState<number>(-1);
  const dataArray = getData(user?.learning_style);
  const noOfSections = 6;
  const angleStep = 360 / 8;

  const hideDimensionInfo = () => setdimensionInfoVisible(false);
 
  const showDimensionInfo = (index: number) => {
    setDimensionIndex(index);
    setdimensionInfoVisible(true);
  };

  if (dimensionInfoVisible) {
    return (
      <DimensionInfo
        score={dataArray[dimensionIndex]}
        dimension={figmaLabels[dimensionIndex]}
        goBack={hideDimensionInfo}
      />
    );
  }



  return (
    <View>
      
      <Text style={styles.lsHeading}>Your Learning Style</Text>
      <View style={{ paddingTop: height * 0.047 }}>
        <RadarChart
          noOfSections={noOfSections}
          hideAsterLines
          labels={figmaLabels}
          hideLabels
          data={dataArray}
          gridConfig={gridConfig}
          maxValue={maxValue}
          chartSize={chartSize}
          polygonConfig={polygonConfig}
        />
      </View>

      <View style={{ position: "absolute", width: "100%", alignItems: "center", }}>

        <Svg width={labelsContainer} height={labelsContainer}>
          {figmaLabels.map((category, index) => {
            const angle = index * angleStep;

            // Offsets for label position
            const labelXOffset = labelsPositionXOffset[index];
            const labelYOffset = labelsPositionYOffset[index];

            let { x, y } = polarToCartesian(angle, maxValue); 
            x += labelXOffset;
            y += labelYOffset;

            const text = `${category} (${dataArray[index]})`;
            //rectangle dimensions and (x, y) coordinates calculation
            const rectWidth = estimateTextWidth(text, labelConfig.fontSize) + 8;
            const rectHeight = height * 0.029;
            const rectX = x - rectWidth / 2;
            const rectY = y - rectHeight / 2;

            return (
              <G
                key={`label-${index}`}
                onPress={() => showDimensionInfo(index)}
              >
                <Rect
                  width={rectWidth}
                  height={rectHeight}
                  x={rectX}
                  y={rectY}
                  rx={9}
                  fill="#EBD7C9"
                />
                <SvgText
                  x={x}
                  y={y}
                  fontSize={labelConfig.fontSize}
                  fontFamily={labelConfig.fontFamily}
                  fill={labelConfig.stroke}
                  textAnchor={
                    (labelConfig.textAnchor as TextAnchor) ?? "middle"
                  }
                  alignmentBaseline={
                    (labelConfig.alignmentBaseline as AlignmentBaseline) ??
                    "middle"
                  }
                >
                  {text}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lsHeading: {
    fontFamily: "Inter_600SemiBold",
    fontSize: height * 0.02447,
    color: "#333F50",
    textAlign: "center",
  },
});


const gridConfig = {
  stroke: "#333F50",
  strokeWidth: 2,
  opacity: 0,
  gradientOpacity: 0,
};

const labelConfig = {
  fontSize: 0.012 * height,
  fontFamily: "Poppins_600SemiBold",
  stroke: "#333F50",
  textAnchor: "middle",
  alignmentBaseline: "middle",
};


const polygonConfig = {
  stroke: "#F4A261",
  strokeWidth: height * 0.00489,
  fill: "#F4A261",
  gradientColor: "#F4A261",
  showGradient: true,
  gradientOpacity: 0.4,
};

const getData = (learning_style: LearningStyle | undefined) => {
  const newLS = {
    ...learning_style,
    [Symbol.iterator]: function* () {
      yield this.dim1;
      yield this.dim2;
      yield this.dim3;
      yield this.dim4;
    },
  };
  let dataArray: Array<number> = Array(8);

  let i = 0;
  let indices = [2, 3, 0, 1];
  for (let dim of newLS) {
    let j = indices[i] + 4;

    if (dim?.name === figmaLabels[indices[i]]) {
      dataArray[indices[i]] = dim.score;
      dataArray[j] = 0;
    } else if (dim) {
      dataArray[j] = dim.score;
      dataArray[indices[i]] = 0;
    }
    i++;
  }

  return dataArray;
};


const polarToCartesian = (angle: number, value: number) => {
  const radians = (Math.PI / 180) * angle;
  return {
    x: center + radius * (value / maxValue) * Math.cos(radians),
    y: center - radius * (value / maxValue) * Math.sin(radians),
  };
};

const estimateTextWidth = (text: string, fontSize: number) =>
  text.length * (fontSize * 0.6);
