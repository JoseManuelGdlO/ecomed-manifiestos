/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'clientes',
        title   : 'Clientes',
        subtitle: 'Gestión de clientes',
        type    : 'group',
        icon    : 'heroicons_outline:user-group',
        children: [
            {
                id   : 'clientes.lista',
                title: 'Lista de Clientes',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/clientes',
            },
            {
                id   : 'clientes.nuevo',
                title: 'Nuevo Cliente',
                type : 'basic',
                icon : 'heroicons_outline:user-plus',
                link : '/clientes/nuevo',
            },
            {
                id   : 'clientes.carga-masiva',
                title: 'Carga Masiva',
                type : 'basic',
                icon : 'heroicons_outline:document-arrow-up',
                link : '/clientes/carga-masiva',
            },
        ],
    },
    {
        id      : 'manifiestos',
        title   : 'Manifiestos',
        subtitle: 'Gestión de manifiestos',
        type    : 'group',
        icon    : 'heroicons_outline:document-text',
        children: [
            {
                id   : 'manifiestos.lista',
                title: 'Lista de Manifiestos',
                type : 'basic',
                icon : 'heroicons_outline:document-list',
                link : '/manifiestos',
            },
            {
                id   : 'manifiestos.nuevo',
                title: 'Nuevo Manifiesto',
                type : 'basic',
                icon : 'heroicons_outline:document-plus',
                link : '/manifiestos/nuevo',
            },
            {
                id   : 'manifiestos.estados',
                title: 'Estados',
                type : 'basic',
                icon : 'heroicons_outline:clock',
                link : '/manifiestos/estados',
            },
        ],
    },
    {
        id      : 'catalogos',
        title   : 'Catálogos',
        subtitle: 'Gestión de catálogos',
        type    : 'group',
        icon    : 'heroicons_outline:book-open',
        children: [
            {
                id   : 'catalogos.residuos',
                title: 'Residuos',
                type : 'basic',
                icon : 'heroicons_outline:trash',
                link : '/catalogos/residuos',
            },
            {
                id   : 'catalogos.transportistas',
                title: 'Transportistas',
                type : 'basic',
                icon : 'heroicons_outline:truck',
                link : '/catalogos/transportistas',
            },
            {
                id   : 'catalogos.destinos',
                title: 'Destinos',
                type : 'basic',
                icon : 'heroicons_outline:map-pin',
                link : '/catalogos/destinos',
            },
        ],
    },
    {
        id      : 'reportes',
        title   : 'Reportes',
        subtitle: 'Reportes y estadísticas',
        type    : 'group',
        icon    : 'heroicons_outline:chart-bar',
        children: [
            {
                id   : 'reportes.manifiestos',
                title: 'Reporte de Manifiestos',
                type : 'basic',
                icon : 'heroicons_outline:document-chart-bar',
                link : '/reportes/manifiestos',
            },
            {
                id   : 'reportes.clientes',
                title: 'Reporte de Clientes',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/reportes/clientes',
            },
            {
                id   : 'reportes.estadisticas',
                title: 'Estadísticas',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/reportes/estadisticas',
            },
        ],
    },
    {
        id      : 'usuarios',
        title   : 'Usuarios',
        subtitle: 'Gestión de usuarios',
        type    : 'group',
        icon    : 'heroicons_outline:user-circle',
        children: [
            {
                id   : 'usuarios.lista',
                title: 'Lista de Usuarios',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/usuarios',
            },
        ],
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'clientes.lista',
        title: 'Clientes',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/clientes',
    },
    {
        id   : 'manifiestos.lista',
        title: 'Manifiestos',
        type : 'basic',
        icon : 'heroicons_outline:document-text',
        link : '/manifiestos',
    },
    {
        id   : 'catalogos.residuos',
        title: 'Catálogos',
        type : 'basic',
        icon : 'heroicons_outline:book-open',
        link : '/catalogos/residuos',
    },
    {
        id   : 'reportes.manifiestos',
        title: 'Reportes',
        type : 'basic',
        icon : 'heroicons_outline:chart-bar',
        link : '/reportes/manifiestos',
    },
    {
        id   : 'usuarios.lista',
        title: 'Usuarios',
        type : 'basic',
        icon : 'heroicons_outline:user-circle',
        link : '/usuarios',
    },
];

export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'clientes.lista',
        title: 'Clientes',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/clientes',
    },
    {
        id   : 'manifiestos.lista',
        title: 'Manifiestos',
        type : 'basic',
        icon : 'heroicons_outline:document-text',
        link : '/manifiestos',
    },
    {
        id   : 'catalogos.residuos',
        title: 'Catálogos',
        type : 'basic',
        icon : 'heroicons_outline:book-open',
        link : '/catalogos/residuos',
    },
    {
        id   : 'reportes.manifiestos',
        title: 'Reportes',
        type : 'basic',
        icon : 'heroicons_outline:chart-bar',
        link : '/reportes/manifiestos',
    },
    {
        id   : 'usuarios.lista',
        title: 'Usuarios',
        type : 'basic',
        icon : 'heroicons_outline:user-circle',
        link : '/usuarios',
    },
];

export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'clientes.lista',
        title: 'Clientes',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/clientes',
    },
    {
        id   : 'manifiestos.lista',
        title: 'Manifiestos',
        type : 'basic',
        icon : 'heroicons_outline:document-text',
        link : '/manifiestos',
    },
    {
        id   : 'catalogos.residuos',
        title: 'Catálogos',
        type : 'basic',
        icon : 'heroicons_outline:book-open',
        link : '/catalogos/residuos',
    },
    {
        id   : 'reportes.manifiestos',
        title: 'Reportes',
        type : 'basic',
        icon : 'heroicons_outline:chart-bar',
        link : '/reportes/manifiestos',
    },
    {
        id   : 'usuarios.lista',
        title: 'Usuarios',
        type : 'basic',
        icon : 'heroicons_outline:user-circle',
        link : '/usuarios',
    },
];
