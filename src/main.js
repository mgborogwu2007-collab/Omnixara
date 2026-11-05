import "./style.css";

/* =========================================
   COMMAND CORE — APPLICATION ENGINE
   Version 2.0
========================================= */

const APP = {
    name: "COMMAND CORE",
    version: "2.0.0",
    status: "OPERATIONAL"
};

const modules = [
    { id: "dashboard", name: "Command Dashboard", icon: "◈", group: "CORE", description: "Central operations and system overview." },
    { id: "intelligence", name: "AI Intelligence", icon: "✧", group: "INTELLIGENCE", description: "Artificial intelligence workspace." },
    { id: "security", name: "Cybersecurity", icon: "⬡", group: "SECURITY", description: "Security operations and threat awareness." },
    { id: "finance", name: "Finance Systems", icon: "₦", group: "BUSINESS", description: "Financial planning and transaction tools." },
    { id: "business", name: "Business Command", icon: "▦", group: "BUSINESS", description: "Business management and operations." },
    { id: "communications", name: "Communications", icon: "⌁", group: "NETWORK", description: "Communication and collaboration centre." },
    { id: "marketplace", name: "Global Marketplace", icon: "◇", group: "NETWORK", description: "Marketplace and service ecosystem." },
    { id: "media", name: "Media Centre", icon: "▶", group: "CREATIVE", description: "Media, content and creative operations." },
    { id: "developer", name: "Developer Hub", icon: "⌘", group: "TECHNOLOGY", description: "Development and technical workspace." },
    { id: "research", name: "Research Lab", icon: "⌬", group: "TECHNOLOGY", description: "Research, analysis and experimentation." },
    { id: "network", name: "Global Network", icon: "◎", group: "NETWORK", description: "Global systems and connectivity." },
    { id: "administration", name: "Administration", icon: "⚙", group: "CONTROL", description: "Platform configuration and management." }
];

const state = {
    active: "dashboard",
    search: "",
    notifications: [],
    terminalOpen: false,
    commandHistory: []
};

const app = document.querySelector("#app");

if (!app) {
    throw new Error("COMMAND CORE: Application container not found.");
}

/* =========================================
   UTILITIES
========================================= */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function timeNow() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function notify(message) {
    state.notifications.unshift({
        message,
        time: timeNow()
    });

    state.notifications = state.notifications.slice(0, 8);

    const box = document.querySelector("#toast");
    if (!box) return;

    box.textContent = message;
    box.classList.add("show");

    clearTimeout(window.commandToastTimer);

    window.commandToastTimer = setTimeout(() => {
        box.classList.remove("show");
    }, 3000);
}

function getModule(id) {
    return modules.find(module => module.id === id);
}

/* =========================================
   APPLICATION SHELL
========================================= */

