// backend/src/main/resources/static/js/toast.js
(function () {
    const TOAST_CONTAINER_ID = 'kcToastContainer';
    const TOAST_STYLE_ID = 'kcToastStyles';

    function ensureToastStyles() {
        if (document.getElementById(TOAST_STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = TOAST_STYLE_ID;
        style.textContent = `
            #${TOAST_CONTAINER_ID} {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
                max-width: min(92vw, 360px);
            }

            .kc-toast {
                pointer-events: auto;
                padding: 12px 14px;
                border-radius: 10px;
                box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
                font-size: 0.95rem;
                font-weight: 600;
                line-height: 1.35;
                opacity: 0;
                transform: translateY(-8px);
                transition: opacity 0.2s ease, transform 0.2s ease;
                border: 1px solid transparent;
                background: #ffffff;
                color: #1a1a1a;
            }

            .kc-toast.show {
                opacity: 1;
                transform: translateY(0);
            }

            .kc-toast.success {
                background: #e8f8ee;
                color: #1f7a3e;
                border-color: #b8e6c8;
            }

            .kc-toast.error {
                background: #fdeaea;
                color: #b42318;
                border-color: #f3b3b3;
            }
        `;

        document.head.appendChild(style);
    }

    function ensureToastContainer() {
        let container = document.getElementById(TOAST_CONTAINER_ID);
        if (!container) {
            container = document.createElement('div');
            container.id = TOAST_CONTAINER_ID;
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(message, type = 'success') {
        if (!message) return;

        ensureToastStyles();
        const container = ensureToastContainer();

        const toast = document.createElement('div');
        toast.className = `kc-toast ${type === 'error' ? 'error' : 'success'}`;
        toast.textContent = message;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 220);
        }, 3000);
    }

    window.showToast = showToast;
})();