import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';

enum RouteType {
    resources,
    tags,
    prices,
    types
}

const mapRouteType = (
    routeType: RouteType,
    id: string
) : string => {

    if (routeType === RouteType.resources) {
        return ADMIN_APP_ROUTES.RESOURCES_EDIT.replace(':id',id);
    }

    if (routeType === RouteType.tags) {
        return ADMIN_APP_ROUTES.TAGS_EDIT.replace(':id',id);
    }

    if (routeType === RouteType.prices) {
        return ''
    }

    if (routeType === RouteType.types) {
        return '';
    }

    return '';
}

export const getRouteFromRouteType = (
    type: string,
    id: string
) : string => {
    const routeTypeString: keyof typeof RouteType = type as keyof typeof RouteType;
    return mapRouteType(RouteType[routeTypeString], id);
}