function render() {
    app.innerHTML = `
        <div class="command-layout">

            <aside class="sidebar" id="sidebar">

                <div class="brand-block">
                    <div class="brand-symbol">C</div>
                    <div>
                        <div class="brand-name">COMMAND CORE</div>
                        <div class="brand-caption">GLOBAL SYSTEMS</div>
                    </div>
                </div>

                <div class="sidebar-label">OPERATIONS</div>

                <nav class="navigation">
                    ${modules.map(module => `
                        <button
                            class="nav-item ${state.active === module.id ? "active" : ""}"
                            data-module="${module.id}">
                            <span class="nav-icon">${module.icon}</span>
                            <span>${module.name}</span>
                        </button>
                    `).join("")}
                </nav>

                <div class="sidebar-bottom">
                    <div class="system-status">
                        <span class="status-light"></span>
                        ALL SYSTEMS READY
                    </div>
                    <div class="version-label">
                        COMMAND CORE v${APP.version}
                    </div>
                </div>

            </aside>

            <main class="main-area">

                <header class="topbar">

                    <button class="menu-button" id="menuButton">
                        ☰
                    </button>

                    <div class="breadcrumb">
                        COMMAND / ${escapeHTML(
                            getModule(state.active)?.name.toUpperCase() || "DASHBOARD"
                        )}
                    </div>

                    <div class="topbar-actions">
                        <span class="live-indicator">● LIVE</span>
                        <button class="top-button" id="terminalButton">⌘ TERMINAL</button>
                        <button class="top-button" id="notificationButton">♢</button>
                    </div>

                </header>

                <section class="workspace">

                    <div class="page-heading">
                        <div>
                            <div class="eyebrow">COMMAND ENVIRONMENT / 2026</div>
                            <h1>${escapeHTML(getModule(state.active)?.name || "Dashboard")}</h1>
                            <p>${escapeHTML(getModule(state.active)?.description || "")}</p>
                        </div>

                        <div class="heading-status">
                            <span class="status-light"></span>
                            ${APP.status}
                        </div>
                    </div>

                    <div id="pageContent">
                        ${renderPage()}
                    </div>

                    <footer class="footer">
                        <span>COMMAND CORE SYSTEMS</span>
                        <span>SECURE OPERATIONS ENVIRONMENT</span>
                        <span>VERSION ${APP.version}</span>
                    </footer>

                </section>

            </main>

        </div>

        <div class="toast" id="toast"></div>

        <div class="terminal-overlay" id="terminalOverlay">
            <div class="terminal-window">

                <div class="terminal-header">
                    <span>COMMAND CORE TERMINAL</span>
                    <button id="closeTerminal">✕</button>
                </div>

                <div class="terminal-output" id="terminalOutput">
                    <p>COMMAND CORE TERMINAL v${APP.version}</p>
                    <p>System initialized successfully.</p>
                    <p>Type <strong>help</strong> to view available commands.</p>
                </div>

                <form id="terminalForm">
                    <span>CORE &gt;</span>
                    <input
                        id="terminalInput"
                        type="text"
                        placeholder="Enter command..."
                        autocomplete="off">
                </form>

            </div>
        </div>

        <div class="notification-panel" id="notificationPanel">
            <div class="panel-heading">
                <strong>SYSTEM NOTIFICATIONS</strong>
                <button id="closeNotifications">✕</button>
            </div>
            <div id="notificationList">
                ${renderNotifications()}
            </div>
        </div>
    `;

    bindEvents();
}

function renderNotifications() {
    if (!state.notifications.length) {
        return `<p class="empty-state">No new notifications.</p>`;
    }

    return state.notifications.map(item => `
        <div class="notification-item">
            <p>${escapeHTML(item.message)}</p>
            <small>${escapeHTML(item.time)}</small>
        </div>
    `).join("");
}

/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {
    return `
        <section class="welcome-panel">
            <div>
                <div class="eyebrow">CENTRAL OPERATIONS</div>
                <h2>One platform. Multiple systems.</h2>
                <p>
                    Welcome to your central technology command environment.
                    Access your departments, tools and operations from one place.
                </p>
                <button class="primary-button" data-action="explore">
                    EXPLORE SYSTEMS →
                </button>
            </div>

            <div class="core-emblem">C</div>
        </section>

        <section class="metrics-grid">

            <article class="metric-card">
                <span class="metric-icon">◈</span>
                <div class="metric-title">SYSTEM STATUS</div>
                <div class="metric-value">ONLINE</div>
                <div class="metric-note">Application initialized</div>
            </article>

            <article class="metric-card">
                <span class="metric-icon">⬡</span>
                <div class="metric-title">ACTIVE MODULES</div>
                <div class="metric-value">${modules.length}</div>
                <div class="metric-note">Available departments</div>
            </article>

            <article class="metric-card">
                <span class="metric-icon">⌘</span>
                <div class="metric-title">SYSTEM VERSION</div>
                <div class="metric-value">${APP.version}</div>
                <div class="metric-note">Current application engine</div>
            </article>

            <article class="metric-card">
                <span class="metric-icon">◷</span>
                <div class="metric-title">LOCAL TIME</div>
                <div class="metric-value" id="liveClock">${timeNow()}</div>
                <div class="metric-note">Device clock</div>
            </article>

        </section>

        <section class="content-grid">

            <div class="panel">
                <div class="panel-heading">
                    <strong>DEPARTMENT DIRECTORY</strong>
                    <span class="panel-tag">12 MODULES</span>
                </div>

                <div class="module-grid">
                    ${modules.filter(m => m.id !== "dashboard").map(module => `
                        <button class="module-card" data-module="${module.id}">
                            <span class="module-icon">${module.icon}</span>
                            <strong>${module.name}</strong>
                            <small>${module.group}</small>
                            <span class="module-arrow">↗</span>
                        </button>
                    `).join("")}
                </div>
            </div>

            <div class="panel activity-panel">
                <div class="panel-heading">
                    <strong>OPERATIONAL LOG</strong>
                    <span class="panel-tag">LOCAL</span>
                </div>

                <div class="activity-item">
                    <span class="activity-dot"></span>
                    <div>
                        <strong>Application initialized</strong>
                        <small>${timeNow()}</small>
                    </div>
                </div>

                <div class="activity-item">
                    <span class="activity-dot"></span>
                    <div>
                        <strong>Command environment loaded</strong>
                        <small>System startup</small>
                    </div>
                </div>

                <div class="activity-item">
                    <span class="activity-dot"></span>
                    <div>
                        <strong>Department directory ready</strong>
                        <small>${modules.length} modules registered</small>
                    </div>
                </div>

                <button class="secondary-button" data-action="terminal">
                    OPEN COMMAND TERMINAL →
                </button>
            </div>

        </section>
    `;
}

