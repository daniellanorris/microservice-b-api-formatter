# Movie Request Formatter Microservice

Formats API requests sent to the microservice endpoint(s) into HTTP or cURL syntax given an endpoint, method, and parameters. 

---

## How to REQUEST data from the microservice

Send a `POST` request to `/api/format` with a JSON body containing the following fields:

| Field        | Type     | Required | Description                                      |
|--------------|----------|----------|--------------------------------------------------|
| `endpoint`   | string   | yes      | TMDB API endpoint path (e.g. `/movie/{movie_id}`)|
| `method`     | string   | yes      | HTTP method (`GET`, `POST`, etc.)                |
| `language`   | string   | yes      | Output format: `"http"` or `"curl"`              |
| `parameters` | array    | no       | List of parameter objects (see below)            |

Each object in `parameters` has:

| Field   | Type   | Description                                      |
|---------|--------|--------------------------------------------------|
| `key`   | string | Parameter name                                   |
| `value` | string | Parameter value                                  |
| `type`  | string | Either`"query"`, or `"body"`                     |

### Example request (JavaScript)

```js
const response = await fetch("/api/format", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        endpoint: "/movie/550",
        method: "GET",
        language: "curl",
        parameters: [
            { key: "language", value: "en-US", type: "query" }
        ]
    })
});

const data = await response.json();
console.log(data.result.formatted);
```

---

## How to RECEIVE data from the microservice

The microservice responds with a JSON object containing:

| Field            | Type   | Description                                      |
|------------------|--------|--------------------------------------------------|
| `result.formatted` | string | The formatted HTTP or cURL request string      |
| `result.request`   | object | The parsed request object (method, endpoint, body, baseURL) |

### Example response

```json
{
  "result": {
    "formatted": "curl -X GET \"https://api.themoviedb.org/3/movie/550?language=en-US\"",
    "request": {
      "method": "GET",
      "endpoint": "/movie/550?language=en-US",
      "body": {},
      "baseURL": "https://api.themoviedb.org/3"
    }
  }
}
```

### Error response

If the request fails, the microservice returns:

```json
{
  "error": "Failed to format request",
  "message": "<error details>"
}
```

---

## UML Sequence Diagram
(Used mermaid to generate the diagram as an FYI)

```mermaid
sequenceDiagram
    participant P as Requesting Program
    participant R as /api/format route
    participant F as format.js (lib)

    P->>R: POST /api/{program}/format { endpoint, method, language, parameters }
    R->>F: format(data)
    F->>F: buildRequest() - resolves query/body params
    F->>F: formatHTTP() or formatCurl() based on language
    F-->>R: { formatted, request }
    R-->>P: 200 { result: { formatted, request } }
```