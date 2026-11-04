import "./style.css";

/* =====================================
   COMMAND CORE APPLICATION ENGINE
   ===================================== */

const SYSTEM = {
    name: "COMMAND CORE",
    version: "1.0.0",
    status: "FRONTEND READY"
};

const MODULES = [
    ["command", "COMMAND CENTRE"],
    ["intelligence", "INTELLIGENCE CENTRE"],
    ["business", "BUSINESS OPERATIONS"],
    ["network", "SOCIAL NETWORK"],
    ["marketplace", "MARKETPLACE"],
    ["finance", "FINANCIAL CENTRE"],
    ["communications", "COMMUNICATIONS"],
    ["media", "MEDIA OPERATIONS"],
    ["technology", "TECHNOLOGY LAB"],
    ["security", "SECURITY OPERATIONS"],
    ["administration", "ADMINISTRATION"],
    ["settings", "SYSTEM SETTINGS"]
];

const app = document.getElementById("app");

let activeModule = "command";
let commandHistory = [];

/* =====================================
   APPLICATION LAYOUT
   ===================================== */

function renderApplication() {

    app.innerHTML = `
        <header>
            <div class="logo">COMMAND CORE</div>
            <div class="status">● FRONTEND READY</div>
        </header>

        <div class="container">

            <nav class="sidebar">
                <div style="color:#8496a2;padding:10px;font-size:11px;">
                    SYSTEM NAVIGATION
                </div>

                ${MODULES.map(([id, name]) => `
                    <button
                        class="nav-button ${id === activeModule ? "active" : ""}"
                        data-module="${id}">
                        ${name}
                    </button>
                `).join("")}
            </nav>

            <main>

                <h1 id="pageTitle">COMMAND CENTRE</h1>

                <p>
                    ADVANCED TECHNOLOGY AND OPERATIONS PLATFORM
                </p>

                <section class="grid">

                    <div class="card">
                        <h3>APPLICATION</h3>
                        <strong>READY</strong>
                    </div>

                    <div class="card">
                        <h3>REGISTERED MODULES</h3>
                        <strong>${MODULES.length}</strong>
                    </div>

                    <div class="card">
                        <h3>VERSION</h3>
                        <strong>${SYSTEM.version}</strong>
                    </div>

                    <div class="card">
                        <h3>BACKEND</h3>
                        <strong style="color:#e7ad43;font-size:16px;">
                            PENDING
                        </strong>
                    </div>

                </section>

                <section class="panel">

                    <h2 id="moduleHeading">
                        SYSTEM COMMAND INTERFACE
                    </h2>

                    <p id="moduleDescription">
                        Select a system from the navigation panel.
                    </p>

                    <div id="output">
                        COMMAND CORE INITIALIZED.
                        <br>
                        AWAITING OPERATOR INPUT...
                    </div>

                </section>

                <section class="panel">

                    <h2>QUICK OPERATIONS</h2>

                    <button class="action" data-module="intelligence">
                        INTELLIGENCE
                    </button>

                    <button class="action" data-module="business">
                        BUSINESS
                    </button>

                    <button class="action" data-module="security">
                        SECURITY
                    </button>

                    <button class="action" data-module="technology">
                        TECHNOLOGY
                    </button>

                    <button class="action" data-module="finance">
                        FINANCE
                    </button>

                </section>

                <section class="panel">

                    <h2>COMMAND TERMINAL</h2>

                    <input
                        id="commandInput"
                        type="text"
                        placeholder="Enter command: help, status, modules"
                        autocomplete="off"
                    >

                    <button class="action" id="executeCommand">
                        EXECUTE COMMAND
                    </button>

                    <div id="terminalOutput">
                        TERMINAL INITIALIZED.
                    </div>

                </section>

                <section class="panel">

                    <h2>SYSTEM INFORMATION</h2>

                    <p>PLATFORM: ${SYSTEM.name}</p>
                    <p>VERSION: ${SYSTEM.version}</p>
                    <p>INTERFACE: ACTIVE</p>
                    <p>SERVER CONNECTION: NOT CONFIGURED</p>

                </section>

            </main>

        </div>
    `;

    attachEvents();
}

/* =====================================
   MODULE NAVIGATION
   ===================================== */

function openModule(id) {

    const module = MODULES.find(item => item[0] === id);

    if (!module) return;

    activeModule = id;

    document.getElementById("pageTitle").textContent =
        module[1];

    document.getElementById("moduleHeading").textContent =
        module[1];

    document.getElementById("moduleDescription").textContent =
        "MODULE SELECTED: " + module[1] +
        ". This module is awaiting its full implementation.";

    document.getElementById("output").textContent =
        "MODULE: " + module[1] +
        " | INTERFACE: ACTIVE | BACKEND: PENDING";

    document.querySelectorAll("[data-module]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.module === id
        );
    });

}

/* =====================================
   COMMAND PROCESSOR
   ===================================== */

function executeCommand() {

    const input = document.getElementById("commandInput");

    const output = document.getElementById("terminalOutput");

    const command = input.value.trim().toLowerCase();

    if (!command) {
        output.textContent = "ERROR: ENTER A COMMAND.";
        return;
    }

    commandHistory.push(command);

    let result = "";

    if (command === "help") {

        result =
            "AVAILABLE COMMANDS:\n" +
            "HELP - SHOW COMMANDS\n" +
            "STATUS - SYSTEM STATUS\n" +
            "MODULES - LIST MODULES\n" +
            "CLEAR - CLEAR TERMINAL";

    } else if (command === "status") {

        result =
            "SYSTEM: " + SYSTEM.name + "\n" +
            "VERSION: " + SYSTEM.version + "\n" +
            "INTERFACE: READY\n" +
            "MODULES: " + MODULES.length + "\n" +
            "BACKEND: NOT CONNECTED";

    } else if (command === "modules") {

        result = MODULES.map(item => item[1]).join("\n");

    } else if (command === "clear") {

        output.textContent = "TERMINAL CLEARED.";

        input.value = "";

        return;

    } else if (command.startsWith("open ")) {

        const target = command.substring(5).trim();

        const module = MODULES.find(
            item =>
                item[0] === target ||
                item[1].toLowerCase() === target
        );

        if (module) {
            openModule(module[0]);
            result = "OPENED: " + module[1];
        } else {
            result = "ERROR: MODULE NOT FOUND.";
        }

    } else {

        result = "UNKNOWN COMMAND. TYPE HELP.";
    }

    output.textContent = result;

    input.value = "";
}

/* =====================================
   EVENT MANAGEMENT
   ===================================== */

function attachEvents() {

    document.querySelectorAll("[data-module]").forEach(button => {

        button.addEventListener("click", () => {
            openModule(button.dataset.module);
        });

    });

    document.getElementById("executeCommand")
        .addEventListener("click", executeCommand);

    document.getElementById("commandInput")
        .addEventListener("keydown", event => {

            if (event.key === "Enter") {
                executeCommand();
            }

        });

}

/* =====================================
   INITIALIZE APPLICATION
   ===================================== */

function initialize() {

    if (!app) {
        throw new Error("APPLICATION ROOT NOT FOUND");
    }

    renderApplication();

    console.log("COMMAND CORE INITIALIZED");
}

initialize();
