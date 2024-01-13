'use client';

import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            //staleTime: 1000 * 30, // 30seconds
            //cacheTime: 1000 * 30, //30 seconds
            refetchOnMount: false,
        },
        mutations: {
            retry: 0,
        },
    },
});


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}
