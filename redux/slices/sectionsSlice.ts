import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state

type countSetter = (section: number, question: number) => Promise<void>;

type Slice =  {
    setQuestionsCount: countSetter;
}

// Define the initial state using that type
const initialState = {} as Slice


export const counterSlice = createSlice({
  name: 'sections',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setFunction: (state, action: PayloadAction<countSetter>) => {
      state.setQuestionsCount = action.payload
    },
  },
})

export const { setFunction } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.setQuestionsCount

export default counterSlice.reducer