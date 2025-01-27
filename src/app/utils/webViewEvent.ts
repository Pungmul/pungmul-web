export const sendWebViewEvent = (event: string, data: any) => {
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
            JSON.stringify({ event, data })
        );
    } else {
        console.warn('ReactNativeWebView is not available');
    }
};