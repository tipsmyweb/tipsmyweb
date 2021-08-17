import * as React from 'react';
import { useRouter } from 'next/router';
import { Icon, Menu, MenuProps } from 'semantic-ui-react';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';

interface SideNavMenuProps {
    horizontalDisplay?: boolean;
}
export const SideNavMenu: React.FunctionComponent<SideNavMenuProps> = ({
    horizontalDisplay = false,
}) => {
    const router = useRouter();

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
                    !item.subMenu || horizontalDisplay ? () => router.push(item.path) : undefined;
                const allPaths: string[] = !item.subMenu
                    ? [item.path]
                    : item.subMenu.map(subItem => subItem.path);

                return (
                    <Menu.Item
                        name={item.name}
                        key={item.path}
                        active={allPaths.includes(router.pathname)}
                        onClick={onClick}
                    >
                        <Icon className={item.iconName} />
                        {item.name}
                        {item.subMenu && !horizontalDisplay ? (
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
