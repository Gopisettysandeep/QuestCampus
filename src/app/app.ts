import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  activePage = 'Dashboard';
  xp = 250;
  completedLessons: string[] = [];
  completedChallenges: string[] = [];
  quizzesCompleted = 0;
  quizScore = 0;

  currentQuiz: any = null;
  selectedAnswers: number[] = [];
  quizSubmitted = false;
  currentScore = 0;

  selectedCourse: any = null;
  currentLesson: any = null;
  selectedChallenge: any = null;
  showSolution = false;

  codeInput = '';
  sampleInput = '';
  codeOutput = '';
  isRunning = false;
  pyodide: any = null;

  private storageKey = 'questcampus-progress';

  courses = [
    {
      name: 'Angular Development',
      icon: '🅰️',
      description: 'Learn Angular from the basics.',
      lessons: [
        {
          title: 'Introduction to Angular',
          points: 50,
          content: 'Angular is a TypeScript-based framework for building dynamic web applications. It provides components, routing, services, and data binding.',
          example: 'Angular applications are built using reusable components.',
          code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  template: '<h1>Hello Angular!</h1>'
})
export class HelloComponent {}`,
          keyPoints: ['Angular is a frontend framework.', 'It uses TypeScript.', 'Applications are built using components.']
        },
        {
          title: 'Components',
          points: 50,
          content: 'Components are the basic building blocks of Angular applications. Each component contains a class, template, and styles.',
          example: 'A navbar, dashboard, and footer can each be separate components.',
          code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: '<h2>Welcome Home</h2>'
})
export class HomeComponent {}`,
          keyPoints: ['Components are reusable.', 'They contain HTML and TypeScript.', 'Each component has a selector.']
        },
        {
          title: 'Data Binding',
          points: 50,
          content: 'Data binding connects component data with the HTML template.',
          example: 'Interpolation displays a variable in HTML.',
          code: `name = 'Student';

// HTML
<h2>Hello {{ name }}</h2>`,
          keyPoints: ['Interpolation displays values.', 'Property binding uses square brackets.', 'Event binding uses parentheses.']
        },
        {
          title: 'Services',
          points: 50,
          content: 'Services contain reusable business logic and data that can be shared between components.',
          example: 'A service can store student information.',
          code: `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  getName() {
    return 'Student';
  }
}`,
          keyPoints: ['Services promote code reuse.', 'They can share data.', 'Dependency injection provides services.']
        }
      ]
    },
    {
      name: 'Python Programming',
      icon: '🐍',
      description: 'Learn Python programming fundamentals.',
      lessons: [
        {
          title: 'Python Basics',
          points: 50,
          content: 'Python is a simple, high-level programming language used in web development, automation, and data science.',
          example: 'Display a message using print().',
          code: `print("Hello, World!")`,
          keyPoints: ['Python is easy to read.', 'It is interpreted.', 'It supports multiple programming styles.']
        },
        {
          title: 'Variables',
          points: 50,
          content: 'Variables store data values. Python automatically determines the data type.',
          example: 'Store a student name and age.',
          code: `name = "Student"
age = 20

print(name)
print(age)`,
          keyPoints: ['Variables store values.', 'Python is dynamically typed.', 'Use meaningful variable names.']
        },
        {
          title: 'Loops',
          points: 50,
          content: 'Loops repeat a block of code. Python supports for and while loops.',
          example: 'Print numbers from 1 to 5.',
          code: `for i in range(1, 6):
    print(i)`,
          keyPoints: ['for loops iterate over sequences.', 'while loops repeat while a condition is true.', 'Loops reduce repeated code.']
        },
        {
          title: 'Functions',
          points: 50,
          content: 'Functions are reusable blocks of code that perform a specific task.',
          example: 'Create a function to add two numbers.',
          code: `def add(a, b):
    return a + b

print(add(10, 20))`,
          keyPoints: ['Functions use def.', 'Parameters pass values.', 'return sends a result back.']
        }
      ]
    },
    {
      name: 'Java Programming',
      icon: '☕',
      description: 'Learn object-oriented programming with Java.',
      lessons: [
        {
          title: 'Introduction to Java',
          points: 50,
          content: 'Java is a popular object-oriented programming language. Java programs run on the Java Virtual Machine.',
          example: 'Display a message using System.out.println().',
          code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}`,
          keyPoints: ['Java is object-oriented.', 'Java is platform-independent through the JVM.', 'Java uses classes.']
        },
        {
          title: 'Classes',
          points: 50,
          content: 'A class is a blueprint used to create objects.',
          example: 'Create a Student class.',
          code: `class Student {
    String name = "Student";
}`,
          keyPoints: ['Classes define objects.', 'They contain fields and methods.', 'Objects are created from classes.']
        },
        {
          title: 'Objects',
          points: 50,
          content: 'An object is an instance of a class.',
          example: 'Create a Student object.',
          code: `class Student {
    String name = "Student";
}

Student s = new Student();
System.out.println(s.name);`,
          keyPoints: ['Objects are class instances.', 'They contain state and behavior.', 'Use new to create objects.']
        },
        {
          title: 'Inheritance',
          points: 50,
          content: 'Inheritance allows one class to acquire properties and methods from another class.',
          example: 'Dog inherits from Animal.',
          code: `class Animal {
    void eat() {
        System.out.println("Eating");
    }
}

class Dog extends Animal {}`,
          keyPoints: ['Inheritance promotes code reuse.', 'Java uses extends.', 'The child class inherits parent members.']
        }
      ]
    }
  ];

  quizzes = [
    {
      title: 'Angular Basics',
      questions: [
        {
          question: 'Which language does Angular primarily use?',
          options: ['Java', 'TypeScript', 'Python', 'C'],
          correct: 1,
          explanation: 'Angular primarily uses TypeScript.'
        },
        {
          question: 'What is the basic building block of Angular?',
          options: ['Component', 'Database', 'Server', 'Package'],
          correct: 0,
          explanation: 'Components are the basic building blocks of Angular applications.'
        },
        {
          question: 'Which symbol is used for interpolation?',
          options: ['[]', '()', '{{ }}', '{}'],
          correct: 2,
          explanation: 'Angular interpolation uses double curly braces.'
        }
      ]
    },
    {
      title: 'Programming Basics',
      questions: [
        {
          question: 'Which Python function displays output?',
          options: ['show()', 'displayText()', 'print()', 'write()'],
          correct: 2,
          explanation: 'Python uses print() to display output.'
        },
        {
          question: 'Which keyword defines a Python function?',
          options: ['function', 'def', 'func', 'method'],
          correct: 1,
          explanation: 'The def keyword defines a Python function.'
        },
        {
          question: 'Which loop is used to iterate over a sequence?',
          options: ['for', 'repeat', 'foreach only', 'iterate'],
          correct: 0,
          explanation: 'Python uses a for loop to iterate over a sequence.'
        }
      ]
    }
  ];

  challenges = [
    {
      title: 'Print Hello World',
      difficulty: 'Easy',
      description: 'Write a Python program that prints Hello, World!',
      input: '',
      output: 'Hello, World!',
      hint: 'Use the print() function.',
      solution: `print("Hello, World!")`,
      points: 50
    },
    {
      title: 'Find Largest Number',
      difficulty: 'Easy',
      description: 'Read two integers and print the larger number.',
      input: '10\n20',
      output: '20',
      hint: 'Use input(), int(), and max().',
      solution: `a = int(input())
b = int(input())
print(max(a, b))`,
      points: 75
    },
    {
      title: 'Reverse a String',
      difficulty: 'Medium',
      description: 'Read a string and print it in reverse order.',
      input: 'hello',
      output: 'olleh',
      hint: 'Python slicing can reverse a string.',
      solution: `s = input()
print(s[::-1])`,
      points: 100
    }
  ];

  constructor() {
    this.loadProgress();
  }

  get level() {
    return Math.floor(this.xp / 100) + 1;
  }

  get totalLessons() {
    return this.courses.reduce((sum, course) => sum + course.lessons.length, 0);
  }

  get courseProgress() {
    return this.totalLessons
      ? Math.round(this.completedLessons.length / this.totalLessons * 100)
      : 0;
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);

      if (saved) {
        const data = JSON.parse(saved);

        this.xp = data.xp ?? 250;
        this.completedLessons = data.completedLessons ?? [];
        this.completedChallenges = data.completedChallenges ?? [];
        this.quizzesCompleted = data.quizzesCompleted ?? 0;
        this.quizScore = data.quizScore ?? 0;
      }
    } catch {
      console.log('Unable to load progress');
    }
  }

  saveProgress() {
    const data = {
      xp: this.xp,
      completedLessons: this.completedLessons,
      completedChallenges: this.completedChallenges,
      quizzesCompleted: this.quizzesCompleted,
      quizScore: this.quizScore
    };

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  navigate(page: string) {
    this.activePage = page;
    this.selectedCourse = null;
    this.currentLesson = null;
    this.currentQuiz = null;
    this.selectedChallenge = null;
  }

  openCourse(course: any) {
    this.selectedCourse = course;
    this.currentLesson = null;
  }

  openLesson(lesson: any) {
    this.currentLesson = lesson;
  }

  completeLesson() {
    const key = this.selectedCourse.name + ':' + this.currentLesson.title;

    if (!this.completedLessons.includes(key)) {
      this.completedLessons.push(key);
      this.xp += this.currentLesson.points;
      this.saveProgress();
    }
  }

  isLessonCompleted(lesson: any) {
    if (!this.selectedCourse) return false;

    return this.completedLessons.includes(
      this.selectedCourse.name + ':' + lesson.title
    );
  }

  startQuiz(quiz: any) {
    this.currentQuiz = quiz;
    this.selectedAnswers = [];
    this.quizSubmitted = false;
    this.currentScore = 0;
  }

  selectAnswer(questionIndex: number, answerIndex: number) {
    if (!this.quizSubmitted) {
      this.selectedAnswers[questionIndex] = answerIndex;
    }
  }

  submitQuiz() {
    if (this.quizSubmitted) return;

    this.currentScore = this.currentQuiz.questions.filter(
      (q: any, i: number) => q.correct === this.selectedAnswers[i]
    ).length;

    this.quizSubmitted = true;
    this.quizzesCompleted++;
    this.quizScore += this.currentScore;
    this.xp += this.currentScore * 20;

    this.saveProgress();
  }

  closeQuiz() {
    this.currentQuiz = null;
    this.quizSubmitted = false;
  }

  openChallenge(challenge: any) {
    this.selectedChallenge = challenge;
    this.codeInput = '';
    this.sampleInput = challenge.input || '';
    this.codeOutput = '';
    this.showSolution = false;
  }

  async runCode() {
    if (!this.codeInput.trim()) {
      this.codeOutput = 'Please enter your Python code.';
      return;
    }

    this.isRunning = true;
    this.codeOutput = '';

    try {
      const browserWindow = window as any;

      if (!this.pyodide) {
        if (!browserWindow.loadPyodide) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Unable to load Python runtime'));
            document.head.appendChild(script);
          });
        }

        this.pyodide = await browserWindow.loadPyodide();
      }

      const code = `
import sys
import io
import builtins

_qc_output = io.StringIO()
_qc_old_stdout = sys.stdout
_qc_old_stderr = sys.stderr
_qc_old_input = builtins.input
_qc_input = iter(${JSON.stringify(this.sampleInput)}.splitlines())

sys.stdout = _qc_output
sys.stderr = _qc_output
builtins.input = lambda prompt='': next(_qc_input)

try:
    exec(${JSON.stringify(this.codeInput)}, {})
except Exception as e:
    print(type(e).__name__ + ": " + str(e))
finally:
    sys.stdout = _qc_old_stdout
    sys.stderr = _qc_old_stderr
    builtins.input = _qc_old_input

_qc_output.getvalue()
`;

      this.codeOutput = await this.pyodide.runPythonAsync(code);

      if (!this.codeOutput) {
        this.codeOutput = 'Code executed successfully. No output.';
      }
    } catch (error: any) {
      this.codeOutput = error.message || 'Unable to execute code.';
    } finally {
      this.isRunning = false;
    }
  }

  completeChallenge(challenge: any) {
    if (!this.completedChallenges.includes(challenge.title)) {
      this.completedChallenges.push(challenge.title);
      this.xp += challenge.points;
      this.saveProgress();
    }
  }

  isChallengeCompleted(challenge: any) {
    return this.completedChallenges.includes(challenge.title);
  }

  get achievements() {
    return [
      {
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🌱',
        unlocked: this.completedLessons.length >= 1
      },
      {
        title: 'Quiz Master',
        description: 'Complete three quizzes',
        icon: '🧠',
        unlocked: this.quizzesCompleted >= 3
      },
      {
        title: 'Code Explorer',
        description: 'Complete a coding challenge',
        icon: '💻',
        unlocked: this.completedChallenges.length >= 1
      },
      {
        title: 'Learning Champion',
        description: 'Reach level 5',
        icon: '🏆',
        unlocked: this.level >= 5
      }
    ];
  }
}