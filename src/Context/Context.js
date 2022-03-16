import './Context.css'
import React from "react"

import { DURATION, useSnackbar } from 'baseui/snackbar';
import Check from 'baseui/icon/check';
import Alert from 'baseui/icon/alert';

export const AppContext = React.createContext();

export const ContextProvider = ({ children }) => {

    const { enqueue } = useSnackbar();

    const onSuccess = (info) => {
        enqueue(
            {
                message: info,
                startEnhancer: ({ size }) => <Check size={size} />
            },
            DURATION.short
        );
    };

    const onError = (error) => enqueue(
        {
            message: error,
            startEnhancer: ({ size }) => <Alert size={size} />
        },
        DURATION.long
    );

    return (
        <AppContext.Provider className="context-provider" value={{ onSuccess, onError }}>
            {children}
        </AppContext.Provider>
    );
}