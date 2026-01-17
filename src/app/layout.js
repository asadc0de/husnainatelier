import './globals.css';
import ClientProviders from '../components/ClientProviders';

export const metadata = {
    title: 'Husnain Atelier | Luxury Fashion',
    description: 'Discover exquisite bridal, festive, and modern fashion at Husnain Atelier.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.cdnfonts.com/css/olivera" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
            </head>
            <body suppressHydrationWarning={true}>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
