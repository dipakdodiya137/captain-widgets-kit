import { createSlice } from "@reduxjs/toolkit";
import { getInitialReduxState } from "../global/elements.js";

const initialState = {
    plugin_info: {},
    plugin_details: [],
    widget_info: getInitialReduxState('widget_info'),
    controller_section: getInitialReduxState('section_data'),
    widget_code: getInitialReduxState('widget_code'),
    captwiki_settings: {},
    toast_message: '',
};

const Slice = createSlice({
    name: 'Slice',
    initialState,
    reducers: {
        handlePluginInfo: (state, action) => {
            const data = action.payload;
            state.plugin_info = data;
        },
        setPluginDetails: (state, action) => {
            const data = action.payload;
            state.plugin_details = data;
        },
        handleWidgetInfo: (state, action) => {
            const data = action.payload;
            state.widget_info = data;
        },
        handleSectionData: (state, action) => {
            const data = action.payload;
            state.controller_section = data;
        },
        handleWidgetCode: (state, action) => {
            const data = action.payload;
            state.widget_code = data;
        },
        handleSettings: (state, action) => {
            const data = action.payload;
            state.captwiki_settings = data;
        },
        handleToastMessage: (state, action) => {
            const data = action.payload;
            state.toast_message = data;
        },
    },
});

export const { handlePluginInfo, setPluginDetails, handleWidgetInfo, handleSectionData, handleWidgetCode, handleSettings, handleToastMessage } = Slice.actions;
export default Slice.reducer;
