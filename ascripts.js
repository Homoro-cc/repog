document.addEventListener("DOMContentLoaded", function() {
    // Stitching table elements
    const stitchingTableBody = document.querySelector(".stitching-div table tbody");
    const editStitchingBtn = document.getElementById("edit-stitching");
    const saveStitchingBtn = document.getElementById("save-stitching");
    
    // Masking table elements
    const maskingTableBody = document.querySelector(".masking-div table tbody");
    const editMaskingBtn = document.getElementById("edit-masking");
    const saveMaskingBtn = document.getElementById("save-masking");
    
    // Function to update row numbers in a table
    function updateRowNumbers(tableBody) {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row, index) => {
            // Update the first cell (row number) in each row
            row.cells[0].textContent = index + 1;
        });
    }
    
    // Function to enable editing for a table
    function enableTableEditing(tableBody) {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            // Skip the first column (row number) and second column (project name)
            for (let i = 2; i < row.cells.length; i++) {
                row.cells[i].contentEditable = true;
                row.cells[i].style.backgroundColor = "#f0f8ff";
                row.cells[i].style.border = "1px solid #4CAF50";
            }
        });
    }
    
    // Function to disable editing for a table
    function disableTableEditing(tableBody) {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            for (let i = 2; i < row.cells.length; i++) {
                row.cells[i].contentEditable = false;
                row.cells[i].style.backgroundColor = "";
                row.cells[i].style.border = "";
            }
        });
    }
    
    // Function to save table data
    function saveTableData(tableBody) {
        disableTableEditing(tableBody);
        updateRowNumbers(tableBody); // Update row numbers after saving
        return confirm("Do you want to save the changes?");
    }
    
    // Initialize row numbers for both tables
    updateRowNumbers(stitchingTableBody);
    updateRowNumbers(maskingTableBody);
    
    // Stitching table event listeners
    editStitchingBtn.addEventListener("click", function() {
        enableTableEditing(stitchingTableBody);
        editStitchingBtn.disabled = true;
        saveStitchingBtn.disabled = false;
    });
    
    saveStitchingBtn.addEventListener("click", function() {
        if (saveTableData(stitchingTableBody)) {
            alert("Stitching changes saved!");
        } else {
            disableTableEditing(stitchingTableBody);
            alert("Changes discarded");
        }
        editStitchingBtn.disabled = false;
        saveStitchingBtn.disabled = true;
    });
    
    // Masking table event listeners
    editMaskingBtn.addEventListener("click", function() {
        enableTableEditing(maskingTableBody);
        editMaskingBtn.disabled = true;
        saveMaskingBtn.disabled = false;
    });
    
    saveMaskingBtn.addEventListener("click", function() {
        if (saveTableData(maskingTableBody)) {
            alert("Masking changes saved!");
        } else {
            disableTableEditing(maskingTableBody);
            alert("Changes discarded");
        }
        editMaskingBtn.disabled = false;
        saveMaskingBtn.disabled = true;
    });
    
    // Disable save buttons initially
    saveStitchingBtn.disabled = true;
    saveMaskingBtn.disabled = true;
    
    // Update row numbers if rows are added dynamically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target === stitchingTableBody) {
                updateRowNumbers(stitchingTableBody);
            } else if (mutation.target === maskingTableBody) {
                updateRowNumbers(maskingTableBody);
            }
        });
    });
    
    observer.observe(stitchingTableBody, { childList: true });
    observer.observe(maskingTableBody, { childList: true });
});