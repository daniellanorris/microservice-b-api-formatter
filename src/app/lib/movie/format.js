const baseURL = "https://api.themoviedb.org/3";


export function format(data) {
    const {
        endpoint,
        method,
        language,
        parameters = [],
        bearerToken
    } = data;

    const request = buildRequest(
        endpoint,
        method,
        parameters,
        bearerToken
    );

    let formatted;

    switch (language) {
        case "http":
            formatted = formatHTTP(request);
            break;

        case "curl":
            formatted = formatCurl(request);
            break;

        default:
            throw new Error(`Unsupported language: ${language}`);
    }

    return {
        formatted,
        request
    };
}
function buildRequest(endpoint, method, parameters, bearerToken) {

    let formattedEndpoint = endpoint;

    const queryParameters = [];
    const body = {};

    parameters.forEach(({ key, value, type }) => {

        if (type === "path") {
            formattedEndpoint = formattedEndpoint.replace(
                `{${key}}`,
                encodeURIComponent(value)
            );
        }

        if (type === "query") {
            queryParameters.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            );
        }

        if (type === "body") {
            body[key] = value;
        }
    });

    if (queryParameters.length > 0) {
        formattedEndpoint += `?${queryParameters.join("&")}`;
    }

    return {
        method,
        endpoint: formattedEndpoint,
        body,
        baseURL,
        bearerToken
    };
}
export function formatHTTP(request) {
    const {
        method,
        endpoint,
        body,
        bearerToken
    } = request;

    let result =
        `${method} ${baseURL}${endpoint} HTTP/1.1\n` +
        `Authorization: Bearer ${bearerToken}\n` +
        `Accept: application/json`;

    if (Object.keys(body).length > 0) {
        result += `\n\n${JSON.stringify(body, null, 2)}`;
    }

    return result;
}
export function formatCurl(request) {
    const {
        method,
        endpoint,
        body,
        bearerToken
    } = request;

    let result =
        `curl -X ${method} "${baseURL}${endpoint}"` +
        ` \\\n  -H "Authorization: Bearer ${bearerToken}"` +
        ` \\\n  -H "accept: application/json"`;

    if (Object.keys(body).length > 0) {
        result +=
            ` \\\n  -H "Content-Type: application/json"`;

        result +=
            ` \\\n  -d '${JSON.stringify(body)}'`;
    }

    return result;
}