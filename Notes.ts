// ==========================================
// 1. Base Class - User & 5. Aggregation (User -> NoteBook)
// ==========================================
class User {
  public readonly id: number;
  public name: string;
  public email: string;
  private password: string;
  protected phone: string;
  private age: number;
  public notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    if (age < 18 || age > 60) {
      throw new Error("Age must be between 18 and 60.");
    }
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age;
  }

  public displayInfo(): void {
    console.log(
      `User [ID: ${this.id}] | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone} | Age: ${this.age}`,
    );
  }
}

// ==========================================
// 2. Inheritance - Admin User
// ==========================================
class Admin extends User {
  public manageNotes(
    notebook: NoteBook,
    action: "delete",
    noteId: number,
  ): void {
    if (action === "delete") {
      const removed = notebook.removeNote(noteId);
      console.log(
        removed
          ? `Admin ${this.name} deleted Note ID ${noteId} from "${notebook.name}".`
          : `Note ID ${noteId} not found in "${notebook.name}".`,
      );
    }
  }
}

// ==========================================
// 3. Class - Note & 6. Association (Note -> User)
// ==========================================
class Note {
  public readonly id: number;
  public title: string;
  public content: string;
  public userId: number;
   public author: User;

  constructor(id: number, title: string, content: string, author: User) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.userId = author.id;
  }

  public preview(maxLength: number = 30): string {
    if (this.content.length <= maxLength) {
      return this.content;
    }
    return `${this.content.substring(0, maxLength)}...`;
  }
}

// ==========================================
// 4. Composition - NoteBook and Notes
// ==========================================
class NoteBook {
  public readonly id: number;
  public name: string;
  private notes: Note[] = [];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  public addNote(
    id: number,
    title: string,
    content: string,
    author: User,
  ): Note {
    const newNote = new Note(id, title, content, author);
    this.notes.push(newNote);
    return newNote;
  }

  public removeNote(noteId: number): boolean {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter((note) => note.id !== noteId);
    return this.notes.length < initialLength;
  }

  public getNotes(): Note[] {
    return [...this.notes];
  }
}

// ==========================================
// 7. Generics - Data Storage (1 Mark)
// ==========================================
class Storage<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public removeItem(predicate: (item: T) => boolean): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => !predicate(item));
    return this.items.length < initialLength;
  }

  public getAllItems(): T[] {
    return [...this.items];
  }
}

// ==========================================
//  (Objects & Testing)
// ==========================================

 const user1 = new User(1, "Aya", "aya@gmail.com", "1234", "01128888888", 28);
const admin1 = new Admin(2, "myAdmin", "admin@gmail.com", "adminPass!", "01119876543", 35);

user1.displayInfo();
admin1.displayInfo();

 const workNotebook = new NoteBook(101, "Work Notes");
const studyNotebook = new NoteBook(102, "Study Notes");

user1.notebooks.push(workNotebook, studyNotebook);
console.log(`${user1.name} owns ${user1.notebooks.length} notebooks.`);

 const note1 = workNotebook.addNote(
  1,
  "TypeScript OOP",
  "Learning classes, inheritance, composition, and aggregation in Node.js.",
  user1
);
const note2 = workNotebook.addNote(
  2,
  "Meeting Summary",
  "Discuss project deadline and assign tasks to the team.",
  user1
);

console.log("Note 1 Preview:", note1.preview());
console.log("Note 1 Author:", note1.author.name);
console.log("Total notes in Work Notebook:", workNotebook.getNotes().length);

admin1.manageNotes(workNotebook, "delete", 2);
console.log("Remaining notes after admin delete:", workNotebook.getNotes().length);

 const userStorage = new Storage<User>();
const notebookStorage = new Storage<NoteBook>();
userStorage.addItem(user1);
userStorage.addItem(admin1);
console.log("Stored Users:", userStorage.getAllItems().length);

 notebookStorage.addItem(workNotebook);
notebookStorage.addItem(studyNotebook);
console.log("Stored Notebooks:", notebookStorage.getAllItems().length);

export {};