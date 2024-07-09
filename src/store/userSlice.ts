import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface CounterState {
    email: string
}

// Define the initial state using that type
const initialState: CounterState = {
    email: "",
}

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        login: (state, action) => {
            console.log(state);
            state.email = action.payload;
        },
        logout: (state) => {
            state.email = ""
        },
    },
})

export const { login, logout } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default userSlice.reducer