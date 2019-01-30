
module.exports = {
    dest: 'public',
    description: 'Lide Project Documentation',
    base: '/documentation/',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Architecture', link: '/architecture/' },
            { text: 'Front End', link: '/frontend/' },
        ],
        sidebar: [
            '/',
            '/installation/',
            '/architecture/',
            '/frontend/',
            '/authentification/',
            '/websocket/',
            '/cypress/'
        ],
    }
}