/* =========================================
   DEPARTMENT PAGES
========================================= */

function renderModule(module) {
    const features = {
        intelligence: [
            ["AI WORKSPACE", "Connect an AI provider to enable intelligent conversations."],
            ["LANGUAGE SYSTEM", "Prepare multilingual interaction tools."],
            ["CONTENT GENERATION", "Plan text, ideas and creative workflows."]
        ],
        security: [
            ["SECURITY CENTRE", "Organize security checks and defensive operations."],
            ["RISK AWARENESS", "Prepare a workspace for security assessments."],
            ["SYSTEM PROTECTION", "Security monitoring integration can be added here."]
        ],
        finance: [
            ["FINANCIAL OVERVIEW", "Prepare financial records and planning tools."],
            ["TRANSACTION CENTRE", "Payment provider integration will be required."],
            ["REPORTING", "Organize financial reports and summaries."]
        ],
        business: [
            ["BUSINESS MANAGEMENT", "Organize business activities and operations."],
            ["PROJECT CONTROL", "Plan and manage business projects."],
            ["PERFORMANCE", "Prepare business performance reports."]
        ],
        communications: [
            ["MESSAGING", "Prepare communication tools."],
            ["TEAM WORKSPACE", "Organize collaboration and team operations."],
            ["CONTACT DIRECTORY", "Plan a central contact management system."]
        ],
        marketplace: [
            ["SERVICE MARKET", "Prepare listings for products and services."],
            ["SELLER CENTRE", "Plan seller accounts and management."],
            ["ORDER MANAGEMENT", "Order processing requires backend integration."]
        ],
        media: [
            ["MEDIA LIBRARY", "Organize images, audio and video content."],
            ["CREATOR WORKSPACE", "Prepare tools for content creators."],
            ["PUBLISHING", "Plan a publishing and distribution workflow."]
        ],
        developer: [
            ["DEVELOPMENT CENTRE", "Organize software development projects."],
            ["CODE WORKSPACE", "Prepare a developer tools environment."],
            ["API CONTROL", "Connect external APIs through secure backend services."]
        ],
        research: [
            ["RESEARCH DESK", "Organize research projects and observations."],
            ["DATA ANALYSIS", "Prepare tools for data analysis."],
            ["KNOWLEDGE BASE", "Build a searchable research library."]
        ],
        network: [
            ["NETWORK OVERVIEW", "Prepare global connectivity tools."],
            ["INTEGRATION CENTRE", "Organize connected services."],
            ["NETWORK STATUS", "Live network monitoring requires connected services."]
        ],
        administration: [
            ["SYSTEM SETTINGS", "Manage application configuration."],
            ["USER MANAGEMENT", "User management requires authentication and a backend."],
            ["ACCESS CONTROL", "Prepare permission and role management."]
        ]
    };

    const items = features[module.id] || [];

    return `
        <div class="module-intro">
            <div class="eyebrow">${module.group} DEPARTMENT</div>
            <h2>${module.name}</h2>
            <p>${module.description}</p>
        </div>

        <div class="feature-grid">
            ${items.map((item, index) => `
                <article class="feature-card">
                    <div class="feature-number">0${index + 1}</div>
                    <h3>${item[0]}</h3>
                    <p>${item[1]}</p>
                    <span class="feature-status">FOUNDATION READY</span>
                </article>
            `).join("")}
        </div>

        <div class="panel module-notice">
            <strong>DEPARTMENT DEVELOPMENT STATUS</strong>
            <p>
                The ${module.name} workspace is registered.
                Its external services and advanced functions can be connected
                in the next development stages.
            </p>
            <button class="secondary-button" data-action="terminal">
                OPEN SYSTEM TERMINAL →
            </button>
        </div>
    `;
}

