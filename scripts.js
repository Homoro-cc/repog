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
            // Fallback to empty arrays if there's an error
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
    const tdeno = document.getElementById('t-deno-value').textContent; // Get TDeno value

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
        <td class="centered">${tdeno}</td> <!-- Add TDeno value -->
    `;

    tableBody.appendChild(newRow);
    updateTableRowsCount();
    saveTableData();
    showNotification("Data Saved to Table");

    // Clear the mtime and stime input fields
    mtimeInput.value = '';
    stimeInput.value = '';

        // After saving, update Prod and UTL
        updateProdAndUTL();
}

    // Function to clear the table
    function clearTable() {
        tableBody.innerHTML = '';
        updateTableRowsCount();
        localStorage.removeItem('tableData');
        showNotification("Table Data Cleared");

            // Reset Prod and UTL displays
    document.getElementById('prod-value').textContent = '0';
    document.getElementById('utl-value').textContent = '0';
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
            stime: row.cells[7].textContent,
            tdeno: row.cells[8].textContent // Add TDeno to saved data
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
            <td class="centered">${rowData.tdeno || '0'}</td> <!-- Load TDeno with fallback to 0 -->
        `;
        tableBody.appendChild(newRow);
    });
    updateTableRowsCount();
}

    // Function to enable editing of table data
    function enableEditing() {
        Array.from(tableBody.rows).forEach(row => {
            Array.from(row.cells).forEach(cell => {
                if (cell.cellIndex > 0) { // Skip the first column (row number)
                    cell.contentEditable = true;
                    cell.style.backgroundColor = "#f0f8ff"; // Light blue background to indicate edit mode
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
                cell.style.backgroundColor = ""; // Remove background color
            });
        });
    }

    // Event listener for the save button
    saveButton.addEventListener("click", saveData);

    // Event listener for the clear button
    clearButton.addEventListener("click", clearTable);

    // Event listener for the copy button
    copyButton.addEventListener("click", copyTable);

    // Event listener for the edit button
    editButton.addEventListener("click", enableEditing);

    // Event listener for the save2 button
    save2Button.addEventListener("click", saveEditedData);

    // Event listener for scrolling to the bottom of the page
    scrollToBottomButton.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    // Event listener for scrolling to the top of the page
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Event listener for task select change
    taskSelect.addEventListener("change", async () => {
        const { stitchingProjects, maskingProjects } = await fetchProjects();
        
        if (taskSelect.value === "Stitching") {
            projectSelect.innerHTML = stitchingProjects.map(project => `<option value="${project}">${project}</option>`).join('');
        } else if (taskSelect.value === "Masking Engine" || taskSelect.value === "Masking Price Labels") {
            projectSelect.innerHTML = maskingProjects.map(project => `<option value="${project}">${project}</option>`).join('');
        } else {
            projectSelect.innerHTML = ""; // Clear the project dropdown if task is not recognized
        }
    });


    // Function to get Q value from stitching table
async function getStitchingQValue(project) {
    try {
        const response = await fetch('a.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const stitchingRows = doc.querySelector('.table-wrapper:first-child table tbody').querySelectorAll('tr');
        for (const row of stitchingRows) {
            if (row.cells[1].textContent === project) {
                return row.cells[2].textContent; // Q column value
            }
        }
        return "0"; // Default if project not found
    } catch (error) {
        console.error('Error fetching stitching Q value:', error);
        return "0";
    }
}

// Function to get MEQ or MPLQ value from masking table
async function getMaskingValue(project, column) {
    try {
        const response = await fetch('a.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const maskingRows = doc.querySelector('.table-wrapper:last-child table tbody').querySelectorAll('tr');
        for (const row of maskingRows) {
            if (row.cells[1].textContent === project) {
                // Column indexes: FMQ=2, MEQ=3, MPLQ=4
                const colIndex = column === 'MEQ' ? 3 : 4;
                return row.cells[colIndex].textContent;
            }
        }
        return "0"; // Default if project not found
    } catch (error) {
        console.error('Error fetching masking value:', error);
        return "0";
    }
}

// Function to update Deno value based on selected task and project
async function updateDenoValue() {
    const task = taskSelect.value;
    const project = projectSelect.value;
    let denoValue = "0";

    if (project) {
        if (task === "Stitching") {
            denoValue = await getStitchingQValue(project);
        } else if (task === "Masking Engine") {
            denoValue = await getMaskingValue(project, 'MEQ');
        } else if (task === "Masking Price Labels") {
            denoValue = await getMaskingValue(project, 'MPLQ');
        }
    }

    document.getElementById('deno-value').textContent = denoValue;
    updateTDenoValue(); // Also update T-Deno when Deno changes
}

// Function to update T-Deno value
function updateTDenoValue() {
    const seensValue = parseFloat(seensInput.value) || 0;
    const denoValue = parseFloat(document.getElementById('deno-value').textContent) || 0;
    const tDenoValue = (seensValue * denoValue).toFixed(2);
    document.getElementById('t-deno-value').textContent = tDenoValue;
}

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

            // Add event listeners for project selection and seens input
        projectSelect.addEventListener('change', updateDenoValue);
        seensInput.addEventListener('input', updateTDenoValue);

        // Initial update of values
        await updateDenoValue();
        updateTDenoValue();

            // Add event listeners to update Prod and UTL when table changes
    const tableObserver = new MutationObserver(updateProdAndUTL);
    tableObserver.observe(tableBody, { childList: true });

    // Initial update of values
    updateProdAndUTL();
    }

    // Start the initialization
    initialize();
});

// Function to calculate and update Prod value (sum of TDeno column)
function updateProdValue() {
    const rows = tableBody.querySelectorAll('tr');
    let sum = 0;
    
    rows.forEach(row => {
        const tdenoValue = parseFloat(row.cells[8].textContent) || 0; // TDeno is column 8 (0-indexed)
        sum += tdenoValue;
    });
    
    document.getElementById('prod-value').textContent = sum.toFixed(2);
}

// Function to calculate and update UTL value
function updateUTLValue() {
    const rows = tableBody.querySelectorAll('tr');
    let stimeSum = 0;
    let mtimeSum = 0;
    
    rows.forEach(row => {
        const stimeValue = parseFloat(row.cells[7].textContent) || 0; // STime is column 7
        const mtimeValue = parseFloat(row.cells[6].textContent) || 0; // MTime is column 6
        
        stimeSum += stimeValue;
        mtimeSum += mtimeValue;
    });
    
    // Calculate UTL: (STime in hours) + (MTime in minutes converted to hours)
    const utl = (stimeSum / 3600) + (mtimeSum / 60);
    document.getElementById('utl-value').textContent = utl.toFixed(2);
}

// Function to update both Prod and UTL values
function updateProdAndUTL() {
    updateProdValue();
    updateUTLValue();
}
