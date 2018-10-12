import config from 'react-global-configuration';

const baseUrl = 'https://es3-stop-prod.herokuapp.com/';

const objConfig  = {
    baseUrl: baseUrl,
    corsUrl: 'https://cors-anywhere.herokuapp.com/',
    backOffice: {
        catogory: `${baseUrl}/catogory`,
        answer: `${baseUrl}/answer`
    },
    login: {
        validate: `${baseUrl}/auth/login`
    }
};

export default function configuration() {
    config.set(objConfig);
}