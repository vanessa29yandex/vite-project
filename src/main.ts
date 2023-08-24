interface Note {
    header: string;
    content: string;
    createDate: string;
    deadlineDate: string;
}
class NoteApp {
    private noteForm: HTMLFormElement;
    private noteList: HTMLDivElement;
    private deleteAllBtn: HTMLButtonElement;
    private notes: Note[];
    private searchTerm: HTMLInputElement;
    constructor() {
        this.noteForm = document.querySelector("#note-form") as HTMLFormElement;
        this.noteList = document.querySelector("#note-list") as HTMLDivElement;
        this.deleteAllBtn = document.querySelector("#deleteAllBtn") as HTMLButtonElement;
        this.searchTerm = document.querySelector("#searchTerm") as HTMLInputElement;
        this.notes = JSON.parse(localStorage.getItem("notes") || "[]");
        this.initialize();
    }
    initialize() {
        this.renderNotes();
        this.noteForm.addEventListener("submit", (e) => this.createNote(e));
        this.deleteAllBtn.addEventListener("click", () => this.deleteAllNotes());
        this.searchTerm.addEventListener("keyup", () => this.renderNotes());
    }
    createNote(e: Event) {
        e.preventDefault();
        const header = (document.querySelector("#header") as HTMLInputElement).value;
        const content = (document.querySelector("#content") as HTMLTextAreaElement).value;
        const createDate = (document.querySelector("#createDate") as HTMLInputElement).value;
        const deadlineDate = (document.querySelector("#deadlineDate") as HTMLInputElement).value;
        const note: Note = { header, content, createDate, deadlineDate };
        this.notes.push(note);
        this.updateLocalStorage();
        this.noteForm.reset();
        this.renderNotes();
    }
    deleteAllNotes() {
        const confirmDelete = confirm("Are you sure you want to delete all notes?");
        if (confirmDelete) 
        this.notes = [];
        this.updateLocalStorage();
        this.renderNotes();
    }
    deleteNote(index: number) {
        this.notes.splice(index, 1);
        this.updateLocalStorage();
        this.renderNotes();
    }
    updateLocalStorage() {
        localStorage.setItem("notes", JSON.stringify(this.notes));
    }
    renderNotes() {
        this.noteList.innerHTML = "";
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        this.notes.sort((a, b) => a.header.localeCompare(b.header));
        this.notes
            .filter((note) => note.header.includes(this.searchTerm.value))
            .forEach((note, index) => {
                const noteElement = document.createElement("div");
                const timeDifference = new Date(note.deadlineDate) - new Date(note.createDate);
                const isUrgent = timeDifference < 24 * 2 * 60 * 60 * 1000; // 2 days in milliseconds
                const isCloseToDeadline = timeDifference < oneWeekInMilliseconds;

                noteElement.innerHTML = `
                    <h2>${note.header}</h2>
                    <p>${note.content}</p>
                    <p>Created On: ${note.createDate} | Deadline: ${note.deadlineDate}</p>
                    <button onclick="noteApp.deleteNote(${index})">Delete</button>`;
                if (isUrgent) {
                    noteElement.style.backgroundColor = 'red';
                } else if (isCloseToDeadline) {
                    noteElement.style.backgroundColor = 'yellow';
                }
                this.noteList.appendChild(noteElement);
            });
    }
}
let noteApp: NoteApp;
window.onload = () => {
    noteApp = new NoteApp();
};