function renderPage() {
    if (state.active === "dashboard") {
        return renderDashboard();
    }

    const module = getModule(state.active);

    if (!module) {
        return `<div class="panel">Department not found.</div>`;
    }

    return renderModule(module);
}

/* =========================================
   NAVIGATION AND INTERACTIONS
========================================= */

function navigate(id) {
    if (!getModule(id)) return;

    state.active = id;

    render();

    document.querySelector("#sidebar")?.classList.remove("mobile-open");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindEvents() {
    document.querySelectorAll("[data-module]").forEach(button => {
        button.addEventListener("click", () => {
            navigate(button.dataset.module);
        });
    });

    document.querySelector("#menuButton")?.addEventListener("click", () => {
        document.querySelector("#sidebar")?.classList.toggle("mobile-open");
    });

    document.querySelector("#terminalButton")?.addEventListener("click", openTerminal);

    document.querySelector("#notificationButton")?.addEventListener("click", () => {
        document.querySelector("#notificationPanel")?.classList.toggle("visible");
    });

    document.querySelector("#closeNotifications")?.addEventListener("click", () => {
        document.querySelector("#notificationPanel")?.classList.remove("visible");
    });

    document.querySelector("#closeTerminal")?.addEventListener("click", closeTerminal);

    document.querySelectorAll('[data-action="terminal"]').forEach(button => {
        button.addEventListener("click", openTerminal);
    });

    document.querySelectorAll('[data-action="explore"]').forEach(button => {
        button.addEventListener("click", () => navigate("intelligence"));
    });

    document.querySelector("#terminalForm")?.addEventListener("submit", handleCommand);
}

/* =========================================
   COMMAND TERMINAL
========================================= */

function openTerminal() {
    const overlay = document.querySelector("#terminalOverlay");
    if (!overlay) return;

    overlay.classList.add("visible");

    setTimeout(() => {
        document.querySelector("#terminalInput")?.focus();
    }, 100);
}

function closeTerminal() {
    document.querySelector("#terminalOverlay")?.classList.remove("visible");
}

function terminalWrite(message, type = "") {
    const output = document.querySelector("#terminalOutput");
    if (!output) return;

    const line = document.createElement("p");
    line.className = type;
    line.textContent = message;

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function handleCommand(event) {
    event.preventDefault();

    const input = document.querySelector("#terminalInput");
    if (!input) return;

    const command = input.value.trim().toLowerCase();

    if (!command) return;

    state.commandHistory.push(command);

    terminalWrite(`CORE > ${command}`);

    input.value = "";

    const parts = command.split(" ");
    const action = parts[0];

    switch (action) {
        case "help":
            terminalWrite("AVAILABLE COMMANDS:");
            terminalWrite("help — Display available commands");
            terminalWrite("status — Display system status");
            terminalWrite("modules — List departments");
            terminalWrite("time — Display device time");
            terminalWrite("open dashboard — Open dashboard");
            terminalWrite("open intelligence — Open AI department");
            terminalWrite("open security — Open security department");
            terminalWrite("clear — Clear terminal");
            break;

        case "status":
            terminalWrite(`SYSTEM: ${APP.name}`);
            terminalWrite(`VERSION: ${APP.version}`);
            terminalWrite(`STATUS: ${APP.status}`);
            terminalWrite(`REGISTERED MODULES: ${modules.length}`);
            break;

        case "modules":
            modules.forEach(module => {
                terminalWrite(`${module.id} — ${module.name}`);
            });
            break;

        case "time":
            terminalWrite(`DEVICE TIME: ${new Date().toLocaleString()}`);
            break;

        case "open": {
            const target = parts[1];
            if (getModule(target)) {
                navigate(target);
                terminalWrite(`Opening ${target} department.`);
            } else {
                terminalWrite("Department not found. Type modules.", "error");
            }
            break;
        }

        case "clear":
            document.querySelector("#terminalOutput").innerHTML = "";
            break;

        default:
            terminalWrite("Unknown command. Type help for available commands.", "error");
    }
}

/* =========================================
   LIVE CLOCK
========================================= */

function updateClock() {
    const clock = document.querySelector("#liveClock");

    if (clock) {
        clock.textContent = timeNow();
    }
}

setInterval(updateClock, 1000);

/* =========================================
   INITIALIZATION
========================================= */

function initialize() {
    render();

    notify("COMMAND CORE application initialized.");

    console.log(`${APP.name} v${APP.version} initialized.`);
}

initialize();
