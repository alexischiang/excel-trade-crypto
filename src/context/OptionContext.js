import React, { createContext, useReducer } from "react";

export const OptionContext = createContext({});

export const UPDATE_TEXT = 'UPDATE_TEXT'

// reducer
const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_TEXT:
            return {
                ...state,
                text: '2'
            }
        default:
            return state
    }
}


export const Option = (props) => {
    const [state, dispatch] = useReducer(reducer, {
        text: '1'
    })

    return (
        <OptionContext.Provider value={{ text: state.text, dispatch }}>
            {props.children}
        </OptionContext.Provider>
    );
}