import { RadarChart } from "react-native-gifted-charts";
import { height, width, base_height, base_width } from "@/app/_layout";
import { User, LearningStyle } from "@/types";
import { View, Text } from "./Themed";
import {StyleSheet, Pressable, } from "react-native";
import { useState } from "react";
import DimensionInfo from "@/components/DimensionInfo";
import { Label } from "@/types";

type Props = {
  user: User | null;
};


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
const chartSize = width * 0.5354;
const labelsContainer = chartSize * 1.5;
const center = labelsContainer / 2;
const radius = center * 0.8;
const bw = base_width; //base figma screen width
const bh = base_height; //base figma screen height
const labelsPositionXOffset = [3, 16, 0, -15, 5, -19, 6, 9].map((a)=>a/bw*width);
const labelsPositionYOffset = [-18, 2, 1, 2, -18, -30, -42, -30].map((a)=>a/bw*width);


export default function LearningStyleComponent({ user }: Props) {


  const [dimensionInfoVisible, setdimensionInfoVisible] = useState<boolean>(false);
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
    <View style={{alignItems:"center"}}>
      
      <Text style={styles.lsHeading}>Your Learning Style</Text>
      <View style={styles.lsContainer}>
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
        {figmaLabels.map((category, index) => {

            const angle = index * angleStep;

            let { x, y } = polarToCartesian(angle, maxValue); 

            // Offsets for label position
            x += labelsPositionXOffset[index];
            y += labelsPositionYOffset[index];

            return (
              <Pressable
                key={`label-${index}`}
                style={{
                  position: "absolute",
                  backgroundColor: "#EBD7C9",
                  borderRadius: 10.5,
                  top: y,
                  left: x,
                  paddingVertical: width*0.0118,
                  paddingHorizontal: width*0.0218,
                  boxShadow: "0px 2px 5.5px -1px rgba(0, 0, 0, 0.15), 0px 7px 6.4px 1px rgba(244, 162, 97, 0.38) inset", 
                }}
                onPress={() => showDimensionInfo(index)}
                hitSlop={10}
              >
                <Text style={styles.labels}>{category} <Text style={[styles.labels, {fontFamily: "Poppins_400Regular"}]}>{`(${dataArray[index]})`}</Text></Text>
              </Pressable>
            );
          })}
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

  labels: {
    fontSize: 0.0237 * width,
    fontFamily: "Poppins_600SemiBold",
    color: "#333F50",
    textAlign: "center",
  },

  lsContainer: { 
    paddingTop: width*0.1116,
    paddingHorizontal: width*0.2257, 
    paddingBottom: width*0.05
  },
});


const gridConfig = {
  stroke: "#333F50",
  strokeWidth: 2,
  opacity: 0,
  gradientOpacity: 0,
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
    x: center + radius * (value / maxValue) * Math.cos(radians) - (bw/width),
    y: center - radius * (value / maxValue) * Math.sin(radians)- (bh/height),
  };
};
