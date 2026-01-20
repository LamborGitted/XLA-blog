

export interface NavItem {

    text: string

    link: string

    children?: NavItem[]

    icon?: string
}

// const icon_path = "@/client/component/icon/"

export const NavBar: NavItem[] = [
    {
        text: '首页',
        link: '/',
    },
    {
        text: '归档',
        link: '/docs',
    },
    /*{
        text: '小工具',
        link:'/tools',
        children: [
            {
                text: '颜色选择器',
                link: '/tools/colors'
            }
        ],
    }*/
]
