import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PrimeReactProvider } from 'primereact/api';
import CrazyLayout from '@/components/CrazyLayout';
import 'primeicons/primeicons.css';
import '@/themes/index.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import '@rainbow-me/rainbowkit/styles.css';
require('@solana/wallet-adapter-react-ui/styles.css');
import '../themes/cus-pr.css';
import localFont from 'next/font/local';
import { IS_TEST } from '@/constants/env';
import { SessionClientProvider } from '@/providers/index';

const helvetica = localFont({ src: '../../public/fonts/Helvetica.ttf' });
type Props = {
    children: ReactNode;
};
export async function generateMetadata(): Promise<Metadata> {
    return {
        metadataBase: new URL(IS_TEST ? 'https://test.crazy.meme' : 'https://crazy.meme'),
        title: 'CrazyMeMe | The fairest meme launch platform',
        description: 'The fairest meme launch platform',
        keywords: 'Crazy.MeMe',
        openGraph: {
            title: 'Crazy.MeMe',
            description: 'The fairest meme launch platform',
            locale: 'en-US',
            images: [
                {
                    url: '/images/common/CrazyMeMe.png',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Crazy.MeMe',
            description: 'The fairest meme launch platform',
            images: ['/images/common/CrazyMeMe.png'],
            creator: '@crazymeme',
        },
    };
}
export default function RootLayout({ children }: Props) {
    console.log('IS_TEST', IS_TEST, 'current env', IS_TEST ? 'test' : 'prod');

    return (
        <html lang="en">
            <body className={`${helvetica.className} bg-[#181A20]`}>
                <SessionClientProvider>
                    <PrimeReactProvider>
                        <CrazyLayout>{children}</CrazyLayout>
                    </PrimeReactProvider>
                </SessionClientProvider>
            </body>
        </html>
    );
}
