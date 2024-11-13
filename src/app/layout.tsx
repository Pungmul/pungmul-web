import "@pThunder/app/globals.css";


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="mx-auto">
                {children}
            </body>
        </html>
    );
}
