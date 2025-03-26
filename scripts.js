document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.querySelector("#divb table tbody");
    const tableRowsCount = document.getElementById("table-rows-count");
    const currentDateElement = document.getElementById("current-date");
    const currentTimeElement = document.getElementById("current-time");
    const saveButton = document.querySelector(".save-button");
    const clearButton = document.querySelector(".clear-button");
    const copyButton = document.querySelector(".copy-button");
    const taskSelect = document.getElementById("task-select");
    const projectSelect = document.getElementById("project-select");
    const seensInput = document.getElementById("seens-input");
    const mtimeInput = document.getElementById("mtime-input");
    const stimeInput = document.getElementById("stime-input");
    const notification = document.getElementById("notification");
    const scrollToBottomButton = document.getElementById("scroll-to-bottom");
    const scrollToTopButton = document.getElementById("scroll-to-top");

    const stitchingProjects = [
        "abinbevbr",
        "altriaus",
        "bimbous",
        "bluetritonusa",
        "ccbr-prod",
        "ccjp",
        "cckh",
        "diageoca",
        "diageocameroon",
        "diageomx",
        "diageostr",
        "diageous",
        "labattplnoptca",
        "marstr",
        "mondelezeg",
        "mondelezes",
        "mondelezfi1",
        "rjreynoldsus",
        "solarbr",
        "unileverco",
        "unileverus"
    ];

const maskingProjects = [
    "batru",
    "bdftr",
    "beiersdorfar",
    "beiersdorfau",
    "beiersdorfbe",
    "beiersdorfcz",
    "beiersdorfec",
    "beiersdorfeg",
    "beiersdorfgr",
    "beiersdorfin",
    "beiersdorfke",
    "beiersdorfkz",
    "beiersdorfmy",
    "beiersdorfng",
    "beiersdorfpe",
    "beiersdorfpl",
    "beiersdorfpt",
    "beiersdorfsa",
    "beiersdorfse",
    "beiersdorfth",
    "beiersdorftw",
    "beiersdorfuae",
    "beiersdorfuk",
    "beiersdorfvn",
    "beiersdorfza",
    "bikr",
    "biseask",
    "cbcil",
    "ccandinaar",
    "ccanz",
    "ccbr-prod",
    "ccjp",
    "cckr",
    "ccza",
    "diageoau",
    "diageobaltics",
    "diageobenelux",
    "diageobr",
    "diageodr",
    "diageoes",
    "diageoga",
    "diageogh",
    "diageogr",
    "diageogtr",
    "diageoid",
    "diageoie",
    "diageoin",
    "diageoit",
    "diageoke",
    "diageomx",
    "diageopebac",
    "diageopt",
    "diageouk",
    "diageoza",
    "frucorau",
    "googlebr",
    "googlehk",
    "googlekr",
    "googlemx",
    "googleusa",
    "gskes",
    "gskfi",
    "gskhu",
    "gskruph",
    "gskua",
    "heinzcr",
    "inbevci",
    "inbevnl",
    "jtihr",
    "jtiro",
    "jtius",
    "jtjp",
    "kirinjp",
    "marsbh",
    "marskw",
    "marsmx",
    "marsuae",
    "molsoncoorsuk",
    "mondelezde",
    "mondelezdmius",
    "mondelezkaza",
    "mondelezprt",
    "mondelezsa",
    "mondelezsg",
    "penaflorar",
    "pepsibe",
    "pepsicofr",
    "pepsicopl",
    "pepsicoru",
    "pepsicotr",
    "pepsicouk",
    "pepside",
    "pepsigt",
    "pernodus",
    "pngjp",
    "pngza2",
    "sanofiau",
    "sanofieg",
    "sanofijp",
    "scjohnsonbr",
    "sksignals",
    "straussfritolayil",
    "straussil",
    "suntoryjp",
    "tevade",
    "tevahu",
    "tevapl",
    "tevaua",
    "tnuvailv",
    "ulbr",
    "ules",
    "ulgr",
    "ulit",
    "ulnl",
    "ulpl",
    "ulpt",
    "ulse",
    "unileverco",
    "unileveril",
    "unileverin",
    "unileverken",
    "unilevermx",
    "unileverus",
    "unilevrpr"
];

