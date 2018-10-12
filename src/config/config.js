const configuration  = {
    baseUrl: 'https://es3-stop-prod.herokuapp.com/',
    corsUrl: 'https://cors-anywhere.herokuapp.com/',
    backOffice: {
        catogory: `${configuration.baseUrl}/catogory`,
        answer: `${configuration.baseUrl}/answer`
    }
};
 
export default configuration;