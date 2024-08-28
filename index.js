let students = [];

document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form');
    const studentsTable = document.getElementById('students-table').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const editStudentForm = document.getElementById('edit-student-form');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');

    // Завантаження даних студентів
    loadStudents();

    // Додавання нового студента
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newStudent = {
            id: Date.now(),
            name: studentForm['name'].value,
            surname: studentForm['surname'].value,
            age: parseInt(studentForm['age'].value),
            course: studentForm['course'].value,
            faculty: studentForm['faculty'].value,
            subjects: studentForm['subjects'].value.split(',')
        };
        students.push(newStudent);
        saveStudents();
        displayStudents();
        studentForm.reset();
    });

    // Пошук студентів
    searchInput.addEventListener('input', displayStudents);

    // Редагування студента
    editStudentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(editStudentForm['edit-id'].value);
        const student = students.find(stu => stu.id === id);
        student.name = editStudentForm['edit-name'].value;
        student.surname = editStudentForm['edit-surname'].value;
        student.age = parseInt(editStudentForm['edit-age'].value);
        student.course = editStudentForm['edit-course'].value;
        student.faculty = editStudentForm['edit-faculty'].value;
        student.subjects = editStudentForm['edit-subjects'].value.split(',');
        saveStudents();
        displayStudents();
        modal.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    function displayStudents() {
        studentsTable.innerHTML = '';
        const searchText = searchInput.value.toLowerCase();
        const filteredStudents = students.filter(student => 
            student.surname.toLowerCase().includes(searchText) || 
            student.course.toLowerCase().includes(searchText)
        );

        filteredStudents.forEach(student => {
            const row = studentsTable.insertRow();
            row.insertCell(0).textContent = student.name;
            row.insertCell(1).textContent = student.surname;
            row.insertCell(2).textContent = student.age;
            row.insertCell(3).textContent = student.course;
            row.insertCell(4).textContent = student.faculty;
            row.insertCell(5).textContent = student.subjects.join(', ');

            const actionsCell = row.insertCell(6);
            const editButton = document.createElement('button');
            editButton.textContent = 'Редагувати';
            editButton.addEventListener('click', () => editStudent(student));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Видалити';
            deleteButton.addEventListener('click', () => deleteStudent(student.id));
            actionsCell.appendChild(deleteButton);
        });
    }

    function editStudent(student) {
        document.getElementById('edit-id').value = student.id;
        document.getElementById('edit-name').value = student.name;
        document.getElementById('edit-surname').value = student.surname;
        document.getElementById('edit-age').value = student.age;
        document.getElementById('edit-course').value = student.course;
        document.getElementById('edit-faculty').value = student.faculty;
        document.getElementById('edit-subjects').value = student.subjects.join(', ');
        modal.style.display = 'flex';
    }

    function deleteStudent(id) {
        students = students.filter(student => student.id !== id);
        saveStudents();
        displayStudents();
    }

    function loadStudents() {
        if (localStorage.getItem('students')) {
            students = JSON.parse(localStorage.getItem('students'));
        }
        displayStudents();
    }

    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }
});