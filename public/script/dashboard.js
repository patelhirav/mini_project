document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  console.log('Token from local: ', token);
  if (!token) {
    alert('You must be logged in to access this page');
    return;
  }

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const studentClass = document.getElementById('class').value;

  try {
    const response = await fetch('/api/addStudent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, class: studentClass })
    });
    console.log(response);

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || 'Failed to add student.');
      return;
    }

    alert('Student added successfully!');
    document.getElementById('addStudentForm').reset();

  } catch (error) {
    alert('An error occurred. Please try again later.');
    console.error(error);
  }
});

window.addEventListener('load', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must log in to view the dashboard');
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch('/api/students', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert('Failed to fetch student data');
      return;
    }

    const students = await response.json();
    const studentTableBody = document.getElementById('studentTableBody');
    studentTableBody.innerHTML = '';

    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.class}</td>
      `;
      studentTableBody.appendChild(row);
    });
  } catch (error) {
    alert('An error occurred while fetching student data.');
    console.error(error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const addStudentLink = document.getElementById("addStudentLink");
  const studentListLink = document.getElementById("studentListLink");
  const homeworkListLink = document.getElementById("homeworkListLink");

  const addStudentForm = document.getElementById("addStudentForm");
  const studentList = document.getElementById("studentList");
  const homeworkList = document.getElementById("homeworkList");

  const addHomeworkButton = document.getElementById("addHomeworkButton");
  const addHomeworkForm = document.getElementById("addHomeworkForm");
  const homeworkForm = document.getElementById("homeworkForm");
  const homeworkTable = document.querySelector("#homeworkTable tbody");

  function showSection(section) {
    [addStudentForm, studentList, homeworkList].forEach((s) => {
      s.style.display = "none";
    });
    section.style.display = "block";
    if (section !== homeworkList) addHomeworkForm.style.display = "none";
  }

  addStudentLink.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(addStudentForm);
  });

  studentListLink.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(studentList);
  });

  homeworkListLink.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(homeworkList);
  });

  addHomeworkButton.addEventListener("click", () => {
    addHomeworkForm.style.display = addHomeworkForm.style.display === "none" ? "block" : "none";
  });

  homeworkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("homeworkTitle").value;
    const homeworkClass = document.getElementById("homeworkClass").value;
    const topic = document.getElementById("homeworkTopic").value;
    const subject = document.getElementById("homeworkSubject").value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${title}</td>
      <td>${homeworkClass}</td>
      <td>${topic}</td>
      <td>${subject}</td>
    `;
    homeworkTable.appendChild(row);

    homeworkForm.reset();
    addHomeworkForm.style.display = "none";
  });
});