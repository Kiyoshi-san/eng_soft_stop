const baseUrl = 'https://es3-stop-prod.herokuapp.com';

export default {
    backoffice: `${baseUrl}/backoffice/info`,
    category: {
        category: `${baseUrl}/category`,
        categories: `${baseUrl}/categories`
    },
    auth: {
        login: `${baseUrl}/auth/login`,
        signup: `${baseUrl}/auth/signup`
    },
    inventory: `${baseUrl}/inventory`,
    hint: `${baseUrl}/hint`,
    item: {
        item: `${baseUrl}/item`,
        items: `${baseUrl}/items`,
        buy: `${baseUrl}/itemPurchase`
    },
    match: {
        match: `${baseUrl}/match`,
        matches: `${baseUrl}/matches`,
        start: `${baseUrl}/match/start`,
        end: `${baseUrl}/match/end`,
        result: `${baseUrl}/matchResult`
    },
    answer: {
        answer: `${baseUrl}/answer`,
        answers: `${baseUrl}/answers`,
        validation: `${baseUrl}/validation`
    },
    league: {
        league: `${baseUrl}/league`,
        leagues: `${baseUrl}/leagues`,
        image: `${baseUrl}/league/image`
    },
    cash: `${baseUrl}/cash`,
    firebase: {
        type: "service_account",
        databaseURL: "https://projetojogostop.firebaseio.com/",
        projectId: "projetojogostop",
        privateKeyId: "60bdf42863b3613f215c4b8c5a25884a248ff543",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkzNRjZDNbH8t2\nk9l0nWju3ey4ISOAKvvk787UcwwnqCB22X0yg36bkZVojgtVKWyAEd+MG6x+0rBY\n+pExoBi/OZHe5piZjYXvzjW9F2KX1psf72/b6bEuEnT3JEgnoo8DoujEByNEAneB\nx4R+g9oYUzBnLxnqWO3yaemhe0pJwGgUopEHP/xMVpvnl2aPxmWnnKu2Kv6wQR/s\nePm6e+zu4+JGTm3sWecFh0Ky4YbJF8V06oxuPZ9N6Cpz+54WrNuZl4xCxxR3hHnt\ny+/OuKGfMN3UPPn7vL+yiG4IxOSNGL+ajXB3l3yWKn5A+L+PdDm46hTl9JoFz/CT\n4ReLGNuNAgMBAAECggEAK48nfEiuUlHqTYf2ZXI2cQuFLsT4WkVUsZBKQz4n+UDT\n9WyQnlZUe0+rLz2jwLHjOzqr4aO/ImIAOuBxVg5Rx84xDEvAj7NW5YHPz1EtbxTn\ncZwHIsoJ9miDJi4dIpabPaj9QZzORPtnPyj5+5AkrG7iDzLzbx9BJd6uIRU03ndL\n53RlCrz3QT9LPdz6bdIiUMkxIgT1TaypRlUfrKE8aB9lp6Y3UFyH+j3ncTxuWHat\nkyt8du5r9M2r9HIZY3irRMbEPGi1FQS2cQlUBYwQhEVXvfepBjz1aljC/hP5XKcr\nTFy5Hm/MpKEIFVWytUuEVKvT9F7tF5rZLptP8VGbDQKBgQD5eKmnOKL+8U2C+iJt\nAwglEm6LLoUrBk7Rai8H+ZbO1twKVPPwOJAVNqR7Pk/17qt2Y2XrBl76nk39pOTB\nagPIUvzKEeeyC8pFuVsoqjUt/XadVoTPFXNmBKJTFgnI31wHeqNjh47jJQrzAk7D\nnbv+W5ahFKSTaY+Yrt1B08WWGwKBgQDqya4DaRdbkZn71IX6X+Z8GzuWoC9kR8+S\nN7gaoUIqMSX9GXfkysq8ZGvyYCfy82SIJuV2FY4IBz2/XWY6Y0msTv7dSo/eOwW9\nqI4jOpa8sEcLYoEuH3hIEZyKyzGhUYT+eBlgCAAANN6HcQTgfdnuAj6SsVkwENrd\n7X/KtKWPdwKBgA575/WyfxwoLGTnWupTW7yzRkHEcKzfz+GutY5T+mKF7P6YkhUn\nY44nvwL8yi2wLrpP6RHtK8SHPmX0led43UFbOBwPUBFxR8wmh9ljkHTcG2/lHw7a\n4vlQWZBTXjwQY8p3X1ce/rfHZcxYHPSUit6ouKUfirKYVWL6/BOfVQBzAoGAEkDB\npYQ7C6RjKz/XdqKUAZwAYvJrHMm0anKofnGA+lS91lJvjrrxTfokpkAxeuLPMwKL\nHkYIt7kQZNs3Al0Lsjil+cA9NRKznI4JFtYMN/kgXNM4pcROjpPH7sZjQl5bD4l4\nt42HqnxxvGfd8DH4ildkU/UzsNfunAhFwhWPNXsCgYEA76HNqqG56wuKQ/ZSacPK\ng/R30SadgKLlzE7HgGFhj+vlI1B55FmeF+fWaKIKgzobCuFjTLb0zQun+j5IhqlF\n45PhG7KbJsP0MfwZAq/BFxGZ5iTaP7Ipco2fKj8DJWJYl6+2Ax8amM4ixFA2Gpkb\nPrOIK0UtLkinh66phb2idW8=\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-yaqj5@projetojogostop.iam.gserviceaccount.com",
        clientId: "114200961043632223583",
        authUri: "https://accounts.google.com/o/oauth2/auth",
        tokenUri: "https://oauth2.googleapis.com/token",
        authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
        clientX509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yaqj5%40projetojogostop.iam.gserviceaccount.com"
    }
};