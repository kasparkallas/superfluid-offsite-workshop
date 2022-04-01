import { configureStore, Dispatch } from "@reduxjs/toolkit";
import {
    allRpcEndpoints,
    allSubgraphEndpoints,
    createApiWithReactHooks,
    initializeRpcApiSlice,
    initializeSubgraphApiSlice,
    initializeTransactionSlice,
} from "@superfluid-finance/sdk-redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const rpcApi = initializeRpcApiSlice(createApiWithReactHooks)
    .injectEndpoints(allRpcEndpoints);

export const subgraphApi = initializeSubgraphApiSlice(createApiWithReactHooks)
    .injectEndpoints(allSubgraphEndpoints);

export const transactionSlice = initializeTransactionSlice();

export const reduxStore = configureStore({
    reducer: {
        [rpcApi.reducerPath]: rpcApi.reducer,
        [subgraphApi.reducerPath]: subgraphApi.reducer,
        transactions: transactionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(rpcApi.middleware)
            .concat(subgraphApi.middleware),
});

export type AppStore = typeof reduxStore;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<Dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;