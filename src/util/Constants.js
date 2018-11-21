const PUBLIC_LINKS = [
    {
        name: "Backoffice",
        link: "login-back",
        icon: "gear"
    }
];

const SU_LINKS = [
    {
        name: "Sair",
        link: "logout",
        icon: "logout"
    }
];

const LOGED_LINKS = [
    {
        name: "Perfil",
        link: "profile",
        icon: "user"
    },
    {
        name: "Sair",
        link: "logout",
        icon: "logout"
    }
];

const LOGED_LINKS_MATCH = [
    {
        name: "Perfil",
        link: "profile",
        icon: "user"
    },
    {
        name: "Sair da Sala",
        link: "home",
        icon: "logout"
    }
];

export default {
    PUBLIC_LINKS,
    SU_LINKS,
    LOGED_LINKS,
    LOGED_LINKS_MATCH
}