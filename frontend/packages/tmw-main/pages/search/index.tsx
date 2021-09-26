import { ajaxGet } from 'tmw-common/utils/ajax';
import { SearchPage, SearchPageProps } from 'tmw-main/components/SearchPage';
import { GetStaticProps } from 'next';
import { serializeMainTagsFromAPI } from 'tmw-main/utils/api-serialize';

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
    return ajaxGet('main/tags').then(res => ({
        props: {
            tagsFromCache: serializeMainTagsFromAPI(res.data || []),
        },
    }));
};

export default SearchPage;
