import "@pThunder/app/globals.css";


export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className={`w-full h-full`}
        >
            {children}
        </div>
    );
}
