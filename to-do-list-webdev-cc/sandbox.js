// Handles adding a new task to the to-do list
function addTask(task){
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
        <span>${task}</span>
        <i class="far fa-trash-alt delete"></i>
    `;
    document.querySelector('.todos').appendChild(li);

    // Clears the task input field after adding a task
    clearInput();

    // Highlights the newly added task with a green background for 1 second
    let currBG = li.style.backgroundColor;
    li.style.backgroundColor = 'lightgreen';

    // Smoothly fade back to normal background
    setTimeout(() => {
        li.style.transition = "background-color 1.5s ease-in-out"; // Smooth transition
        li.style.backgroundColor = currBG; // Fade effect
        }, 100);

}

// Clears the value from the task input field
function clearInput(){
    // Selects and clears the input field with name="add"
    document.querySelector('input[name="add"]').value = '';
}

// Handles removing a task when the delete icon is clicked
function removeTask(e){
    // Verify the click target is actually the delete icon
    if(e.target.classList.contains('delete')){
        // Remove the entire task item (li element) from the list
        e.target.parentElement.remove();
    }
}

// Filters and displays only tasks that match the search text
function showTasks(text){
    // Iterate through all task items in the list
    let lis = document.querySelectorAll('.list-group-item')
    for(let i = 0; i < lis.length; i++){
        // Get the task text content for comparison
        const taskText = lis[i].textContent.toLowerCase();

        // Check if the task text matches the search term
        if(taskText.includes(text)){
            // Make matching tasks visible by setting display to flex
            lis[i].style.setProperty('display', 'flex', 'important');
        }else{
            // Hide non-matching tasks by setting display to none
            lis[i].style.setProperty('display', 'none', 'important');
        }
    };
}

// Event listeners

// Prevent form submission from reloading the page
document.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents any form from reloading the page
});


// Handle form submission for adding new tasks
document.querySelector('.add').addEventListener('submit', function(e) {
// Clear the search input and show all tasks when adding a new one
    document.querySelector('.search input').value = '';
    showTasks('');

    // Get the value of the input
    const task = document.querySelector('input[name="add"]').value;
    // Add the task to the list
    addTask(task);
});

// Handle click events on the delete icons
document.querySelector('.todos').addEventListener('click', function(e) {
    removeTask(e);
});

// Handle real-time search filtering as user types
document.querySelector('.search input').addEventListener('keyup', function(e) {
    // call the showTasks function
    showTasks(e.target.value.toLowerCase());
});
