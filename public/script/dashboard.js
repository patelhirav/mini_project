document.addEventListener("DOMContentLoaded", () => {
  const addStudentLink = document.getElementById("addStudentLink");
  const studentListLink = document.getElementById("studentListLink");
  const homeworkListLink = document.getElementById("homeworkListLink");
  const studentHomeworkLink = document.getElementById(
    "studentHomeworkLink"
  );
  const addHomeworkButton = document.getElementById("addHomeworkButton");

  const welcomeMessage = document.getElementById("welcomeMessage");
  const addStudentForm = document.getElementById("addStudentForm");
  const studentList = document.getElementById("studentList");
  const homeworkList = document.getElementById("homeworkList");
  const addHomeworkForm = document.getElementById("addHomeworkForm");
  const studentHomework = document.getElementById("studentHomework");
  toggleView(addStudentForm);

  addStudentLink.addEventListener("click", () =>
    toggleView(addStudentForm)
  );
  studentListLink.addEventListener("click", () =>
    toggleView(studentList)
  );
  homeworkListLink.addEventListener("click", () =>
    toggleView(homeworkList)
  );
  studentHomeworkLink.addEventListener("click", () =>
    toggleView(studentHomework)
  );

  addHomeworkButton.addEventListener("click", () => {
    toggleView(homeworkList);
    addHomeworkForm.style.display = "block";
  });

  document
    .getElementById("studentForm")
    .addEventListener("submit", addStudent);
  document
    .getElementById("homeworkForm")
    .addEventListener("submit", addHomework);

  function toggleView(showElement) {
    welcomeMessage.style.display = "none";
    addStudentForm.style.display = "none";
    studentList.style.display = "none";
    homeworkList.style.display = "none";
    addHomeworkForm.style.display = "none";
    studentHomework.style.display = "none";

    showElement.style.display = "block";
  }

  function addStudent(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const studentClass = document.getElementById("class").value;

    const row = `<tr><td>${name}</td><td>${email}</td><td>${studentClass}</td></tr>`;
    document.getElementById("studentTableBody").innerHTML += row;

    e.target.reset();
    toggleView(studentList);
  }

  function addHomework(e) {
    e.preventDefault();
    const title = document.getElementById("homeworkTitle").value;
    const topic = document.getElementById("homeworkTopic").value;
    const subject = document.getElementById("homeworkSubject").value;

    const row = `<tr><td>${title}</td><td>${topic}</td><td>${subject}</td></tr>`;
    document.getElementById("homeworkTableBody").innerHTML += row;

    e.target.reset();
    toggleView(homeworkList);
  }
});


window.addEventListener('load', async () => {

  document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const studentClass = document.getElementById('studentClass').value.trim();

    console.log('Form Values:', { name, email, studentClass });

    if (!name || !email || !studentClass) {
      alert('All fields are required');
      return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('/api/addStudent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, class: studentClass }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || 'Failed to add student.');
      return;
    }

    alert('Student added successfully');
    document.getElementById('addStudentForm').reset();
  });

  document.getElementById('homeworkForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add homework.');
      return;
    }

    const title = document.getElementById('homeworkTitle').value.trim();
    const homeworkClass = document.getElementById('homeworkClass').value.trim();
    const topic = document.getElementById('homeworkTopic').value.trim();
    const subject = document.getElementById('homeworkSubject').value.trim();

    if (!title || !homeworkClass || !topic || !subject) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/addHomework', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, class: homeworkClass, topic, subject }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Failed to add homework.');
        console.error('Error response from API:', result);
        return;
      }

      alert('Homework added successfully!');
      document.getElementById('homeworkForm').reset();

      loadHomework();
    } catch (error) {
      alert('An error occurred while adding homework. Please try again later.');
      console.error('Error adding homework:', error);
    }
  });





  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must log in to view this page.');
    window.location.href = '/';
    return;
  }

  async function loadStudents() {
    try {
      const response = await fetch('/api/students', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        alert('Failed to fetch student data.');
        return;
      }

      const students = await response.json();
      const tableBody = document.getElementById('studentTableBody');
      tableBody.innerHTML = '';

      students.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.class}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('An error occurred while fetching student data.');
    }
  }

  async function loadHomework() {
    try {
      const response = await fetch('/api/homework', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        alert('Failed to fetch homework data.');
        return;
      }

      const homework = await response.json();
      const tableBody = document.getElementById('homeworkTableBody');
      tableBody.innerHTML = '';

      homework.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.title}</td>
          <td>${item.class}</td>
          <td>${item.topic}</td>
          <td>${item.subject}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching homework:', error);
      alert('An error occurred while fetching homework data.');
    }
  }

  await loadStudents();
  await loadHomework();
});
