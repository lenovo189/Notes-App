// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6YtA5ekxM0aI2NCjM6UU0acfhiZwhjoU",
    authDomain: "notes-app-bee9b.firebaseapp.com",
    databaseURL: "https://notes-app-bee9b-default-rtdb.firebaseio.com",
    projectId: "notes-app-bee9b",
    storageBucket: "notes-app-bee9b.firebasestorage.app",
    messagingSenderId: "294832172036",
    appId: "1:294832172036:web:a1c2eccbb68d0a32f1d951"
  };

// Firebase Configuration


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Show/Hide Forms
function showSignUp() {
    document.getElementById('signinForm').classList.add('d-none');
    document.getElementById('signupForm').classList.remove('d-none');
}

function showSignIn() {
    document.getElementById('signupForm').classList.add('d-none');
    document.getElementById('signinForm').classList.remove('d-none');
}

function signUp() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User signed up:", userCredential.user);
            alert("Sign-up successful!");
        })
        .catch((error) => {
            console.error("Sign-up error:", error.code, error.message);
            alert("Error: " + error.message);
        });
}

function signIn() {
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User signed in:", userCredential.user);
            alert("Sign-in successful!");
            document.getElementById('authContainer').classList.add('d-none');
            document.getElementById('notesApp').classList.remove('d-none');
            loadNotes();
        })
        .catch((error) => {
            console.error("Sign-in error:", error.code, error.message);
            alert("Error: " + error.message);
        });
}

function signOut() {
    auth.signOut()
        .then(() => {
            document.getElementById('authContainer').classList.remove('d-none');
            document.getElementById('notesApp').classList.add('d-none');
            alert("Signed out successfully!");
        })
        .catch((error) => {
            console.error("Sign-out error:", error.message);
            alert("Error: " + error.message);
        });
}

function loadNotes() {
    const userId = auth.currentUser.uid;
    const notesRef = database.ref('notes/' + userId);

    notesRef.once('value', (snapshot) => {
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            const noteItem = document.createElement('li');
            noteItem.className = 'list-group-item';
            noteItem.textContent = childSnapshot.val().text;
            notesList.appendChild(noteItem);
        });
    });
}

function addNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value;

    if (noteText.trim() === "") return;

    const userId = auth.currentUser.uid;
    const notesRef = database.ref('notes/' + userId);

    notesRef.push({ text: noteText })
        .then(() => {
            noteInput.value = "";
            loadNotes();
        })
        .catch((error) => alert(error.message));
}
