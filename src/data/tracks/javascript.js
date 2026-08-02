export const JS_TRACK = {
  id: 'javascript',
  label: 'JavaScript',
  icon: 'javascript',
  color: '#0ea5e9',
  totalTopics: 20,
  description: 'Master JavaScript from engine internals to advanced asynchronous patterns, DOM manipulation, and modern ES6+ features.',
  modules: [
    {
      id: 'js-m1',
      title: 'Module 1: Core Fundamentals',
      description: 'Understand how JavaScript executes your code, memory management, and variable scoping.',
      topics: [
        {
          id: 'v8-execution-context',
          title: 'V8 Engine & Execution Context',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `JavaScript runs inside a host environment (like the browser or Node.js) utilizing an engine, such as Google\'s V8.

• When Code: runs, a Global Execution Context is created, consisting of two phases: the Memory Creation Phase and the Code Execution Phase.
• In The: memory phase, variables and functions are allocated memory.
• Variables Declared: with var are initialized as undefined, while function declarations are stored in their entirety (this is called hoisting).
• When A Function: is called, a new Local Execution Context is pushed onto the Call Stack.
• The Call Stack: maintains the order of execution.
• Once A: function returns, its context is popped off the stack, and execution resumes in the calling context.
• Understanding Execution: context is crucial for grasping hoisting and the execution order of synchronous JavaScript.`,
          native: {
            Hinglish: 'Execution Context ek factory ki tarah hai jahan JS apna kaam karta hai. Memory phase mein raw material (variables/functions) store hote hain, aur execution phase mein factory unhe process karti hai.',
            Hindi: 'एक्ज़ीक्यूशन कॉन्टेक्स्ट एक कारखाने की तरह है जहाँ जावास्क्रिप्ट काम करता है। मेमोरी चरण में, चर और फ़ंक्शन संग्रहीत होते हैं, और निष्पादन चरण में वे चलते हैं।',
            Tamil: 'எக்ஸிகியூஷன் கான்டெக்ஸ்ட் என்பது ஜாவாஸ்கிரிப்ட் இயங்கும் ஒரு இடம். முதலில் மெமரியில் எல்லாவற்றையும் சேமிக்கும், பிறகு கோடை இயக்கும்.',
            Telugu: 'ఎగ్జిక్యూషన్ కాంటెక్స్ట్ అనేది జావాస్క్రిప్ట్ పనిచేసే ఫ్యాక్టరీ లాంటిది. ముందు మెమరీలో వేరియబుల్స్ సేవ్ అవుతాయి, తరువాత కోడ్ రన్ అవుతుంది.'
          },
          code: `console.log(a); // undefined (hoisted)
var a = 10;
console.log(a); // 10

hello(); // "Hello World" (fully hoisted)
function hello() {
  console.log("Hello World");
}

// Call Stack Visualization
function one() { two(); }
function two() { console.log("Done"); }
one(); // Global -> one() -> two()`,
          lang: 'javascript',
          hasJSPlayground: true,
          visualizer: {
            engine: 'memory',
            title: 'V8 Execution Context & Call Stack — Live Visualization',
            steps: [
              { action: 'push-stack', name: 'Global Execution Context', type: 'frame' },
              { action: 'push-stack', name: 'var a = undefined (Memory Phase)', type: 'variable', value: 'undefined' },
              { action: 'push-stack', name: 'a = 10 (Execution Phase)', type: 'variable', value: '10' },
              { action: 'push-stack', name: 'one() called → Local Context', type: 'frame' },
              { action: 'push-stack', name: 'two() called → Local Context', type: 'frame' },
              { action: 'pop-stack' },
              { action: 'pop-stack' },
              { action: 'pop-stack' },
            ]
          },
          quiz: {
            question: 'What is the output of console.log(x) before var x = 5 is declared?',
            options: ['ReferenceError', 'null', 'undefined', '5'],
            correct: 2,
            explanation: 'Variables declared with var are hoisted to the top of their execution context and initialized with undefined during the memory creation phase. Thus, accessing them before assignment yields undefined, not an error.'
          }
        },
        {
          id: 'scope-closures',
          title: 'Scope Chain & Closures',
          level: 'Advanced',
          badge: 'badge-violet',
          visualizer: {
            engine: 'memory',
            title: 'Scope Chain & Closures',
            steps: []
          },
          summary: `Scope refers to the accessibility of variables.

• JavaScript Uses: lexical scoping, meaning a function\'s scope is determined by where it is defined in the source code.
• The Scope Chain: is the mechanism by which the engine searches for a variable: looking locally first, then in the parent scope, all the way to the global scope.
• A Closure: is formed when a function is bundled together with its lexical environment.
• Practically, This: means an inner function retains access to its outer function\'s variables even after the outer function has returned.
• This Memory: retention mechanism is incredibly powerful and forms the basis for design patterns like the Module Pattern, currying, memoization, and data privacy (encapsulation) in JavaScript.`,
          native: {
            Hinglish: 'Closure matlab baccha (inner function) apne papa (outer function) ki baatein (variables) hamesha yaad rakhta hai, chahe papa chale bhi gaye hon (returned).',
            Hindi: 'क्लोज़र का मतलब है कि एक अंदरूनी फ़ंक्शन अपने बाहरी फ़ंक्शन के वेरिएबल को याद रखता है, भले ही बाहरी फ़ंक्शन समाप्त हो गया हो।',
            Tamil: 'க்ளோஷர் என்றால், ஒரு உள்ளே இருக்கும் பங்க்ஷன், வெளியே இருக்கும் பங்க்ஷனின் மாறிகளை எப்போதும் நியாபகம் வைத்துக்கொள்ளும்.',
            Telugu: 'క్లోజర్ అంటే లోపలి ఫంక్షన్ బయటి ఫంక్షన్ యొక్క వేరియబుల్స్ ను ఎప్పటికీ గుర్తుపెట్టుకుంటుంది.'
          },
          code: `function createCounter() {
  let count = 0; // Private variable
  return function() { // Closure
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2

// Data Privacy
const counter2 = createCounter();
console.log(counter2()); // 1 (independent lexical environment)`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'How do closures achieve data privacy in JavaScript?',
            options: [
              'By using the private keyword',
              'By keeping variables in an outer function that are only accessible to the returned inner function',
              'By encrypting the variables',
              'By defining variables in the global scope'
            ],
            correct: 1,
            explanation: 'Closures allow inner functions to access outer function variables. Since the outer variables aren\'t directly accessible from the outside, but the returned inner function can modify them, they effectively act as private variables.'
          }
        },
        {
          id: 'var-let-const',
          title: 'var vs let vs const & TDZ',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `JavaScript offers three ways to declare variables.

• \'var\': is function-scoped (or globally scoped) and is hoisted with an initial value of undefined, often leading to unexpected bugs due to lack of block scoping.
• \'let\' And: \'const\' were introduced in ES6 and are block-scoped, meaning they only exist within the {} they are defined in.
• A Key: concept with let and const is the Temporal Dead Zone (TDZ).
• While They: are hoisted to the top of their block, they are not initialized.
• Accessing Them: before their declaration line results in a ReferenceError.
• \'const\': is similar to \'let\' but creates a read-only reference; it must be initialized at declaration, and its binding cannot be reassigned, though the properties of objects declared with const can still be mutated.`,
          native: {
            Hinglish: 'var puraane zamaane ka hai jo kहीं bhi chala jata hai (function scope). let naya aur strict hai (block scope). const vo let hai jo apna rasta (reassignment) nahi badalta.',
            Hindi: 'var फ़ंक्शन-स्कोप्ड है और पुराना है। let ब्लॉक-स्कोप्ड है। const को फिर से असाइन नहीं किया जा सकता है।',
            Tamil: 'var என்பது பழைய முறை. let மற்றும் const புதிய முறை, அவை ஒரு பிளாக்கிற்குள் மட்டுமே வேலை செய்யும். const-ஐ மாற்ற முடியாது.',
            Telugu: 'var పాత పద్ధతి. let మరియు const బ్లాక్-స్కోప్డ్. const ని మార్చలేము.'
          },
          code: `// var is function scoped
if (true) { var a = 10; }
console.log(a); // 10 (Accessible outside block!)

// let/const are block scoped
if (true) { let b = 20; const c = 30; }
// console.log(b); // ReferenceError

// Temporal Dead Zone
// console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// const mutation
const obj = { name: "John" };
obj.name = "Jane"; // Allowed (mutating properties)
// obj = {}; // TypeError: Assignment to constant variable`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'What happens when you try to access a let variable before its declaration?',
            options: ['undefined is returned', 'null is returned', 'A ReferenceError is thrown', 'A TypeError is thrown'],
            correct: 2,
            explanation: 'Variables declared with let and const are hoisted but remain uninitialized in the Temporal Dead Zone (TDZ). Accessing them before initialization throws a ReferenceError.'
          }
        }
      ]
    },
    {
      id: 'js-m2',
      title: 'Module 2: Object Oriented & Advanced Mechanics',
      description: 'Dive into JavaScript\'s prototypal nature, context binding, and the concurrency model.',
      topics: [
        {
          id: 'prototypes',
          title: 'Prototypes & Prototype Chain',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Unlike classical OOP languages, JavaScript utilizes Prototypal Inheritance.

• Every Object: in JavaScript has a hidden internal property, often accessible via __proto__, that points to its prototype object.
• When You: attempt to access a property or method on an object, JavaScript first looks on the object itself.
• If Not: found, it traverses up the prototype chain to the object\'s prototype, continuing until it finds the property or reaches null.
• Functions (which: are objects) have a special \'prototype\' property used to build this chain when invoked with the \'new\' keyword.
• ES6 Classes: are largely syntactic sugar over this prototype-based inheritance model, providing a cleaner syntax while utilizing the exact same underlying mechanism.`,
          native: {
            Hinglish: 'Prototype matlab object ka backup parent. Agar child ke paas kuch nahi hai, to wo apne prototype (parent) se maang leta hai. Ye chain aage badhti rehti hai.',
            Hindi: 'प्रोटोटाइप एक वस्तु का जनक है। यदि किसी वस्तु के पास कोई गुण नहीं है, तो वह उसे अपने प्रोटोटाइप से माँगता है।',
            Tamil: 'புரோட்டோடைப் என்பது ஆப்ஜெக்ட்டின் பெற்றோர் மாதிரி. ஆப்ஜெக்ட்டில் ஒன்று இல்லை என்றால் அது அதன் புரோட்டோடைப்பிலிருந்து எடுக்கும்.',
            Telugu: 'ప్రోటోటైప్ అనేది ఆబ్జెక్ట్ యొక్క పేరెంట్ లాంటిది. ఆబ్జెక్ట్ లో లేకపోతే అది తన ప్రోటోటైప్ నుండి తీసుకుంటుంది.'
          },
          code: `const parent = { greet() { return "Hello!"; } };
// Object.create sets the prototype of child to parent
const child = Object.create(parent);
child.name = "Alice";

console.log(child.name); // "Alice" (Own property)
console.log(child.greet()); // "Hello!" (Inherited via prototype chain)
console.log(child.__proto__ === parent); // true

// Constructor function approach
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { console.log(this.name); };
const p1 = new Person("Bob");
p1.sayHi(); // Bob`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'What does a JavaScript engine do if a property is not found on an object?',
            options: [
              'It immediately throws a ReferenceError',
              'It searches the global object',
              'It looks down the prototype chain',
              'It traverses up the prototype chain'
            ],
            correct: 3,
            explanation: 'If a property is missing on an object, the JS engine traverses up the prototype chain (via the object\'s internal [[Prototype]] or __proto__) to look for it, until it reaches null.'
          }
        },
        {
          id: 'this-keyword',
          title: 'The \'this\' Keyword',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `The \'this\' keyword in JavaScript is notoriously confusing because its value is determined dynamically at runtime based on how a function is invoked, not where it is defined.

• There: are four main rules for resolving \'this\': 1.
• Default Binding: (points to the global object, or undefined in strict mode for standalone functions).
• 2.: 
• Implicit Binding: (points to the object directly before the dot when a method is called).
• 3.: 
• Explicit Binding: (using call, apply, or bind to manually set \'this\').
• 4.: 
• New Binding: (points to the newly constructed object when using the \'new\' keyword).
• Arrow Functions: are a special exception; they do not have their own \'this\' context.
• Instead, They: lexically resolve \'this\' by inheriting it from the enclosing scope at the time they are defined.`,
          native: {
            Hinglish: 'this ek girgit ki tarah hai jo apna roop badalta hai. Jisne function ko bulaya, this usi ka ho jata hai. Arrow function bhole hote hain, wo apne parent ka this copy karte hain.',
            Hindi: 'this कीवर्ड इस बात पर निर्भर करता है कि फ़ंक्शन को कैसे कॉल किया गया है। ऐरो फ़ंक्शन अपने बाहरी स्कोप के this को विरासत में लेते हैं।',
            Tamil: 'this கீவேர்டு, பங்க்ஷன் எப்படி அழைக்கப்படுகிறது என்பதைப் பொறுத்து மாறும். Arrow பங்க்ஷன்கள், வெளியே இருக்கும் this-ஐ பயன்படுத்தும்.',
            Telugu: 'this కీవర్డ్ ఫంక్షన్ ని ఎలా కాల్ చేశారో బట్టి మారుతుంది. Arrow ఫంక్షన్స్ బయటి స్కోప్ లోని this ని వాడుకుంటాయి.'
          },
          code: `const user = {
  name: "Raj",
  regularFunc: function() {
    console.log(this.name); // Implicit binding: "Raj"
  },
  arrowFunc: () => {
    console.log(this.name); // Lexical this: undefined (binds to window/global)
  }
};
user.regularFunc();
user.arrowFunc();

function showName() { console.log(this.name); }
const person = { name: "Simran" };
// Explicit binding
showName.call(person); // "Simran"

const boundFunc = showName.bind({name: "Rahul"});
boundFunc(); // "Rahul"`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'How does an arrow function determine its "this" value?',
            options: [
              'It dynamically binds to the object calling it',
              'It lexically inherits "this" from its enclosing execution context',
              'It always binds to the global window object',
              'It binds to the new object if called with "new"'
            ],
            correct: 1,
            explanation: 'Unlike regular functions, arrow functions do not have their own "this" binding. They inherit "this" lexically from the scope they were defined in.'
          }
        },
        {
          id: 'event-loop',
          title: 'Event Loop Deep Dive',
          level: 'Advanced',
          badge: 'badge-violet',
          visualizer: {
            engine: 'memory',
            title: 'Event Loop Execution',
            steps: []
          },
          summary: `JavaScript is single-threaded, meaning it can only execute one command at a time on its main Call Stack.

• However, It: can handle concurrent operations (like network requests or timers) using the Event Loop and Web APIs provided by the browser.
• When An: async operation completes, a callback is pushed to a queue.
• There: are two queues: the Macrotask Queue (for setTimeout, setInterval, I/O) and the Microtask Queue (for Promise callbacks, MutationObserver).
• The Event: Loop constantly monitors the Call Stack.
• When The Call Stack: is empty, it pushes tasks from the queues onto the stack.
• Crucially, The: Microtask Queue has higher priority; the Event Loop will empty all pending microtasks before moving on to the next macrotask, determining exact execution order.`,
          native: {
            Hinglish: 'JS ek waiter ki tarah hai (single thread). Event loop uska manager hai. Manager pehle VIP guests (Microtasks like Promises) ko serve karta hai, phir normal guests (Macrotasks like setTimeout) ko dekhta hai jab tak VIP line khali na ho.',
            Hindi: 'इवेंट लूप जावास्क्रिप्ट को सिंगल-थ्रेडेड होने के बावजूद एसिंक्रोनस काम करने देता है। प्रॉमिस (माइक्रोटास्क) को टाइमर (मैक्रोटास्क) पर प्राथमिकता मिलती है।',
            Tamil: 'இவென்ட் லூப் தான் ஜாவாஸ்கிரிப்ட்டை பல வேலைகளைச் செய்ய வைக்கிறது. பிராமிஸ் (VIP) முதலில் வேலை செய்யும், பிறகுதான் செட்டமைவுட் வேலை செய்யும்.',
            Telugu: 'ఇవెంట్ లూప్ జావాస్క్రిప్ట్ ని ఒకే సమయంలో ఒకదాని కంటే ఎక్కువ పనులు చేసేలా చేస్తుంది. ప్రామిస్ (VIP) ముందు పని చేస్తుంది, తరువాత సెట్ టైమ్ అవుట్.'
          },
          code: `console.log("1. Script start");

setTimeout(() => {
  console.log("4. setTimeout (Macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise (Microtask)");
});

console.log("2. Script end");

/* Output Order:
1. Script start
2. Script end
3. Promise (Microtask) // Microtasks get priority!
4. setTimeout (Macrotask)
*/`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'Which of the following goes to the Microtask Queue?',
            options: ['setTimeout callback', 'setInterval callback', 'Promise .then() callback', 'DOM Event listeners'],
            correct: 2,
            explanation: 'Callbacks from Promises (via .then/catch/finally) and MutationObservers are queued in the Microtask Queue, which takes precedence over the Macrotask Queue used by setTimeout and setInterval.'
          }
        }
      ]
    },
    {
      id: 'js-m3',
      title: 'Module 3: Async & Modern JS',
      description: 'Master asynchronous programming patterns, DOM interactions, and modern ES6 syntax.',
      topics: [
        {
          id: 'promises',
          title: 'Promises',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

• It Acts: as a placeholder for data that will be available in the future.
• A Promise: has three states: Pending (initial state), Fulfilled (operation successful), or Rejected (operation failed).
• Promises Solve: the notorious "Callback Hell" by allowing methods like .then(), .catch(), and .finally() to be chained cleanly.
• The Promise: API also provides static methods for handling multiple concurrent async operations: Promise.all (waits for all to fulfill, rejects if one fails), Promise.race (returns the result of the first to settle), Promise.allSettled (waits for all regardless of outcome), and Promise.any (returns first fulfilled).`,
          native: {
            Hinglish: 'Promise bilkul real-life vaade jaisa hai. Ya toh pending hoga, ya poora hoga (fulfilled/resolved), ya toot jayega (rejected). Ye callback hell se bachata hai.',
            Hindi: 'प्रॉमिस भविष्य के मूल्य का प्रतिनिधित्व करता है। यह तीन अवस्थाओं में हो सकता है: पेंडिंग, फुलफिल्ड, या रिजेक्टेड।',
            Tamil: 'பிராமிஸ் என்பது எதிர்காலத்தில் கிடைக்கும் ஒரு விடை. இது பெண்டிங், சக்சஸ் அல்லது பெயிலியர் என்ற மூன்று நிலைகளில் இருக்கும்.',
            Telugu: 'ప్రామిస్ అనేది భవిష్యత్తులో వచ్చే రిజల్ట్. ఇది పెండింగ్, సక్సెస్ లేదా ఫెయిల్ అనే మూడు స్టేట్స్ లో ఉంటుంది.'
          },
          code: `const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) resolve("Data loaded");
    else reject("Error fetching");
  }, 1000);
});

