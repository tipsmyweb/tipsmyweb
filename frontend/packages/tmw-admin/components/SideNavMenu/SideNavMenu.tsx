import * as React from 'react';
import { useRouter } from 'next/router';
import { Icon, Menu, MenuProps } from 'semantic-ui-react';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
import styles from './SideNavMenu.module.scss';

interface SideNavMenuProps {
    horizontalDisplay?: boolean;
}
export const SideNavMenu: React.FunctionComponent<SideNavMenuProps> = ({
    horizontalDisplay = false,
}) => {
    const router = useRouter();
    const [subMenuSelected, setSubMenuSelected] = React.useState<string>('');

    const navItems = [
        {
            name: 'Overview',
            path: ADMIN_APP_ROUTES.MAIN,
            iconName: 'list alternate',
        },
        {
            name: 'Resources',
            path: ADMIN_APP_ROUTES.RESOURCES,
            iconName: 'world',
            subMenu: [
                {
                    name: 'List',
                    path: ADMIN_APP_ROUTES.RESOURCES,
                },
                {
                    name: 'Add',
                    path: ADMIN_APP_ROUTES.RESOURCES_ADD,
                },
            ],
        },
        {
            name: 'Tags',
            path: ADMIN_APP_ROUTES.TAGS,
            iconName: 'tags',
            subMenu: [
                {
                    name: 'List',
                    path: ADMIN_APP_ROUTES.TAGS,
                },
                {
                    name: 'Add',
                    path: ADMIN_APP_ROUTES.TAGS_ADD,
                },
            ],
        },
        {
            name: 'Prices',
            path: ADMIN_APP_ROUTES.PRICES,
            iconName: 'eur',
            subMenu: [
                {
                    name: 'List',
                    path: ADMIN_APP_ROUTES.PRICES,
                },
                {
                    name: 'Add',
                    path: ADMIN_APP_ROUTES.PRICES_ADD,
                },
            ],
        },
        {
            name: 'Resource Types',
            path: ADMIN_APP_ROUTES.RESOURCE_TYPES,
            iconName: 'file',
            subMenu: [
                {
                    name: 'List',
                    path: ADMIN_APP_ROUTES.RESOURCE_TYPES,
                },
                {
                    name: 'Add',
                    path: ADMIN_APP_ROUTES.RESOURCE_TYPES_ADD,
                },
            ],
        },
        {
            name: 'Import',
            path: ADMIN_APP_ROUTES.IMPORT,
            iconName: 'plus circle',
        },
        {
            name: 'Suggestions',
            path: ADMIN_APP_ROUTES.SUGGESTIONS,
            iconName: 'lightbulb',
        },
        {
            name: 'Messages',
            path: ADMIN_APP_ROUTES.CONTACT,
            iconName: 'comment',
        },
        {
            name: 'Statistics',
            path: ADMIN_APP_ROUTES.STATISTICS,
            iconName: 'chart bar',
            subMenu: [
                {
                    name: 'Visitors',
                    path: ADMIN_APP_ROUTES.STATISTICS_VISITORS,
                },
                {
                    name: 'Tags',
                    path: ADMIN_APP_ROUTES.STATISTICS_TAGS,
                },
            ],
        },
        {
            name: 'Logs',
            path: ADMIN_APP_ROUTES.LOGS,
            iconName: 'comment',
        },
    ];

    const horizontalDisplayProps: MenuProps = {
        icon: 'labeled',
        size: 'tiny',
        fluid: true,
        widths: navItems.length as SemanticWIDTHS,
        style: { minWidth: '400px' },
    };

    const verticalDisplayProps: MenuProps = {
        vertical: true,
    };

    return (
        <Menu {...(horizontalDisplay ? horizontalDisplayProps : verticalDisplayProps)}>
            {navItems.map(item => {
                const onClick =
                    !item.subMenu || horizontalDisplay
                        ? () => router.push(item.path)
                        : () => {
                              setSubMenuSelected(subMenuSelected != item.name ? item.name : '');
                          };

                const allPaths: string[] = !item.subMenu
                    ? [item.path]
                    : item.subMenu.map(subItem => subItem.path);

                return (
                    <Menu.Item
                        key={item.name}
                        className={`${allPaths.includes(router.pathname) ? styles.activeMenu : ''}`}
                    >
                        <Menu.Header
                            style={{ fontWeight: 400, cursor: 'pointer' }}
                            onClick={onClick}
                        >
                            <Icon
                                className={item.iconName}
                                style={{ float: 'left', marginRight: 10 }}
                            />
                            {item.name}
                            {item.subMenu && !horizontalDisplay ? (
                                <Icon
                                    className={`dropdown ${
                                        subMenuSelected == item.name
                                            ? ''
                                            : 'rotated counterclockwise'
                                    }`}
                                    style={{ float: 'right' }}
                                />
                            ) : null}
                        </Menu.Header>
                        {item.subMenu && !horizontalDisplay && subMenuSelected == item.name ? (
                            <Menu.Menu>
                                {item.subMenu.map(subItem => (
                                    <Menu.Item
                                        name={subItem.name}
                                        key={subItem.path}
                                        active={router.pathname === subItem.path}
                                        onClick={() => router.push(subItem.path)}
                                    >
                                        {subItem.name}
                                    </Menu.Item>
                                ))}
                            </Menu.Menu>
                        ) : null}
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};
