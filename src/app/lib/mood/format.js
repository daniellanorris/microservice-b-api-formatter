const baseURL = 
"https://router.huggingface.co";

export function format(data){

    const {
        endpoint,
        method,
        language,
        parameters = []
    } = data;


    const request = buildRequest(
        endpoint,
        method,
        parameters
    );


    let formatted;


    switch(language){

        case "http":
            formatted = formatHTTP(request);
            break;


        case "curl":
            formatted = formatCurl(request);
            break;


        case "python":
            formatted = formatPython(request);
            break;


        case "javascript":
            formatted = formatJavascript(request);
            break;


        default:
            throw new Error(
                `Unsupported language: ${language}`
            );
    }


    return {
        formatted,
        request
    };
}

function buildRequest(endpoint, method, parameters){


    const body = {};


    parameters.forEach(
        ({key, value, type}) => {


            if(type === "body"){

                body[key] = value;

            }

        }
    );


    return {

        method,

        endpoint,

        url: `${baseURL}${endpoint}`,

        body,

        baseURL,

        headers:{
            "Content-Type":
            "application/json"
        }

    };

}

export function formatCurl(request){

    const {
        method,
        endpoint,
        body,
        headers,
        baseURL
    } = request;


    let result =
    `curl -X ${method} "${baseURL}${endpoint}"`;


    Object.entries(headers).forEach(
        ([key,value]) => {

            result +=
            ` \\\n  -H "${key}: ${value}"`;

        }
    );


    if(Object.keys(body).length > 0){

        result +=
        ` \\\n  -d '${JSON.stringify(body)}'`;

    }


    return result;

}

export function formatHTTP(request){

    const {
        method,
        endpoint,
        body,
        headers,
        baseURL
    } = request;


    let result =
    `${method} ${baseURL}${endpoint} HTTP/1.1`;


    Object.entries(headers).forEach(
        ([key,value]) => {

            result +=
            `\n${key}: ${value}`;

        }
    );


    if(Object.keys(body).length > 0){

        result +=
        `\n\n${JSON.stringify(body, null, 2)}`;

    }


    return result;

}

export function formatPython(request){

    const {
        method,
        endpoint,
        body,
        headers,
        baseURL
    } = request;


    return `
import requests


url = "${baseURL}${endpoint}"


headers = ${JSON.stringify(headers, null, 4)}


data = ${JSON.stringify(body, null, 4)}


response = requests.request(
    "${method}",
    url,
    headers=headers,
    json=data
)


print(response.json())
`;

}

export function formatJavascript(request){

    const {
        method,
        endpoint,
        body,
        headers,
        baseURL
    } = request;


    return `
const response = await fetch(
    "${baseURL}${endpoint}",
    {
        method: "${method}",

        headers: ${JSON.stringify(headers, null, 4)},

        body: JSON.stringify(
            ${JSON.stringify(body, null, 4)}
        )
    }
);


const data = await response.json();


console.log(data);
`;

}