fetchData
  .then(data => console.log(data)) // "Data loaded"
  .catch(err => console.error(err))
  .finally(() => console.log("Operation complete"));

// Promise.all
const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
Promise.all([p1, p2]).then(results => {
  console.log(results); // [10, 20]
});`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'What happens if one promise fails in a Promise.all() array?',
            options: [
              'It returns an array of successes and the one error',
              'The entire Promise.all rejects immediately with that error',
              'It ignores the error and returns the successful ones',
              'It waits for others to finish before rejecting'
            ],
            correct: 1,
            explanation: 'Promise.all follows a fail-fast mechanism. If any single promise in the iterable is rejected, the entire Promise.all immediately rejects with that specific rejection reason.'
          }
        },
        {
          id: 'async-await',
          title: 'async / await',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Introduced in ES8, async/await is syntactic sugar over Promises, designed to make asynchronous code look and behave more like synchronous code.

• Placing The: "async" keyword before a function ensures that the function always returns a Promise.
• Inside An: async function, the "await" keyword can be used to pause execution until a Promise settles (fulfills or rejects).
• This Eliminates: the need for deeply nested .then() chains, vastly improving code readability and maintainability.
• Error Handling: is elegantly managed using standard synchronous try/catch blocks.
• While It: pauses the execution of the specific async function, it does not block the main thread, allowing the event loop to continue processing other tasks.`,
          native: {
            Hinglish: 'async/await unhi Promises ko likhne ka ek sundar tareeka hai. await bolta hai, "jab tak data nahi aata, main yahi rukunga", par baaki JS nahi rukti.',
            Hindi: 'async/await प्रॉमिस को सिंक्रोनस तरीके से लिखने का एक आसान तरीका है, जिससे कोड पढ़ने में आसान हो जाता है।',
            Tamil: 'async/await என்பது பிராமிஸ் கோடை மிக எளிதாக எழுதும் முறை. await என்பது விடை வரும் வரை காத்திருக்கும்.',
            Telugu: 'async/await అనేది ప్రామిస్ కోడ్ ని ఈజీగా రాసే పద్ధతి. await అంటే రిజల్ట్ వచ్చే వరకు ఆగుతుంది.'
          },
          code: `// Async function returning a promise
async function fetchUser() {
  try {
    // Pauses execution here until Promise resolves
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (!response.ok) throw new Error("Network error");
    
    const data = await response.json();
    console.log("User:", data.name);
  } catch (error) {
    // Elegant error handling for async operations
    console.error("Failed to fetch:", error.message);
  }
}

fetchUser();`,
          lang: 'javascript',
          hasJSPlayground: false,
          quiz: {
            question: 'What does an async function always return?',
            options: ['undefined', 'A Promise', 'The awaited value', 'A callback function'],
            correct: 1,
            explanation: 'Regardless of what you explicitly return inside an async function, it is automatically wrapped in a Promise. If you return a value, the Promise is resolved with that value.'
          }
        },
        {
          id: 'dom-event-delegation',
          title: 'DOM & Event Delegation',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `The Document Object Model (DOM) is an API representing the HTML document as a tree of nodes.

• When An: event (like a click) occurs on an element, it propagates through the DOM tree.
• This Happens: in two phases: Capturing (down the tree to the target) and Bubbling (up the tree from the target).
• By Default,: event listeners trigger during the bubbling phase.
• Event Delegation: is a powerful performance optimization pattern that takes advantage of bubbling.
• Instead Of: attaching a listener to every child element (which consumes memory, especially for dynamic lists), you attach a single listener to a common parent.
• You Then: use event.target to determine exactly which child was clicked, handling dynamic elements gracefully.`,
          native: {
            Hinglish: 'Agar 100 buttons hain toh 100 listeners mat lagao. Unke parent par ek listener lagao aur Event Bubbling ka fayda uthao. Isko Event Delegation kehte hain.',
            Hindi: 'इवेंट डेलिगेशन का मतलब है कि हर बच्चे पर इवेंट लिसनर लगाने के बजाय, हम पैरेंट पर एक लिसनर लगाते हैं, जो मेमोरी बचाता है।',
            Tamil: 'ஒவ்வொரு பட்டனுக்கும் ஈவென்ட் எழுதாமல், அவற்றின் பெற்றோருக்கு ஒரே ஒரு ஈவென்ட் எழுதுவது ஈவென்ட் டெலிகேஷன்.',
            Telugu: 'ప్రతి బటన్ కి ఈవెంట్ రాసే బదులు, వాటి పేరెంట్ కి ఒకే ఈవెంట్ రాయడాన్ని ఈవెంట్ డెలిగేషన్ అంటారు.'
          },
          code: `// HTML: <ul id="list"><li>Item 1</li><li>Item 2</li></ul>

document.getElementById('list').addEventListener('click', function(event) {
  // event.target is the specific element clicked
  if (event.target.tagName === 'LI') {
    console.log('You clicked:', event.target.innerText);
  }
});

// Even if we add new LIs dynamically, the parent listener will catch their clicks!
const newLi = document.createElement('li');
newLi.innerText = 'Item 3';
document.getElementById('list').appendChild(newLi);`,
          lang: 'javascript',
          hasJSPlayground: false,
          quiz: {
            question: 'What DOM mechanism makes Event Delegation possible?',
            options: ['Event Capturing', 'Event Bubbling', 'Event Prevention', 'DOM Parsing'],
            correct: 1,
            explanation: 'Event Delegation relies on Event Bubbling, where events triggered on a deeply nested child element "bubble up" through its ancestors, allowing a parent to listen for and handle events triggered on its children.'
          }
        },
        {
          id: 'es6-features',
          title: 'Modern ES6+ Features',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `ECMAScript 2015 (ES6) and subsequent versions introduced massive improvements to JavaScript syntax and capabilities.

• Key Features: include Destructuring Assignment (extracting data from arrays/objects into distinct variables cleanly), the Spread/Rest operator (...
• For Expanding: arrays/objects or gathering arguments), Template Literals (using backticks for multi-line strings and string interpolation), and ES Modules (import/export syntax for code organization).
• Additionally, New: data structures were introduced: Map (key-value pairs where keys can be any type, maintaining insertion order) and Set (collections of unique values).
• Symbols: were added as unique, immutable identifiers often used for hidden object properties.
• These Features: vastly reduce boilerplate and improve developer experience.`,
          native: {
            Hinglish: 'ES6 ne JS ko aasan bana diya. Destructuring se data nikalna easy ho gaya, Spread operator ne array/object copy karna simple kar diya, aur Map/Set ne nayi taqat di.',
            Hindi: 'ES6 ने जावास्क्रिप्ट को बहुत आसान बना दिया। डिस्ट्रक्चरिंग, स्प्रेड ऑपरेटर, और टेम्पलेट लिटरल जैसे फीचर्स बहुत काम आते हैं।',
            Tamil: 'ES6 ஜாவாஸ்கிரிப்ட்டை மிகவும் எளிதாக்கியது. Destructuring, Spread operator போன்றவை கோடை சுருக்கமாக எழுத உதவுகின்றன.',
            Telugu: 'ES6 జావాస్క్రిప్ట్ ని చాలా సులభం చేసింది. Destructuring, Spread operator లాంటివి కోడ్ ని ఈజీగా రాయడానికి ఉపయోగపడతాయి.'
          },
          code: `// Destructuring
const user = { id: 1, profile: 'Dev' };
const { id, profile } = user; // Extracts variables

// Spread Operator (copy & merge)
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

// Template Literals
console.log(\`User \${profile} has ID: \${id}\`);

// Set (Unique values only)
const numbers = new Set([1, 1, 2, 3, 3]);
console.log([...numbers]); // [1, 2, 3]

// Rest Parameter
function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'Which of the following is true about a JavaScript Map compared to a regular Object?',
            options: [
              'Map keys can only be strings',
              'Map does not preserve the order of keys',
              'Map keys can be of any data type, including objects and functions',
              'Map has no built-in method to check its size'
            ],
            correct: 2,
            explanation: 'While regular JavaScript Object keys are strictly limited to Strings and Symbols, a Map allows keys of any data type, including functions, objects, and primitives.'
          }
        }
      ]
    },
    {
      id: 'js-m4',
      title: 'Module 4: Advanced Patterns & Error Handling',
      description: 'Master advanced variable assignment, modular architecture, robust error handling, memory management, and advanced control flow.',
      topics: [
        {
          id: 'destructuring-spread-rest',
          title: 'Destructuring, Spread & Rest Operators',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Destructuring and the Spread/Rest operators (\`...\`) are incredibly powerful features introduced in ES6, but they come with nuances often tested in interviews.

• Destructuring Allows: for the concise unpacking of arrays and objects into distinct variables.
• It Supports: default values, deep/nested destructuring, and renaming variables on the fly.
• The Spread: operator expands iterables (like arrays or strings) into individual elements, making copying and merging structures seamless.
• However, It: only creates a shallow copy, meaning nested objects still share the same reference—a common interview gotcha.
• The Rest: operator looks identical (\`...\`) but does the exact opposite: it collects multiple elements into a single array, heavily used in function arguments to handle variable numbers of inputs gracefully.`,
          native: {
            Hinglish: 'Destructuring matlab suitcase se samaan nikalna. Spread matlab samaan phailana (copy karna), par yaad rakhna ye shallow copy hai. Rest matlab bache hue samaan ko wapas ek bag mein dalna.'
          },
          code: `// Nested Destructuring & Renaming
const user = { id: 1, info: { name: 'Rahul', age: 25 } };
const { info: { name: userName, age = 18 } } = user;
console.log(userName); // 'Rahul'

// Spread Operator Gotcha (Shallow Copy)
const original = { a: 1, b: { c: 2 } };
const copy = { ...original };
copy.b.c = 99; // Modifies original too!
console.log(original.b.c); // 99

// Rest Operator in Functions
function calculateTotal(discount, ...prices) {
  const total = prices.reduce((sum, p) => sum + p, 0);
  return total - discount;
}
console.log(calculateTotal(10, 50, 20, 30)); // 90`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'What is a critical limitation of copying objects using the spread operator {...obj}?',
            options: [
              'It does not copy methods from the object',
              'It creates a deep clone, consuming excessive memory',
              'It performs a shallow copy, so nested objects are still passed by reference',
              'It throws an error if the object contains symbols'
            ],
            correct: 2,
            explanation: 'The spread operator performs a shallow copy. Primitives are copied by value, but nested objects and arrays are copied by reference. Modifying a nested object in the copy will affect the original object.'
          }
        },
        {
          id: 'es6-modules',
          title: 'ES6 Modules (import/export)',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `ES6 Modules provide a native, standard way to organize JavaScript code into reusable files.

• Before ES6,: developers relied on CommonJS (Node.js) or AMD patterns.
• ES6 Modules: use static \`import\` and \`export\` statements.
• Because They: are static, the JavaScript engine can analyze the dependency tree before execution, enabling optimizations like "Tree Shaking" (eliminating unused code during the build process).
• You: can have multiple Named Exports per file, but only one Default Export.
• A Common: challenge in large codebases is Circular Dependencies (when module A imports B, and B imports A).
• Modern Bundlers: handle this by passing uninitialized bindings, but it can lead to frustrating runtime errors if not carefully designed.`,
          native: {
            Hinglish: 'ES6 Modules matlab apne code ko chote-chote files (modules) mein todna. export se hum functions dusro ko dete hain, aur import se lete hain. Static hone ki wajah se useless code hataana (Tree Shaking) asaan ho jata hai.'
          },
          code: `// utils.js
// Named export
export const add = (a, b) => a + b;
// Default export (only one per file)
export default function multiply(a, b) {
  return a * b;
}

// main.js
// Importing default and named exports
import multiply, { add } from './utils.js';

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20

// Renaming on import
import { add as sum } from './utils.js';
console.log(sum(10, 10)); // 20`,
          lang: 'javascript',
          hasJSPlayground: false,
          quiz: {
            question: 'What is a primary benefit of ES6 modules having static syntax?',
            options: [
              'It allows synchronous downloading of scripts in the browser',
              'It enables bundlers to perform static analysis and Tree Shaking',
              'It completely prevents circular dependencies',
              'It allows variables to be shared implicitly across all files'
            ],
            correct: 1,
            explanation: 'Because import and export statements are static and must be at the top level, engines and bundlers can analyze dependencies without running the code. This makes Tree Shaking (removing unused exports) highly effective.'
          }
        },
        {
          id: 'error-handling',
          title: 'Error Handling Patterns',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Robust Error Handling is critical for production applications.

• The Foundational: block is \`try/catch/finally\`, which catches synchronous exceptions.
• However, This: structure fails for asynchronous callbacks unless handled directly inside the callback.
• With Promises,: errors are propagated through the \`.catch()\` chain.
• If An Error: is thrown inside a \`.then()\` and not caught, it results in an unhandled promise rejection, which can crash modern Node.js applications.
• For Async/await,: we revert to wrapping the \`await\` calls in \`try/catch\`.
• Beyond Built-in: errors (TypeError, ReferenceError), creating custom error classes extending the base \`Error\` class is a best practice, allowing developers to attach custom status codes and operational metadata to track system failures effectively.`,
          native: {
            Hinglish: 'Code ka fatna tay hai, par usko sambhalna (Error Handling) zaruri hai. try mein code likho, catch mein galtiyan pakdo, aur finally hamesha chalega. Promises ke liye .catch() aur async/await ke liye try/catch use karo.'
          },
          code: `// Custom Error Class
class DatabaseError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
  }
}

async function fetchUserData() {
  try {
    // Simulating an error
    throw new DatabaseError("Connection timed out", 503);
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(\`[\${error.code}] \${error.message}\`); // [503] Connection timed out
    } else {
      console.error("Unknown Error:", error);
    }
  } finally {
    console.log("Cleanup: Closing connections");
  }
}
fetchUserData();`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'Why is standard try/catch ineffective for traditional asynchronous callbacks (e.g., setTimeout)?',
            options: [
              'Because the try block executes faster than the catch block',
              'Because the callback is pushed to the event queue and executed long after the try/catch context has exited',
              'Because callbacks do not have a call stack',
              'Because standard try/catch only catches syntax errors'
            ],
            correct: 1,
            explanation: 'When setTimeout runs, it queues the callback. By the time the event loop executes the callback, the original execution context containing the try/catch has already finished and popped off the stack, so the catch block cannot intercept the error.'
          }
        },
        {
          id: 'weakmap-weakset-weakref',
          title: 'WeakMap, WeakSet & WeakRef',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Memory management in JavaScript is handled automatically by the Garbage Collector.

• Normal Map/Set: hold strong references — objects survive even when nulled out, causing leaks.
• WeakMap And: WeakSet hold only weak references so GC can reclaim objects freely.
• They: are NOT iterable (no .size, no forEach) because GC timing is unpredictable.
• WeakRef (ES2021): lets you hold a weak reference to a single object; call .deref() to get it if still alive, or undefined if collected.
• Use WeakMap: for per-object private metadata, WeakSet for tracking processed objects without leaks.`,
          native: {
            Hinglish: 'Normal Map data ko kas ke pakadta hai. Agar original object delete bhi ho jaye, Map use memory mein rakhega (Memory Leak). WeakMap usko weakly pakadta hai, original gaya toh memory se bhi saaf, no leakage!'
          },
          code: `// Normal Map prevents garbage collection
let obj1 = { name: "Strong" };
const normalMap = new Map();
normalMap.set(obj1, "Data");
obj1 = null; // Map still holds the object. Memory NOT freed.

// WeakMap allows garbage collection
let obj2 = { name: "Weak" };
const weakMap = new WeakMap();
weakMap.set(obj2, "Metadata");
obj2 = null; // Object has no other references. Memory WILL be freed by GC.

// WeakRef usage
let hugeObject = { data: new Array(10000) };
const ref = new WeakRef(hugeObject);
hugeObject = null;

// Later in time
const retrievedObj = ref.deref();
if (retrievedObj) {
  console.log("Object still alive!");
} else {
  console.log("Object was garbage collected");
}`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'Which of the following is a key characteristic of a WeakMap?',
            options: [
              'It can accept primitive values as keys',
              'It is fully iterable using loops like for...of',
              'It holds weak references to its keys, allowing them to be garbage collected',
              'It guarantees the order of key insertion'
            ],
            correct: 2,
            explanation: 'WeakMap keys must be objects (or non-registered symbols), and it holds weak references to them. Because objects can be garbage collected at any time, a WeakMap cannot be iterated over.'
          }
        },
        {
          id: 'generators-iterators',
          title: 'Generators & Iterators',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Iterators and Generators introduce a way to manage custom iteration and pause function execution.

• An Iterator: is an object with a "next()" method that returns "{ value, done }".
• By Implementing: the "Symbol.iterator" method, any custom object can become iterable (e.g., usable in "for...of" loops).
• A Generator: ("function*") simplifies this.
• When Called,: it doesn't execute its body immediately; it returns a Generator Object.
• The "yield" Keyword: is used to pause the function, emit a value, and wait until "next()" is called again.
• This Lazy Evaluation: is incredibly useful for generating infinite sequences, handling complex async control flows (like Redux Saga), and managing large datasets without loading everything into memory simultaneously.`,
          native: {
            Hinglish: 'Normal function ek baar chala toh pura chal ke khatam hota hai. Generator (function*) ko hum beech mein rok sakte hain (yield se) aur baad mein wahi se resume kar sakte hain. Ye infinite streams banane ke kaam aata hai.'
          },
          code: `// A custom generator function
function* idGenerator() {
  let id = 1;
  while (true) {
    // Pauses here and returns the value
    yield id++; 
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

// Making an object iterable
const range = {
  from: 1, to: 3,
  [Symbol.iterator]: function* () {
    for (let i = this.from; i <= this.to; i++) {
      yield i;
    }
  }
};

for (const num of range) {
  console.log(num); // 1, 2, 3
}`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'What does calling a generator function initially return?',
            options: [
              'The first yielded value',
              'An Iterator/Generator object',
              'undefined',
              'A Promise'
            ],
            correct: 1,
            explanation: 'Calling a generator function does not execute any of its code immediately. Instead, it returns a special Generator object that conforms to the iterable protocol, which can then be manipulated using the next() method.'
          }
        }
      ]
    },
    {
      id: 'js-m5',
      title: 'Module 5: Browser APIs & TypeScript Essentials',
      description: 'Explore web storage, network requests, performance optimizations, and dive into TypeScript fundamentals and JS design patterns.',
      topics: [
        {
          id: 'web-storage',
          title: 'Web Storage APIs',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Modern browsers offer several mechanisms for storing data locally.

• \`localStorage\` Persists: data indefinitely across browser sessions and has a capacity of ~5MB.
• \`sessionStorage\`: is identical in API but clears data when the specific page tab is closed.
• Both: are synchronous and only store strings (requiring \`JSON.stringify/parse\` for objects).
• For Larger,: more complex, structured data, \`IndexedDB\` is a low-level, asynchronous API offering significantly more storage.
• Cookies, While: older and limited to 4KB, remain crucial for server-client communication because they are automatically attached to HTTP requests, making them essential for authentication (managing session tokens).
• Understanding Which: storage to use based on data size, lifespan, and security constraints is a frequent interview topic.`,
          native: {
            Hinglish: 'localStorage hamesha data rakhta hai, sessionStorage tab band hone tak. Cookies choti hain par server se baat karne (auth) ke liye best hain. IndexedDB bhari data ke liye ek poora database hai browser ke andar.'
          },
          code: `// LocalStorage Example
const userPref = { theme: 'dark', lang: 'en' };
// Must serialize objects to strings
localStorage.setItem('preferences', JSON.stringify(userPref));

const stored = localStorage.getItem('preferences');
console.log(JSON.parse(stored).theme); // 'dark'

// SessionStorage (same API, clears on tab close)
sessionStorage.setItem('tempToken', 'xyz123');

// Cookies (accessible via document)
// Sets a cookie expiring in 1 day
document.cookie = "username=Raj; max-age=86400; path=/; Secure";

// Cleanup
localStorage.removeItem('preferences');`,
          lang: 'javascript',
          hasJSPlayground: false,
          quiz: {
            question: 'Which of the following is true regarding HTTP cookies?',
            options: [
              'They have a massive storage limit of 50MB per domain',
              'They are only accessible on the client side and never sent to the server',
              'They are automatically sent to the server with every HTTP request to that domain',
              'They can store complex JavaScript objects without serialization'
            ],
            correct: 2,
            explanation: 'Cookies are automatically appended to HTTP requests (via headers) made to the domain that set them. This makes them ideal for maintaining stateful sessions and authentication between the client and server.'
          }
        },
        {
          id: 'fetch-xhr',
          title: 'Fetch API & XMLHttpRequest',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Making network requests is fundamental in modern SPAs.

• \`XMLHttpRequest\` (XHR): is the legacy way, utilizing callback-based events.
• It Is: verbose but still heavily used in older codebases and supports precise progress events (useful for file uploads).
• The Modern Standard: is the \`Fetch API\`, built entirely on Promises, resulting in cleaner, more readable code.
• However, \`fetch\`: has a notorious quirk: it does NOT reject the promise on HTTP error statuses (like 404 or 500); it only rejects on sheer network failures.
• Developers Must: manually check \`response.ok\`.
• Additionally, Handling: Cross-Origin Resource Sharing (CORS) is a common headache.
• When A: request spans domains, the browser mandates CORS policies, often requiring preflight OPTIONS requests and proper server headers (\`Access-Control-Allow-Origin\`).`,
          native: {
            Hinglish: 'Pehle XHR use hota tha jo lamba aur boring tha. Ab Fetch use hota hai jo Promise based hai. Par yaad rakhna, Fetch 404/500 aane par fail nahi hota, wo bas net band hone par fail hota hai, tumhe response.ok check karna padta hai.'
          },
          code: `// Modern Fetch API
async function postData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer myToken'
      },
      body: JSON.stringify({ name: 'Testing' })
    });

    // CRITICAL: Fetch doesn't reject on 4xx/5xx
    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status}\`);
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    // Catches network errors AND our manually thrown HTTP errors
    console.error("Fetch failed:", error.message);
  }
}
postData();`,
          lang: 'javascript',
          hasJSPlayground: false,
          quiz: {
            question: 'Under what condition does the Promise returned by the Fetch API reject?',
            options: [
              'When the server responds with a 404 Not Found',
              'When the server responds with a 500 Internal Server Error',
              'Only when there is a network failure or a CORS misconfiguration preventing the request from completing',
              'When the response payload exceeds 1MB'
            ],
            correct: 2,
            explanation: 'The fetch() promise only rejects when a network error is encountered (like being offline) or CORS fails. It resolves normally for HTTP errors (4xx, 5xx), requiring the developer to manually check the response.ok property.'
          }
        },
        {
          id: 'performance',
          title: 'Performance: Debounce & Throttle',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Handling high-frequency events like scrolling, resizing, or keystrokes directly can decimate browser performance.

• Debounce And: Throttle are higher-order functions designed to limit execution rate.
• Debouncing Groups: rapid sequential events into a single execution.
• It Waits: for a specified pause (e.g., 300ms) after the last event before firing the function.
• This: is perfect for search bars where you only want to query the API after the user stops typing.
• Throttling, Conversely,: guarantees the function executes at a steady, fixed rate (e.g., once every 200ms) as long as events continue.
• This: is ideal for scroll listeners or resize handlers where continuous feedback is needed without overwhelming the main thread.
• Another Crucial: optimization tool is "requestAnimationFrame", aligning visual updates with the browser\'s render cycle for smooth animations.`,
          native: {
            Hinglish: 'Debounce matlab jab tak tum type karna band nahi karoge, main API call nahi karunga (search bar). Throttle matlab chahe kitna bhi fast scroll karo, main har 100ms mein ek hi baar event chalaunga (scroll bar).'
          },
          code: `// Debounce Implementation
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer); // Clear previous timer
    timer = setTimeout(() => {
      func.apply(this, args); // Execute after delay
    }, delay);
  };
}

// Throttle Implementation
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args); // Execute immediately
      inThrottle = true; // Lock
      setTimeout(() => inThrottle = false, limit); // Unlock after limit
    }
  }
}

const search = debounce((query) => console.log('Searching:', query), 300);
search('h'); search('he'); search('hello'); // Only "hello" fires after 300ms`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'What is the primary difference between Debounce and Throttle?',
            options: [
              'Debounce limits execution to once per time interval, Throttle delays execution until events stop',
              'Debounce delays execution until events stop firing for a specified time, Throttle guarantees execution at regular intervals',
              'Debounce is asynchronous, Throttle is synchronous',
              'There is no difference, they are synonyms for the same pattern'
            ],
            correct: 1,
            explanation: 'Debouncing ensures a function is not called again until a certain amount of time has passed without it being called. Throttling limits the maximum number of times a function can be called over time, ensuring a steady rate of execution.'
          }
        },
        {
          id: 'typescript-fundamentals',
          title: 'TypeScript Fundamentals',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `TypeScript is a strict syntactical superset of JavaScript that adds optional static typing.

• By Catching: type mismatches at compile time rather than runtime, it drastically reduces bugs in large codebases.
• Key Concepts: include primitive types (string, number, boolean), Arrays, and Tuples.
• Interfaces And: Type Aliases define the shape of objects.
• Generics (\`<T>\`): provide a way to create reusable components that can work with various types while maintaining strict type safety.
• Union Types: (\`string | number\`) allow a variable to hold multiple types, requiring Type Guards (like \`typeof\` checks) to safely interact with them.
• TypeScript Code: is transpiled back into pure JavaScript via the TS compiler (\`tsc\`) because browsers and Node.js engines do not natively understand TypeScript syntax.`,
          native: {
            Hinglish: 'TypeScript JavaScript ka strict boss hai. Ye run hone se pehle (compile time par) hi bata deta hai ki tum string mein array ghusane ki koshish kar rahe ho, jisse production pe errors bachte hain.'
          },
          code: `// Interfaces define object shapes
interface User {
  id: number;
  name: string;
  isAdmin?: boolean; // Optional property
}

const getUser = (user: User): string => {
  return \`User: \${user.name}\`;
};

// Union Types and Type Guards
function processId(id: number | string) {
  if (typeof id === 'string') {
    return id.toUpperCase(); // TS knows it's a string here
  }
  return id * 2; // TS knows it's a number here
}

// Generics provide flexible, reusable types
function identity<T>(arg: T): T {
  return arg;
}
const num = identity<number>(42);
const str = identity<string>("TS");`,
          lang: 'typescript',
          hasJSPlayground: false,
          quiz: {
            question: 'What happens to TypeScript type annotations when the code is executed in the browser?',
            options: [
              'The browser engine verifies them at runtime for safety',
              'They are converted into JavaScript comments',
              'They are completely stripped out during the compilation/transpilation process',
              'They trigger a special TypeScript mode in the V8 engine'
            ],
            correct: 2,
            explanation: 'Browsers do not understand TypeScript natively. The TypeScript compiler (tsc) strictly checks the types during the build process and then entirely strips the type annotations out, emitting pure, standard JavaScript for the browser to run.'
          }
        },
        {
          id: 'design-patterns',
          title: 'JavaScript Design Patterns',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Design patterns are proven, repeatable solutions to common software architecture problems.

• The Singleton: Pattern ensures a class has only one instance and provides a global point of access to it (often used for database connections or application state stores).
• The Module: Pattern utilizes closures or ES6 modules to encapsulate private data, exposing only a public API.
• The Observer: (or Pub/Sub) Pattern defines a one-to-many dependency, allowing an object (the subject) to notify multiple dependents (observers) when its state changes automatically.
• This Pattern: is the foundation of reactive frameworks like React and Vue, as well as Redux, where UI components subscribe to changes in a central state store.`,
          native: {
            Hinglish: 'Design Patterns matlab problems solve karne ke standard tareeke. Singleton matlab puri app mein ek hi instance hoga. Observer/Pub-Sub matlab ek object state badlega aur baaki sab jo usko dekh rahe hain, wo auto-update ho jayenge (jaise YouTube subscribe).'
          },
          code: `// Singleton Pattern (Closure based)
const Database = (function() {
  let instance;
  function createInstance() {
    return { connectionId: Math.random() };
  }
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance; // Always returns the same instance
    }
  };
})();
console.log(Database.getInstance() === Database.getInstance()); // true

// Pub/Sub (Observer) Pattern
class EventEmitter {
  constructor() { this.events = {}; }
  
  subscribe(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }
  
  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }
}
const pubsub = new EventEmitter();
pubsub.subscribe('message', data => console.log(\`Received: \${data}\`));
pubsub.publish('message', 'Hello Pattern!'); // Received: Hello Pattern!`,
          lang: 'javascript',
          hasJSPlayground: true,
          quiz: {
            question: 'Which design pattern is most closely associated with the event listener mechanism (addEventListener) in the DOM?',
            options: [
              'Singleton Pattern',
              'Module Pattern',
              'Observer Pattern',
              'Factory Pattern'
            ],
            correct: 2,
            explanation: 'The DOM event model follows the Observer pattern. Elements (subjects) maintain a list of attached callback functions (observers). When an event occurs, the element notifies all subscribed observers by invoking their callbacks.'
          }
        }
      ]
    }
  ]
};