// Function to get the current date and time in Sri Lanka time zone
function getSriLankaDateTime() {
    const now = new Date();
    const dateOptions = {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        weekday: 'long',
    };
    const timeOptions = {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    // Format date and time separately
    const formattedDate = now.toLocaleString('en-US', dateOptions);
    const formattedTime = now.toLocaleString('en-US', timeOptions);

    return { formattedDate, formattedTime };
}

// Function to update the current date and time display
function updateDateTime() {
    const { formattedDate, formattedTime } = getSriLankaDateTime();
    currentDateElement.textContent = formattedDate;
    currentTimeElement.textContent = formattedTime;
}

    // Function to show a notification
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    }

    // Function to update the table rows count
    function updateTableRowsCount() {
        const rowCount = tableBody.rows.length;
        tableRowsCount.textContent = rowCount;
        // Update the row numbers in the first column
        Array.from(tableBody.rows).forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    // Function to save data from diva to divb table
    function saveData() {
        const date = currentDateElement.textContent;
        const time = currentTimeElement.textContent;
        const task = taskSelect.value;
        const project = projectSelect.value;
        const seens = seensInput.value;
        const mtime = mtimeInput.value;
        const stime = stimeInput.value;

        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td class="centered"></td>
            <td>${date}</td>
            <td>${time}</td>
            <td>${task}</td>
            <td>${project}</td>
            <td class="centered">${seens}</td>
            <td class="centered">${mtime}</td>
            <td class="centered">${stime}</td>
        `;

        tableBody.appendChild(newRow);
        updateTableRowsCount();
        saveTableData();
        showNotification("Data Saved to Table");

        // Clear the mtime and stime input fields
        mtimeInput.value = '';
        stimeInput.value = '';
    }

    // Function to clear the table
    function clearTable() {
        tableBody.innerHTML = '';
        updateTableRowsCount();
        localStorage.removeItem('tableData');
        showNotification("Table Data Cleared");
    }

    // Function to copy table data to clipboard
    function copyTable() {
        let tableText = '';
        Array.from(tableBody.rows).forEach(row => {
            Array.from(row.cells).forEach(cell => {
                tableText += cell.textContent + '\t';
            });
            tableText += '\n';
        });
        navigator.clipboard.writeText(tableText).then(() => {
            showNotification("Table Data Copied");
        });
    }

    // Function to save table data to localStorage
    function saveTableData() {
        const rows = Array.from(tableBody.rows).map(row => {
            return {
                date: row.cells[1].textContent,
                time: row.cells[2].textContent,
                task: row.cells[3].textContent,
                project: row.cells[4].textContent,
                seens: row.cells[5].textContent,
                mtime: row.cells[6].textContent,
                stime: row.cells[7].textContent
            };
        });
        localStorage.setItem('tableData', JSON.stringify(rows));
    }

    // Function to load table data from localStorage
    function loadTableData() {
        const rows = JSON.parse(localStorage.getItem('tableData')) || [];
        rows.forEach(rowData => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td class="centered"></td>
                <td>${rowData.date}</td>
                <td>${rowData.time}</td>
                <td>${rowData.task}</td>
                <td>${rowData.project}</td>
                <td class="centered">${rowData.seens}</td>
                <td class="centered">${rowData.mtime}</td>
                <td class="centered">${rowData.stime}</td>
            `;
            tableBody.appendChild(newRow);
        });
        updateTableRowsCount();
    }

    // Event listener for the save button
    saveButton.addEventListener("click", saveData);

    // Event listener for the clear button
    clearButton.addEventListener("click", clearTable);

    // Event listener for the copy button
    copyButton.addEventListener("click", copyTable);

    // Event listener for scrolling to the bottom of the page
    scrollToBottomButton.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    // Event listener for scrolling to the top of the page
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Event listener for task select change
    taskSelect.addEventListener("change", () => {
        console.log(`Task selected: ${taskSelect.value}`); // Debugging line
        if (taskSelect.value === "Stitching") {
            projectSelect.innerHTML = stitchingProjects.map(project => `<option value="${project}">${project}</option>`).join('');
            console.log(`Project dropdown updated with stitching projects.`); // Debugging line
        } else if (taskSelect.value === "Masking Engine" || taskSelect.value === "Masking Price Labels") {
            projectSelect.innerHTML = maskingProjects.map(project => `<option value="${project}">${project}</option>`).join('');
            console.log(`Project dropdown updated with masking projects.`); // Debugging line
        } else {
            projectSelect.innerHTML = ""; // Clear the project dropdown if task is not Stitching, Masking Engine, or Masking Price Labels
            console.log(`Project dropdown cleared.`); // Debugging line
        }
    });

    // Initial update for task and project dropdowns
    taskSelect.value = "Stitching";
    projectSelect.innerHTML = stitchingProjects.map(project => `<option value="${project}">${project}</option>`).join('');

    // Initial load of table data
    loadTableData();

    // Initial update
    updateDateTime();
    updateTableRowsCount();

    // If rows are added dynamically, update the count accordingly
    const observer = new MutationObserver(updateTableRowsCount);
    observer.observe(tableBody, { childList: true });

    // Update the date and time every second
    setInterval(updateDateTime, 1000);
});
