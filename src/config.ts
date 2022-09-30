let CUBA_APP_URL;
let CUBA_APP_URL_V2;

if(process.env.REACT_APP_ENV === 'development') {
    
    CUBA_APP_URL = "http://localhost:8080/app/rest/";
    CUBA_APP_URL_V2 = "http://localhost:8080/app/rest/v2";
}
if(process.env.REACT_APP_ENV === 'test'){
}

if(process.env.REACT_APP_ENV === "production"){
}

export { CUBA_APP_URL, CUBA_APP_URL_V2 };

export const DEFAULT_COUNT = 10; // Typical amount of entities to be loaded on browse screens
