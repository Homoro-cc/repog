document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.querySelector("#divb table tbody");
    const tableRowsCount = document.getElementById("table-rows-count");
    const currentDateElement = document.getElementById("current-date");
    const currentTimeElement = document.getElementById("current-time");
    const saveButton = document.querySelector(".save-button");
    const clearButton = document.querySelector(".clear-button");
    const copyButton = document.querySelector(".copy-button");
    const editButton = document.querySelector(".edit-button");
    const save2Button = document.querySelector(".save2-button");
    const taskSelect = document.getElementById("task-select");
    const projectSelect = document.getElementById("project-select");
    const seensInput = document.getElementById("seens-input");
    const mtimeInput = document.getElementById("mtime-input");
    const stimeInput = document.getElementById("stime-input");
    const notification = document.getElementById("notification");
    const scrollToBottomButton = document.getElementById("scroll-to-bottom");
    const scrollToTopButton = document.getElementById("scroll-to-top");

    // Function to fetch projects from a.html tables
    async function fetchProjects() {
        try {
            const response = await fetch('a.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract stitching projects
            const stitchingRows = doc.querySelector('.table-wrapper:first-child table tbody').querySelectorAll('tr');
            const stitchingProjects = Array.from(stitchingRows).map(row => row.cells[1].textContent);
            
            // Extract masking projects
            const maskingRows = doc.querySelector('.table-wrapper:last-child table tbody').querySelectorAll('tr');
            const maskingProjects = Array.from(maskingRows).map(row => row.cells[1].textContent);
            
            return { stitchingProjects, maskingProjects };
        } catch (error) {
            console.error('Error fetching projects:', error);
            return { stitchingProjects: [], maskingProjects: [] };
        }
    }

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

        // Update the UTL value after saving
        updateUTLValue();
    }

    function clearTable() {
        tableBody.innerHTML = '';
        updateTableRowsCount();
        localStorage.removeItem('tableData');
        showNotification("Table Data Cleared");
        updateUTLValue();
    }

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
        updateUTLValue();
    }

    // Function to enable editing of table data
    function enableEditing() {
        Array.from(tableBody.rows).forEach(row => {
            Array.from(row.cells).forEach(cell => {
                if (cell.cellIndex > 0) { // Skip the first column (row number)
                    cell.contentEditable = true;
                    cell.style.backgroundColor = "#f0f8ff";
                }
            });
        });
        showNotification("Edit Mode Enabled");
    }

    // Function to save the edited table data
    function saveEditedData() {
        if (confirm("Do you want to save the changes?")) {
            saveTableData();
            showNotification("Changes Saved");
        } else {
            loadTableData(); // Reload table data to discard changes
            showNotification("Changes Discarded");
        }
        Array.from(tableBody.rows).forEach(row => {
            Array.from(row.cells).forEach(cell => {
                cell.contentEditable = false;
                cell.style.backgroundColor = "";
            });
        });
    }

    // Function to calculate and update UTL value
    function updateUTLValue() {
        const rows = document.querySelector("#divb table tbody").querySelectorAll('tr');
        let stimeSum = 0;
        let mtimeSum = 0;
        
        rows.forEach(row => {
            const stimeValue = parseFloat(row.cells[7].textContent) || 0;
            const mtimeValue = parseFloat(row.cells[6].textContent) || 0;
            
            stimeSum += stimeValue;
            mtimeSum += mtimeValue;
        });
        
        // Calculate UTL: (STime in hours) + (MTime in minutes converted to hours)
        const utl = (stimeSum / 3600) + (mtimeSum / 60);
        document.getElementById('utl-value').textContent = utl.toFixed(2);
    }

    // Event listeners
    saveButton.addEventListener("click", saveData);
    clearButton.addEventListener("click", clearTable);
    copyButton.addEventListener("click", copyTable);
    editButton.addEventListener("click", enableEditing);
    save2Button.addEventListener("click", saveEditedData);
    scrollToBottomButton.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Event listener for task select change
    taskSelect.addEventListener("change", async () => {
        const { stitchingProjects, maskingProjects } = await fetchProjects();

        if (taskSelect.value === "Stitching") {
            projectSelect.innerHTML = stitchingProjects.map(project => `<option value="${project}">${project}</option>`).join('');
        } else if (taskSelect.value === "Masking Engine" || taskSelect.value === "Masking Price Labels" || taskSelect.value === "Offline Validation") {
            // Use maskingProjects for "Offline Validation" as well
            projectSelect.innerHTML = maskingProjects.map(project => `<option value="${project}">${project}</option>`).join('');
        } else if (taskSelect.value === "Engine Validation") {
            // Show voting table projects for "Engine Validation"
            projectSelect.innerHTML = maskingProjects.map(project => `<option value="${project}">${project}</option>`).join('');
        } else {
            projectSelect.innerHTML = "";
        }
    });

    // Initial setup
    async function initialize() {
        // Load initial projects
        const { stitchingProjects } = await fetchProjects();
        
        // Set initial task and projects
        taskSelect.value = "Stitching";
        projectSelect.innerHTML = stitchingProjects.map(project => `<option value="${project}">${project}</option>`).join('');

        // Load table data
        loadTableData();

        // Initial update
        updateDateTime();
        updateTableRowsCount();

        // If rows are added dynamically, update the count accordingly
        const observer = new MutationObserver(updateTableRowsCount);
        observer.observe(tableBody, { childList: true });

        // Update the date and time every second
        setInterval(updateDateTime, 1000);

        // Add table observer for UTL updates
        const tableObserver = new MutationObserver(updateUTLValue);
        tableObserver.observe(tableBody, { childList: true });

        // Initial update of UTL
        updateUTLValue();
    }

    // Start the initialization
    initialize();
});

document.getElementById("panel-button").addEventListener("click", function() {
    window.open("panel.html", "_blank");
});
