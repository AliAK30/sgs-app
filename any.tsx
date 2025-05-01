{OS==='ios'||OS==='android' ? 
                    (<PickerIOS
                    selectedValue={"Muhammad Ali Jinnah University"}
                    onValueChange={(itemValue, itemIndex)=>{console.log(value);onChange("Muhammad")}}
                    style={{backgroundColor: 'white'}}
                    itemStyle={{backgroundColor: 'white'}}
                  >
                    <Picker.Item label="Select your university" value="" />
                    {universitiesRef.current?.map((uni) => (
                      <Picker.Item
                        key={uni._id}
                        label={uni.name}
                        value={uni.name}
                      />
                    ))}
                  </PickerIOS>) : (
                    <Picker
                    selectedValue={"Muhammad Ali Jinnah University"}
                    onValueChange={(itemValue, itemIndex)=>{console.log(value);onChange("Muhammad")}}
                    style={{backgroundColor: 'white'}}
                  >
                    <Picker.Item label="Select your university" value="" />
                    {universitiesRef.current?.map((uni) => (
                      <Picker.Item
                        key={uni._id}
                        label={uni.name}
                        value={uni.name}
                      />
                    ))}
                  </Picker>
                  )}