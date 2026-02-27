// Centralized API helper for KaamConnect frontend
(function () {

    const BASE_URL = 'http://localhost:8080';

    function getToken() {
        return localStorage.getItem('token');
    }

    function setToken(token) {
        if (token) {
            localStorage.setItem('token', token);
        }
    }

    function clearToken() {
        localStorage.removeItem('token');
    }

    function isAuthPage(pathname) {
        return pathname.endsWith('/pages/login.html') ||
               pathname.endsWith('/pages/register.html');
    }

    function redirectToLogin() {
        const pathname = window.location.pathname;

        if (isAuthPage(pathname)) return;

        const loginPath =
            pathname.includes('/pages/')
                ? 'login.html'
                : 'pages/login.html';

        window.location.href = loginPath;
    }

    function toQueryString(params = {}) {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, value);
            }
        });

        const query = searchParams.toString();
        return query ? `?${query}` : '';
    }

    async function request(path, options = {}) {

        const token = getToken();

        const headers = {
            ...(options.headers || {})
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (
            options.body !== undefined &&
            options.body !== null &&
            !(options.body instanceof FormData)
        ) {
            headers['Content-Type'] =
                headers['Content-Type'] || 'application/json';
        }

        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
            body:
                options.body instanceof FormData
                    ? options.body
                    : options.body !== undefined
                        ? JSON.stringify(options.body)
                        : undefined
        });

        const contentType = response.headers.get('content-type') || '';

        let payload;
        try {
            payload = contentType.includes('application/json')
                ? await response.json()
                : await response.text();
        } catch {
            payload = null;
        }

        // ===== 401 Unauthorized Handling =====
        if (response.status === 401) {
            clearToken();
            redirectToLogin();

            throw new Error(
                payload?.message ||
                'Unauthorized. Please login again.'
            );
        }

        // ===== Proper Error Handling =====
        if (!response.ok) {

            let message = `Request failed with status ${response.status}`;

            if (typeof payload === "object" && payload !== null) {
                message = payload.message || payload.error || message;
            } else if (typeof payload === "string") {
                message = payload;
            }

            const error = new Error(message);
            error.status = response.status;
            error.payload = payload || {};

            console.error("API ERROR:", error);

            throw error;
        }

        return payload;
    }

    async function get(path, params) {
        return request(`${path}${toQueryString(params)}`, {
            method: 'GET'
        });
    }

    async function post(path, body) {
        return request(path, {
            method: 'POST',
            body
        });
    }

    async function put(path, body) {
        return request(path, {
            method: 'PUT',
            body
        });
    }

    async function del(path) {
        return request(path, {
            method: 'DELETE'
        });
    }

    window.Api = {
        BASE_URL,
        getToken,
        setToken,
        clearToken,
        request,
        get,
        post,
        put,
        delete: del,
        toQueryString
    };

})();