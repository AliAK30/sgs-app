import { RadarChart } from "react-native-gifted-charts";
import { height } from "@/app/_layout";
import { User, LearningStyle } from "@/contexts/UserContext";
import Svg, {
  Text as SvgText,
  TextAnchor,
  AlignmentBaseline,
} from "react-native-svg";
import { View, Text } from "./Themed";
import { StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import DimensionInfo from "@/components/DimensionInfo";

type Props = {
  user: User | null;
};

//used for static labels
export type Label = "Verbal"|"Global"|"Reflective"|"Sensing"|"Visual"|"Sequential"|"Active"|"Intuitive";

const figmaLabels : Array<Label> = [
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
const chartSize = height * 0.3304;
const labelsContainer = chartSize * 1.2;
const center = labelsContainer / 2;
const radius = center * 0.8;
const labelsPositionOffset = [0.4, 0.5, 0, 0.5, 0.4, 0.5, 0, 0.5];

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

//used for dynamic labels
/* const labels : Array<Label> = [
  "Reflective",
  "Sensing",
  "Verbal",
  "Global",
  "Active",
  "Intuitive",
  "Visual",
  "Sequential",

];

const getDynamicLabels = (learning_style: LearningStyle | undefined) => {
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
  let labelsArray: Array<string> = Array(8);
  let i = 0;
  let j = 4;
  for (let dim of newLS) {
    if (dim?.name === labels[i]) {
      dataArray[i] = dim.score;
      labelsArray[i] = dim.name;
      dataArray[j] = 0;
      labelsArray[j] = labels[j];
    } else if (dim) {
      dataArray[i] = dim.score;
      labelsArray[i] = dim.name;
      dataArray[j] = 0;
      labelsArray[j] = labels[i];
    }
    i++;
    j++;
  }

  return { labelsArray, dataArray };
}; */

const polarToCartesian = (angle: number, value: number) => {
  const radians = (Math.PI / 180) * angle;
  return {
    x: center + radius * (value / maxValue) * Math.cos(radians),
    y: center - radius * (value / maxValue) * Math.sin(radians),
  };
};

export default function LearningStyleComponent({ user }: Props) {
  const [dimensionInfoVisible, setdimensionInfoVisible] =
    useState<boolean>(false);
  const [dimensionIndex, setDimensionIndex] = useState<number>(-1);
  const dataArray = getData(user?.learning_style);
  const noOfSections = 6;
  const angleStep = 360 / 8;

  const hideDimensionInfo = () => setdimensionInfoVisible(false);
  //console.log(figmaLabels, dataArray)
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
      
      <View
        style={{
          width: "100%",
          height: "113%",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        
        <Svg width={labelsContainer} height={labelsContainer}>
          {figmaLabels.map((category, index) => {
            const angle = index * angleStep;

            const { x, y } = polarToCartesian(
              angle,
              maxValue + labelsPositionOffset[index]
            ); // Offset for label position

            return (
              
              <SvgText
                key={`label-${index}`}
                x={x}
                y={y}
                fontSize={labelConfig.fontSize}
                fontFamily={labelConfig.fontFamily}
                fill={labelConfig.stroke}
                textAnchor={(labelConfig.textAnchor as TextAnchor) ?? "middle"}
                alignmentBaseline={
                  (labelConfig.alignmentBaseline as AlignmentBaseline) ??
                  "middle"
                }
                onPress={()=>showDimensionInfo(index)}
              >
                
                {category}
                
              </SvgText>
            
              
            );
          })}
        </Svg>
        {/* <Svg style={{position:"absolute"}}>
              <SvgText
                key={0}
                x={242.9}
                y={134.9}
                fontSize={dataLabelConfig.fontSize}
                fontFamily={dataLabelConfig.fontFamily}
                fill={dataLabelConfig.stroke}
                textAnchor={(dataLabelConfig.textAnchor as TextAnchor) ?? "middle"}
                alignmentBaseline={
                  (dataLabelConfig.alignmentBaseline as AlignmentBaseline) ?? "middle"
                }
              >
                {7}
              </SvgText>
            </Svg> */}
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
    marginBottom: height * 0.018,
  },
  
});

//const gS= { gradientColor: "rgba(173, 216, 230, 0.0)",stroke: "#B0B0B0",strokeWidth: 2,  }; //gridSection

const gridConfig = {
  stroke: "#333F50",
  strokeWidth: 2,
  opacity: 0,
  gradientOpacity: 0,
  //fill: "rgba(0, 0, 0, 0.0)",

  // strokeDashArray?: number[];
  //gradientColor: "rgba(0, 0, 0, 0)"
  //showGradient: true,
  //gridSections: [gS, gS, gS, gS, gS, gS],
};

const labelConfig = {
  fontSize: 0.012 * height,
  fontFamily: "Poppins_400Regular",
  stroke: "#333F50",
  textAnchor: "middle",
  alignmentBaseline: "middle",
};

const dataLabelConfig = {
  fontSize: 0.0097 * height,
  fontFamily: "Poppins_600SemiBold",
  stroke: "#B0B0B0",
  textAnchor: "middle",
  alignmentBaseline: "middle",
};

const polygonConfig = {
  stroke: "#F4A261",
  strokeWidth: height * 0.00489,
  // strokeDashArray: number[];
  fill: "#F4A261",
  gradientColor: "#F4A261",
  showGradient: true,
  gradientOpacity: 0.4,
  //showDataValuesAsLabels: true,
};
