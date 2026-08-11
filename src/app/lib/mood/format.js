// communicates with external api (or just handles any formatting logic that needs
// to be handled), and is then called by the route handler

const baseURL = "https://router.huggingface.co";

export function format(data) {
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

    const formatted = formatByLanguage(
        language,
        request
    );

    return {
        formatted,
        request
    };
}

function formatByLanguage(language, request) {
    switch (language) {
        case "http":
            return formatHTTP(request);

        case "curl":
            return formatCurl(request);

        case "python":
            return formatPython(request);

        case "javascript":
            return formatJavascript(request);

        default:
            throw new Error(
                `Unsupported language: ${language}`
            );
    }
}

function buildRequest(endpoint, method, parameters) {
    const body = buildBody(parameters);

    return {
        method,
        endpoint,
        url: `${baseURL}${endpoint}`,
        body,
        baseURL,
        headers: {
            "Content-Type": "application/json"
        }
    };
}

function buildBody(parameters) {
    const body = {};

    parameters.forEach(
        ({ key, value, type }) => {
            if (type === "body") {
                body[key] = value;
            }
        }
    );

    return body;
}

export function formatCurl(request) {
    const {
        method,
        url,
        body,
        headers
    } = request;

    let formattedRequest =
        `curl -X ${method} "${url}"`;

    Object.entries(headers).forEach(
        ([key, value]) => {
            formattedRequest +=
                ` \\\n  -H "${key}: ${value}"`;
        }
    );

    if (Object.keys(body).length > 0) {
        formattedRequest +=
            ` \\\n  -d '${JSON.stringify(body)}'`;
    }

    return formattedRequest;
}

export function formatHTTP(request) {
    const {
        method,
        url,
        body,
        headers
    } = request;

    let formattedRequest =
        `${method} ${url} HTTP/1.1`;

    Object.entries(headers).forEach(
        ([key, value]) => {
            formattedRequest +=
                `\n${key}: ${value}`;
        }
    );

    if (Object.keys(body).length > 0) {
        formattedRequest +=
            `\n\n${JSON.stringify(body, null, 2)}`;
    }

    return formattedRequest;
}

export function formatPython(request) {
    const {
        method,
        url,
        body,
        headers
    } = request;

    return `
import requests

url = "${url}"

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

export function formatJavascript(request) {
    const {
        method,
        url,
        body,
        headers
    } = request;

    return `
const response = await fetch(
    "${url}",
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