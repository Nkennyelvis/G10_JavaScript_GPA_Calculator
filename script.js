document.addEventListener('DOMContentLoaded', () => {
  const assignmentNameInput = document.getElementById('assignmentName');
  const assignmentGradeInput = document.getElementById('assignmentGrade');
  const addAssignmentBtn = document.getElementById('addAssignmentBtn');
  const assignmentsList = document.getElementById('assignmentsList');
  const gpaValueSpan = document.getElementById('gpaValue');

  let assignments = [];

  const saveAssignments = () => {
    localStorage.setItem('gpaCalculatorAssignments', JSON.stringify(assignments));
  };

  const loadAssignments = () => {
    const stored = localStorage.getItem('gpaCalculatorAssignments');
    if (stored) {
      assignments = JSON.parse(stored);
    }
  };

  const calculateAndDisplayGPA = () => {
    if (assignments.length === 0) {
      gpaValueSpan.textContent = '0.00';
      return;
    }

    const total = assignments.reduce((sum, a) => sum + a.grade, 0);
    const gpa = total / assignments.length;
    gpaValueSpan.textContent = gpa.toFixed(2);

    // Animation for GPA update
    gpaValueSpan.classList.add('updated');
    setTimeout(() => gpaValueSpan.classList.remove('updated'), 300);
  };

  const renderAssignments = () => {
    assignmentsList.innerHTML = '';

    assignments.forEach((a, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${a.name}: ${a.grade.toFixed(1)}</span>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      assignmentsList.appendChild(li);
    });

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.target.dataset.index);
        assignments.splice(i, 1);
        saveAssignments();
        renderAssignments();
        calculateAndDisplayGPA();
      });
    });
  };

  const addAssignment = () => {
    const name = assignmentNameInput.value.trim();
    const grade = parseFloat(assignmentGradeInput.value);

    if (!name || isNaN(grade) || grade < 0 || grade > 5) {
      alert("Please enter a valid name and grade (0–5).");
      return;
    }

    assignments.push({ name, grade });
    saveAssignments();
    assignmentNameInput.value = '';
    assignmentGradeInput.value = '';
    renderAssignments();
    calculateAndDisplayGPA();
  };

  addAssignmentBtn.addEventListener('click', addAssignment);
  assignmentGradeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addAssignment();
  });

  // Press "S" to log data
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') {
      console.log("Assignments:", assignments);
      console.log("Current GPA:", gpaValueSpan.textContent);
    }
  });

  loadAssignments();
  renderAssignments();
  calculateAndDisplayGPA();
});