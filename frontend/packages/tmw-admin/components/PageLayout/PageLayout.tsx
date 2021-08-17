import * as React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { SideNavMenu } from 'tmw-admin/components/SideNavMenu';
import { TopNavMenu } from 'tmw-admin/components/TopNavMenu';

import styles from './PageLayout.module.scss';

export const PageLayout: React.FunctionComponent = ({ children }) => {
    return (
        <>
            <TopNavMenu />
            <Container>
                <Grid padded>
                    <Grid.Row centered columns={1} only="mobile">
                        <SideNavMenu horizontalDisplay />
                    </Grid.Row>
                    <Grid.Row>
                        <div className={styles.contentContainer}>
                            <Grid padded className="tablet computer only">
                                <div>
                                    <SideNavMenu />
                                </div>
                            </Grid>
                            <div className={styles.mainContent}>{children}</div>
                        </div>
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
};
