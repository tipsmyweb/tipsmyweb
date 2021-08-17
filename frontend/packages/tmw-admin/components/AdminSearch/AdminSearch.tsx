import * as React from 'react';
import { Container, Search, Header, SearchProps } from 'semantic-ui-react';
import { ajaxPost } from 'tmw-common/utils/ajax';
import { serializeGeneralAdminSearchFromAPI } from 'tmw-admin/utils/api-serialize';
import { GeneralAdminSearch } from 'tmw-admin/constants/app-types';
import { getRouteFromRouteType } from 'tmw-admin/utils/route-getter';

export const AdminSearch: React.FunctionComponent = () => {
    const [generalAdminSearch, setGeneralAdminSearch] = React.useState<
        Record<string, GeneralAdminSearch>
    >({});
    const [searchKey, setSearchKey] = React.useState<string>('');

    const fetchGeneralAdminSearch = async (): Promise<void> => {
        return ajaxPost('search/admin', {
            key: searchKey,
        }).then(res => {
            const adminSearch = serializeGeneralAdminSearchFromAPI(res.data);
            setGeneralAdminSearch(adminSearch);
        });
    };

    const onSearchKeyChange = (_: React.MouseEvent<HTMLElement>, data: SearchProps): void => {
        setSearchKey(data.value ?? '');
    };

    const handleResultSelect = (event: any, { result }: any) => {
        const route = getRouteFromRouteType(result.type, result.id);
        if (route) {
            window.location.href = route;
        }
    };

    React.useEffect(() => {
        if (searchKey && searchKey.length >= 3) {
            fetchGeneralAdminSearch();
        }
    }, [searchKey]);

    const categoryLayoutRenderer = ({ categoryContent, resultsContent }: any) => {
        if (!resultsContent) return <Container></Container>;
        return (
            <div>
                <Header as="h4" className="name" style={{ marginLeft: 10, marginTop: 10 }}>
                    {categoryContent}
                </Header>
                <Container className="results">{resultsContent}</Container>
            </div>
        );
    };

    const categoryRenderer = ({ name }: any) => <span>{name}</span>;

    const resultRenderer = ({ title }: any) => <p>{title}</p>;

    return (
        <Search
            placeholder="Search ..."
            value={searchKey}
            onSearchChange={onSearchKeyChange}
            onResultSelect={handleResultSelect}
            category
            categoryLayoutRenderer={categoryLayoutRenderer}
            categoryRenderer={categoryRenderer}
            resultRenderer={resultRenderer}
            results={generalAdminSearch}
        />
    );
};
