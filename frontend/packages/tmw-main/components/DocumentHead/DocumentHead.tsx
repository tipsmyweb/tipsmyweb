import * as React from 'react';
import Head from 'next/head';

interface TagProps {
    title: string;
    description?: string;
}

export const DocumentHead: React.FunctionComponent<TagProps> = ({ title, description }) => (
    <Head>
        <title>{`TipsMyWeb | ${title}`}</title>
        {description && <meta name="description" content={description} />}
    </Head>
);
