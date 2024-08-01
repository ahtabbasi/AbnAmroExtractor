class Transaction {
    constructor(date, item, amount, comments) {
        this.date = date;
        this.item = item;
        this.category = '';
        this.amount = this.processAmount(amount);
        this.comments = this.processComments(comments);
    }

    print() {
    	console.log(`date ${this.date} | item ${this.item} | amount ${this.amount} | comments ${this.comments}`);
    }

    processAmount(input) {
        // Remove all spaces and commas inside the variable
	    let cleanedInput = input.toString().replace(/[\s,]+/g, '');

	    // Check if the cleaned input is a number
	    let numericValue = parseFloat(cleanedInput);
	    if (!isNaN(numericValue)) {
	        // If it's a number, invert the sign
	        return (-numericValue).toString();
	    } else {
	        // If it's not a number, append '**'
	        return cleanedInput + '**';
	    }
	}

	processComments(input) {
	    // Define the bullet character
	    const bullet = '•';
	    
	    // Split the string at the bullet character
	    const parts = input.split(bullet);
	    
	    // Return the part after the bullet character
	    // Check if there are parts after splitting
	    return parts.length > 1 ? parts.slice(1).join(bullet).trim() : '';
	}
}




let outputTableClassName = `ahtsham-table`;
main();

function main() {
	console.log('Initializing extraction..');

	let container = document.querySelector('#innerPage');
	let transactions = parseData();
	let table = createTableElement(transactions);
	
	removeTablesWithClass(outputTableClassName);
	container.prepend(table);
}





function parseData() {
	let transactionTiles = document.querySelectorAll('div.transaction-tile');
	let allTransactions = [];
	
	if (transactionTiles.length <= 0) {
		console.log('No transaction tiles found.');
		return allTransactions;
	}

	console.log(`${transactionTiles.length} transactions found.`);
    transactionTiles.forEach((tile) => {
        try {
            // Safely get date
            let dateElements = tile.querySelectorAll('div.subtitle span');
            let date = dateElements.length > 0 ? dateElements[0].textContent.trim() : '';

            // Safely get title
            let titleElement = tile.querySelector('div.title');
            let title = titleElement ? titleElement.textContent.trim() : '';

            // Safely get amount
            let amountElement = tile.querySelector('span.amount');
            let amount = amountElement ? amountElement.textContent.trim() : '';

            // Safely get description
            let descriptionElement = tile.querySelector('div.subtitle');
            let description = descriptionElement ? descriptionElement.textContent.trim() : '';

            // Create a new Transaction object
            let transaction = new Transaction(date, title, amount, description);
            allTransactions.push(transaction);
            transaction.print();
        } catch (error) {
            console.log('Error processing tile:', error);
        }
    });
	
	console.log(`${transactionTiles.length} transactions parsed.`);
	return allTransactions.reverse();
}




function createTableElement(transactions) {
    // Create a table element
    const table = document.createElement('table');    
	// Add a class to the table
	table.classList.add(outputTableClassName);
    table.border = '1';  // Adding border for better visibility

    // Create the table header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (const header of Object.keys(transactions[0])) {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    for (const row of transactions) {
        const tr = document.createElement('tr');
        for (const cell in row) {
            const td = document.createElement('td');
            td.textContent = row[cell];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    // Append the table to the container
    return table;
}


// Function to remove all tables with a specific class
function removeTablesWithClass(className) {
    // Select all tables with the specified class
    const tables = document.querySelectorAll(`table.${className}`);
    
    // Iterate over the NodeList and remove each table
    tables.forEach(table => table.remove());
}
