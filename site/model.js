
export default function () {

    var model = {

        mainNavbar: {
            brand: {
                href: '/',
                image: '/giotto-banner.svg'
            },
            theme: 'navbar-dark bg-inverse',
            items: [
                {
                    href: '/examples',
                    title: 'examples',
                    'class': 'float-xs-right'
                }
            ]
        }
    };

    return model;
}
