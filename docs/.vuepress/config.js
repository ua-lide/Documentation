
module.exports = {
    title: 'Documentation Projet LIDE',
    dest: 'public',
    description: 'Documentation du projet LIDE : Environnement de Développement Integré en ligne. https://gitlab.com/ua-lide/',
    base: '/documentation/',
    themeConfig: {
        repo: 'https://gitlab.com/ua-lide/documentation',
        nav: [
            { text: 'Accueil', link: '/' },
            { text: 'Architecture', link: '/architecture/' },
            { text: 'Front End', link: '/frontend/' },
        ],
        sidebar: [
            '/',
            '/installation/',
            '/deploiement/',
            '/architecture/',
            '/frontend/',
            '/authentification/',
            '/websocket/',
            '/cypress/',
            '/api/',
        ],
    }
}
