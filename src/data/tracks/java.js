export const JAVA_TRACK = {
  id: 'java',
  label: 'Java Ecosystem',
  icon: '☕',
  color: '#f59e0b',
  totalTopics: 30,
  description: 'Java Basics → OOP → JVM → Collections → Concurrency → Java 8-21 → Spring Boot → Patterns → DSA → System Design',
  modules: [
    /* ════════════════════════════════════════════════════════
       MODULE 1: Java Basics & Syntax
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m1',
      title: 'Module 1 — Java Basics & Syntax',
      topics: [
        {
          id: 'java-jvm-memory',
          title: 'JDK vs JRE vs JVM & Memory Model',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `Java code travels through: .java source → javac compiler → .class bytecode → JVM interpreter/JIT → native machine code.

JDK (Java Development Kit): Full toolkit — compiler (javac), debugger (jdb), javadoc, JRE. What developers install.
JRE (Java Runtime Environment): Subset of JDK. Libraries + JVM only. What end-users install.
JVM (Java Virtual Machine): Platform-specific engine. Enables "Write Once, Run Anywhere."

JVM Memory Architecture:
• Heap: Where ALL objects live. Shared across threads. Managed by GC.
  — Young Generation (Eden + Survivor): Short-lived objects. Minor GC.
  — Old (Tenured) Generation: Long-lived objects. Major GC.
  — Metaspace (Java 8+): Replaced PermGen. Stores class metadata. Auto-grows.
• Stack: Per-thread. Holds method frames, local primitives, object references. Pops on return.
• String Constant Pool: Special Heap region. String literals are deduplicated ("hello" == "hello" → true).
• PC Register: Tracks current JVM instruction per thread.
• Native Method Stack: For JNI (C/C++) calls.

Garbage Collection Algorithms:
• G1 GC (default Java 9+): Divides heap into equal-size regions. Low-pause, predictable STW.
• ZGC (Java 15+): Sub-millisecond pauses. Scales to TB heaps.
• Shenandoah: Concurrent compaction. Low-latency.`,
          native: {
            Hinglish: `JDK matlab developer ka poora dabba — compiler, debugger sab kuch. JRE sirf program chalane ke liye. JVM woh engine hai jo bytecode ko har OS pe same chalata hai — isliye Java "write once, run anywhere" hai. Memory mein Heap ek bada ghar hai sab objects ke liye. Stack har method ke liye ek temporary desk hai jo method khatam hone pe hat jaati hai. String Pool mein same text duplicate nahi hota — "hello" do baar likho toh ek hi object banta hai.`,
            Hindi: `JDK एक पूरा toolkit है। JRE सिर्फ runtime के लिए है। JVM bytecode को किसी भी OS पर चला सकता है। Heap में सभी objects रहते हैं। Stack प्रत्येक thread के लिए अलग होती है।`,
            Tamil: `JDK முழு toolkit. JRE runtime மட்டும். JVM bytecode-ஐ எந்த OS-லும் இயக்கும். Heap-ல் எல்லா objects இருக்கும். Stack ஒவ்வொரு thread-க்கும் தனி.`,
            Telugu: `JDK పూర్తి toolkit. JRE runtime మాత్రమే. JVM bytecode ని ఏ OS లోనైనా run చేస్తుంది. Heap లో అన్ని objects ఉంటాయి. Stack ప్రతి thread కి వేరు.`,
          },
          visualizer: {
            engine: 'memory',
            title: 'JVM Memory Architecture & Execution Flow',
            steps: [
              {
                action: 'push-stack',
                name: 'main()',
                type: 'frame',
                title: '1. Program Execution Starts (main Frame)',
                codeSnippet: 'public static void main(String[] args)',
                explanation: 'The JVM launches and creates a new Stack Frame for main() on the Call Stack. Stack memory is LIFO (Last In, First Out) and holds local variables for active method calls.'
              },
              {
                action: 'push-stack',
                name: 'int x = 10',
                type: 'variable',
                value: '10',
                title: '2. Primitive Variable Allocation (x = 10)',
                codeSnippet: 'int x = 10;',
                explanation: 'Primitives (int, boolean, double) declared inside methods are stored directly inside the thread stack frame. No Heap allocation happens here.'
              },
              {
                action: 'push-stack',
                name: 'int y = 20',
                type: 'variable',
                value: '20',
                title: '3. Primitive Variable Allocation (y = 20)',
                codeSnippet: 'int y = 20;',
                explanation: 'Variable y is pushed onto the stack frame directly alongside x. Primitives are fast to allocate and take zero Garbage Collection overhead.'
              },
              {
                action: 'alloc-heap',
                name: 'new String("Hello")',
                ref: 'str1',
                address: '0x7f01',
                title: '4. Heap Object Allocation (new String)',
                codeSnippet: 'new String("Hello")',
                explanation: 'The "new" keyword instantiates an object in the Heap memory (Young Generation - Eden Space). A unique memory address (0x7f01) is assigned.'
              },
              {
                action: 'push-stack',
                name: 'String s = 0x7f01',
                type: 'reference',
                ref: 'str1',
                title: '5. Reference Pointer Storage (s -> 0x7f01)',
                codeSnippet: 'String s = new String("Hello");',
                explanation: 'The local variable "s" is created on the Call Stack. It contains a 64-bit reference address (0x7f01) pointing directly to the String object in the Heap.'
              },
              {
                action: 'alloc-heap',
                name: 'new int[]{1,2,3}',
                ref: 'arr1',
                address: '0x7f02',
                title: '6. Array Allocation in Heap',
                codeSnippet: 'new int[]{1, 2, 3}',
                explanation: 'Arrays in Java are always objects! Even primitive arrays (int[]) are instantiated on the Heap at address 0x7f02.'
              },
              {
                action: 'push-stack',
                name: 'int[] arr = 0x7f02',
                type: 'reference',
                ref: 'arr1',
                title: '7. Array Reference on Stack',
                codeSnippet: 'int[] arr = new int[]{1,2,3};',
                explanation: 'Variable "arr" holds the reference 0x7f02 on the Call Stack, pointing to the contiguous array block in the Heap.'
              },
              {
                action: 'pop-stack',
                title: '8. Inner Scope Exit (arr Reference Popped)',
                codeSnippet: '} // end of block',
                explanation: 'Scope exits! The reference variable "arr" is popped off the Call Stack. Notice that the Heap object at 0x7f02 still exists, but now has ZERO incoming references!'
              },
              {
                action: 'gc',
                targets: ['arr1'],
                title: '9. Garbage Collection (GC Sweep)',
                codeSnippet: 'System.gc(); // Unreferenced object cleanup',
                explanation: 'The Minor GC sweeps the Heap. Since new int[]{1,2,3} has no active stack references, it is reclaimed, freeing system RAM.'
              },
              {
                action: 'pop-stack',
                title: '10. Method Completion (s Reference Popped)',
                codeSnippet: '} // main() ending',
                explanation: 'The main() method finishes execution. Stack frames pop off, releasing reference "s".'
              },
              {
                action: 'gc',
                targets: ['str1'],
                title: '11. Final Memory Reclamation',
                codeSnippet: '// JVM Termination / GC Cleanup',
                explanation: 'All remaining unreferenced Heap objects are collected. Heap memory returns to pristine baseline state.'
              }
            ]
          },
          code: `// ─── JVM Memory Demonstration ──────────────────────────
public class JVMMemoryDemo {
    // Static field → Method Area / Metaspace
    static int objectCount = 0;

    // Instance field → stored in Heap inside the object
    private String name;
    private int[]  data;

    public JVMMemoryDemo(String name, int size) {
        this.name = name;           // reference on Stack, String in Heap
        this.data = new int[size];  // array object in Heap
        objectCount++;
    }

    public static void main(String[] args) {
        // ── String Pool ────────────────────────────────────
        String s1 = "Java";           // → String Constant Pool (Heap)
        String s2 = "Java";           // → Same Pool object as s1
        String s3 = new String("Java"); // → new Heap object (NOT pooled)

        System.out.println(s1 == s2);          // true  (same pool reference)
        System.out.println(s1 == s3);          // false (different heap obj)
        System.out.println(s1.equals(s3));     // true  (same content)
        System.out.println(s3.intern() == s1); // true  (intern() uses pool)

        // ── Heap Allocation ────────────────────────────────
        JVMMemoryDemo o1 = new JVMMemoryDemo("First", 1000);
        JVMMemoryDemo o2 = new JVMMemoryDemo("Second", 2000);
        System.out.println("Objects: " + objectCount); // 2

        // ── Stack frames ──────────────────────────────────
        // Each call to demo() pushes a new stack frame:
        demo(10); // frame pushed → executes → frame popped
    }

    static void demo(int x) {
        // x is a local primitive → lives on Stack
        // No heap allocation here
        int y = x * 2; // y also on Stack
        System.out.println(y);
    } // frame popped here, x and y are gone
}`,
          lang: 'java',
          quiz: {
            question: 'You write `String a = "hello"; String b = "hello";`. Where are these stored and what does `a == b` evaluate to?',
            options: [
              'Both on Stack; a == b is false because they are separate variables',
              'Both in String Constant Pool (inside Heap); a == b is true because JVM reuses the same pooled literal object',
              'Both in regular Heap as new String objects; a == b is false',
              'a is in Pool, b is on Stack; a == b throws NullPointerException',
            ],
            correct: 1,
            explanation: 'String literals are interned in the String Constant Pool (a special region inside the Heap). When you write "hello" twice, the JVM reuses the exact same pool object — so `a` and `b` hold the same reference, making `a == b` true. In contrast, `new String("hello")` always creates a new Heap object outside the Pool, so `a == new String("hello")` is false even though `.equals()` returns true.',
          },
        },
        {
          id: 'java-data-types',
          title: 'Data Types, Type Casting, Autoboxing & Wrapper Classes',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `Java is statically typed. Every variable has a declared type.

Primitive Types (8 total — stored on Stack or inline in objects):
• byte (8-bit, -128 to 127), short (16-bit), int (32-bit), long (64-bit, suffix L)
• float (32-bit, IEEE 754), double (64-bit), char (16-bit Unicode), boolean (true/false)

Reference Types: Objects, arrays, Strings — stored in Heap, referenced by pointer on Stack.

Type Casting:
• Widening (implicit/automatic): byte → short → int → long → float → double. Safe, no data loss.
• Narrowing (explicit/manual): double → int. Must cast explicitly. Risk of data truncation.
• int x = (int) 9.99;  // x = 9 (decimal part lost)

Wrapper Classes: Each primitive has an Object wrapper: int → Integer, double → Double, char → Character, boolean → Boolean.
Used when generics are needed (List<Integer> — cannot use List<int>).
Provide utility methods: Integer.parseInt(), Integer.MAX_VALUE, Integer.toBinaryString().

Autoboxing: Automatic conversion primitive → Wrapper when needed.
Unboxing: Automatic conversion Wrapper → primitive.

Integer Cache: Java caches Integer objects from -128 to 127.
Integer a = 100, b = 100; a == b → true (cached same object).
Integer c = 200, d = 200; c == d → false (new objects, use equals()).`,
          native: {
            Hinglish: `Primitive types chote simple values hain jo Stack pe rehte hain — int, double, boolean wagera. Wrapper classes inhe objects banate hain kyunki Java Collections mein objects chahiye hote hain. Autoboxing matlab Java automatically int ko Integer bana deta hai. Lekin Integer cache wala trap yaad rakho: -128 se 127 tak same object milta hai, usse zyada toh alag alag objects.`,
            Hindi: `Primitive types Stack पर store होते हैं। Wrapper classes उन्हें objects में convert करती हैं। Autoboxing automatically primitive को Wrapper में convert करता है। -128 से 127 तक Integer cache होते हैं।`,
            Tamil: `Primitive types Stack-ல் இருக்கும். Wrapper classes அவற்றை objects ஆக்குகின்றன. Autoboxing automatically primitive-ஐ Wrapper ஆக்குகிறது.`,
            Telugu: `Primitive types Stack లో ఉంటాయి. Wrapper classes వాటిని objects గా చేస్తాయి. Autoboxing automatically primitive ని Wrapper గా మారుస్తుంది.`,
          },
          code: `// ─── Primitives & Wrappers ──────────────────────────────
int    count = 42;         // 32-bit integer
long   big   = 10_000_000L; // underscore for readability
double pi    = 3.14159;
char   grade = 'A';       // Unicode char — can do: 'A' + 1 = 'B'
boolean flag = true;

// ─── Widening (implicit, safe) ───────────────────────────
int  i = 100;
long l = i;       // int → long: automatic, safe
double d = i;    // int → double: automatic, safe

// ─── Narrowing (explicit, risk of data loss) ─────────────
double x = 9.99;
int    y = (int) x;  // 9 — decimal part TRUNCATED (not rounded)

long big2 = 1_000_000_000_000L;
int  trunc = (int) big2; // overflow — meaningless result

// ─── Autoboxing & Unboxing ───────────────────────────────
List<Integer> nums = new ArrayList<>();
nums.add(42);        // Autoboxing: int 42 → Integer.valueOf(42)
int val = nums.get(0); // Unboxing: Integer → int

// ─── Integer Cache Trap ───────────────────────────────────
Integer a = 127, b = 127;
System.out.println(a == b);  // TRUE  (cached, same object)

Integer c = 128, d = 128;
System.out.println(c == d);  // FALSE (new objects beyond cache range)
System.out.println(c.equals(d)); // TRUE  (always use equals for Wrappers)

// ─── Wrapper utility methods ─────────────────────────────
int   parsed  = Integer.parseInt("42");      // String → int
String binary  = Integer.toBinaryString(10); // "1010"
int   maxVal  = Integer.MAX_VALUE;            // 2147483647`,
          lang: 'java',
          quiz: {
            question: '`Integer a = 200; Integer b = 200; System.out.println(a == b);` — What is the output and why?',
            options: [
              'true — Java always caches Integer values in the pool',
              'false — == compares object references; values above 127 are not cached, so a and b are different heap objects',
              'true — Integer uses value equality for the == operator',
              'Compilation error — cannot use == with wrapper classes',
            ],
            correct: 1,
            explanation: 'Java caches Integer objects only for values -128 to 127 (the IntegerCache). For values outside this range (like 200), Integer.valueOf() creates new heap objects each time. So `a` and `b` are two different objects on the heap, and `==` compares references — returning false. Always use `.equals()` to compare Integer values for content equality.',
          },
        },
        {
          id: 'java-strings',
          title: 'String Internals, StringBuilder vs StringBuffer',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `Strings are one of the most important Java concepts — and the most misused.

Immutability: String objects in Java are IMMUTABLE. Every modification (concat, replace, toLowerCase) creates a NEW String object. The original is unchanged.
WHY immutable? Thread safety (no synchronization needed), Security (passwords, class names, URLs cannot be tampered), Hashcode caching (enables efficient HashMap keys).

String Constant Pool: Literal strings are interned and deduplicated.
String s = "hello"; // in pool
String t = new String("hello"); // new heap object, bypasses pool
t.intern() // returns pool reference

+= performance disaster: Each s += "x" creates a NEW String object. In a loop of 10,000 iterations, this creates 10,000 temporary objects → GC pressure.

StringBuilder (NOT thread-safe, single-threaded performance):
Mutable buffer. Methods: append(), insert(), delete(), reverse(), toString().
Use for all string building in single-threaded code.

StringBuffer (thread-safe, synchronized):
Same API as StringBuilder but all methods are synchronized.
Use ONLY when multiple threads share the same buffer. Otherwise prefer StringBuilder.

String methods you must know: charAt(), substring(), indexOf(), contains(), startsWith(), endsWith(), split(), replace(), replaceAll(regex), trim(), strip(), isEmpty(), isBlank(), compareTo(), matches(), valueOf(), format().`,
          native: {
            Hinglish: `String Java mein immutable hai — matlab ek baar bana diya toh change nahi hoga, sirf naya object banega. Isliye loop mein += se string banana bahut slow hai — har baar naya object banta hai. Uski jagah StringBuilder use karo jo mutable hai aur zyada fast hai. StringBuffer same hai but thread-safe — synchronized hai. Agar single thread hai toh StringBuilder, agar multiple threads ek hi buffer share kar rahe hain toh StringBuffer.`,
            Hindi: `String immutable है — बदलने पर नया object बनता है। StringBuilder mutable और fast है। StringBuffer thread-safe है।`,
            Tamil: `String immutable. StringBuilder mutable மற்றும் வேகமானது. StringBuffer thread-safe.`,
            Telugu: `String immutable. StringBuilder mutable మరియు వేగంగా ఉంటుంది. StringBuffer thread-safe.`,
          },
          visualizer: {
            engine: 'memory',
            title: 'String Pool vs Heap — Live Visualization',
            steps: [
              { action: 'push-stack', name: 'main()', type: 'frame' },
              { action: 'alloc-heap', name: '"hello" (String Pool)', ref: 'pool1', address: 'Pool:0x01' },
              { action: 'push-stack', name: 'String a = "hello"', type: 'reference', ref: 'pool1' },
              { action: 'push-stack', name: 'String b = "hello"', type: 'reference', ref: 'pool1' },
              { action: 'alloc-heap', name: 'new String("hello")', ref: 'heap1', address: '0x7f03' },
              { action: 'push-stack', name: 'String c = new String()', type: 'reference', ref: 'heap1' },
              { action: 'push-stack', name: 'a == b → true (same pool ref)', type: 'variable', value: 'true' },
              { action: 'push-stack', name: 'a == c → false (diff objects)', type: 'variable', value: 'false' },
              { action: 'pop-stack' },
              { action: 'pop-stack' },
            ]
          },
          code: `// ─── String Immutability ─────────────────────────────────
String s = "Hello";
s.concat(" World"); // creates NEW string — s is unchanged!
System.out.println(s); // still "Hello"

s = s.concat(" World"); // reassign to see the new object
System.out.println(s); // "Hello World"

// ─── +  concatenation in loop (AVOID) ────────────────────
String result = "";
for (int i = 0; i < 10_000; i++) {
    result += i; // creates 10,000 new String objects 💀
}

// ─── StringBuilder (correct approach) ────────────────────
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10_000; i++) {
    sb.append(i); // mutates same buffer ✓
}
String r = sb.toString(); // one conversion at end

// ─── StringBuilder API ───────────────────────────────────
StringBuilder b = new StringBuilder("Hello");
b.append(" World")     // Hello World
 .insert(5, ",")       // Hello, World
 .replace(7, 12, "Java") // Hello, Java
 .reverse();           // avaJ ,olleH
System.out.println(b);

// ─── Key String methods ──────────────────────────────────
String str = "  Placement Prep  ";
str.trim()           // "Placement Prep" (legacy, only spaces)
str.strip()          // "Placement Prep" (Java 11+, Unicode-aware)
str.isBlank()        // false
str.split("\\s+")   // ["Placement", "Prep"] — split on whitespace
str.contains("Prep") // true
str.startsWith("  ") // true
str.charAt(2)        // 'P'
str.substring(2, 11) // "Placement"

// String.format (important for interview output)
String name = "Rahul"; int score = 95;
System.out.printf("%-10s: %3d%%\n", name, score);
// "Rahul     :  95%"`,
          lang: 'java',
          quiz: {
            question: 'Why is using `+= ` to concatenate inside a loop with 10,000 iterations a performance problem in Java?',
            options: [
              'Java\'s + operator on strings is not supported in loops',
              'Each += creates a new immutable String object, resulting in 10,000 temporary objects and heavy GC pressure — use StringBuilder instead',
              'The loop variable conflicts with String intern pool causing OutOfMemoryError',
              'String += is thread-unsafe so a concurrent modification exception is thrown',
            ],
            correct: 1,
            explanation: 'Strings are immutable in Java. Every `s += value` compiles to `s = new StringBuilder(s).append(value).toString()` — creating a new String object each iteration. For 10,000 iterations, this allocates 10,000 temporary String objects in the heap, causing heavy garbage collection pressure and O(n²) memory usage. StringBuilder maintains a mutable char array internally, making append O(1) amortized — dramatically faster.',
          },
        },
      ],
    },
    /* ════════════════════════════════════════════════════════
       MODULE 2: OOP
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m2',
      title: 'Module 2 — Object-Oriented Programming',
      topics: [
        {
          id: 'java-oop-pillars',
          title: 'The 4 OOP Pillars: Encapsulation, Inheritance, Polymorphism, Abstraction',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `OOP is the most tested category in placement interviews. Understand each pillar deeply.

1. ENCAPSULATION — Bundling data (fields) + behaviour (methods) in a class and restricting direct access using access modifiers.
  • private fields + public getters/setters.
  • WHY: Prevents invalid state, hides implementation, allows validation in setters.
  • Example: BankAccount — balance is private. You can only use deposit() and withdraw() to change it, preventing direct negative balance assignment.

2. INHERITANCE — Child class inherits state and behaviour of parent class using extends.
  • Java supports single class inheritance (no multiple class inheritance).
  • Java supports multiple interface inheritance.
  • super() calls parent constructor. Must be first statement in child constructor.
  • Method resolution: child method takes priority (overriding).
  • WHY: Code reuse, hierarchical modeling.

3. POLYMORPHISM — "Many forms." One interface, multiple implementations.
  • Compile-time (Static) Polymorphism: Method Overloading — same name, different parameter list.
  • Runtime (Dynamic) Polymorphism: Method Overriding — child overrides parent method. Resolved via JVM's virtual method table (vtable) at runtime.
  • Animal a = new Dog(); a.speak() → calls Dog.speak() at runtime (not Animal.speak()). This is dynamic dispatch.

4. ABSTRACTION — Hiding complex implementation behind a simple interface.
  • Abstract class: 0–100% abstract. Can have constructor, fields, concrete methods. Cannot be instantiated.
  • Interface: Pure contract. All methods abstract by default (pre-Java 8). Java 8+: default and static methods.
  • Abstract class vs Interface: Use abstract class when sharing state/code among related classes. Use interface for unrelated classes that share a capability.`,
          native: {
            Hinglish: `Encapsulation matlab data ko private rakho — jaise ATM ka andar ka circuit — tum sirf button press karte ho (public method), andar ka circuit nahi dekhte. Inheritance matlab beta class papa class se learn karti hai — jaise beta apne baap ke gun le leta hai. Polymorphism matlab ek button, alag alag machines — microwave ka start button alag karta hai, washing machine ka alag. Runtime polymorphism mein JVM khud decide karta hai kon sa method chalana hai.`,
            Hindi: `Encapsulation: data private, methods public। Inheritance: child, parent से properties लेती है। Polymorphism: एक नाम, कई रूप। Abstraction: implementation छुपाना।`,
            Tamil: `Encapsulation: data private வைத்து methods public. Inheritance: child, parent-இடமிருந்து பெறுகிறது. Polymorphism: ஒரு பெயர், பல வடிவங்கள். Abstraction: implementation மறைத்தல்.`,
            Telugu: `Encapsulation: data private, methods public. Inheritance: child, parent నుండి పొందుతుంది. Polymorphism: ఒక పేరు, అనేక రూపాలు. Abstraction: implementation దాచడం.`,
          },
          code: `// All 4 OOP pillars demonstrated

// 1. ABSTRACTION — Abstract class defines contract
abstract class Shape {
    private String color;           // Encapsulation

    public Shape(String color) { this.color = color; }

    public String getColor() { return color; }  // Controlled access

    public abstract double area();   // Must implement in subclass
    public abstract double perimeter();

    // Concrete method — shared behaviour
    public void printInfo() {
        System.out.printf("Shape: %s | Color: %s | Area: %.2f%n",
            getClass().getSimpleName(), getColor(), area());
    }
}

// 2. INHERITANCE — Circle extends Shape
class Circle extends Shape {
    private double radius;          // Encapsulation

    public Circle(String color, double radius) {
        super(color);               // parent constructor first
        if (radius <= 0) throw new IllegalArgumentException("Radius must be positive");
        this.radius = radius;
    }

    @Override public double area()      { return Math.PI * radius * radius; }
    @Override public double perimeter() { return 2 * Math.PI * radius; }

    // Method Overloading — Compile-time Polymorphism
    public double area(int precision) {
        return Math.round(area() * Math.pow(10, precision)) / Math.pow(10, precision);
    }
}

class Rectangle extends Shape {
    private double w, h;
    public Rectangle(String c, double w, double h) { super(c); this.w=w; this.h=h; }
    @Override public double area()      { return w * h; }
    @Override public double perimeter() { return 2 * (w + h); }
}

// 3. POLYMORPHISM — Runtime (dynamic dispatch)
Shape[] shapes = {
    new Circle("Red", 5),
    new Rectangle("Blue", 4, 6)
};

for (Shape s : shapes) {
    s.printInfo(); // JVM decides at runtime which area() to call
}
// Output:
// Shape: Circle    | Color: Red  | Area: 78.54
// Shape: Rectangle | Color: Blue | Area: 24.00`,
          lang: 'java',
          quiz: {
            question: 'What is the difference between Method Overloading and Method Overriding?',
            options: [
              'Both are resolved at runtime; overriding requires @Override annotation',
              'Overloading = same method name, different parameters in the SAME class (compile-time); Overriding = child class redefines parent method with same signature (runtime via vtable)',
              'Overloading requires inheritance; overriding does not',
              'Overriding changes the return type; overloading changes the access modifier',
            ],
            correct: 1,
            explanation: 'Overloading is compile-time (static) polymorphism — the compiler picks the right method based on parameter types/count. The methods exist in the same class. Overriding is runtime (dynamic) polymorphism — the JVM uses the actual object type to pick the method via virtual method table. `Animal a = new Dog(); a.speak()` calls Dog.speak() even though the reference is Animal type — that\'s runtime polymorphism.',
          },
        },
        {
          id: 'java-interfaces',
          title: 'Interfaces, Abstract Classes, Default & Static Methods (Java 8+)',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Interfaces are the cornerstone of Java's contract-based programming and enable multiple inheritance of type.

Pre-Java 8 Interface: All methods are public abstract. All fields are public static final constants.

Java 8+ Interface features:
• default methods: Provide implementation in interface. Classes can override but don't have to.
  - Use case: Adding new methods to existing interface without breaking all implementing classes.
• static methods: Utility methods on the interface itself. Not inherited by implementing classes.
• Java 9+: private methods (helper for default methods).

Abstract Class vs Interface:

| Feature              | Abstract Class          | Interface                    |
|----------------------|-------------------------|------------------------------|
| State (fields)       | Can have instance fields| Only public static final     |
| Constructor          | Yes                     | No                           |
| Access modifiers     | Any                     | public (implicit)            |
| Multiple inheritance | No (single extends)     | Yes (implements multiple)    |
| When to use          | Related classes sharing state | Unrelated classes sharing capability |

Functional Interface: Exactly 1 abstract method. Can be annotated @FunctionalInterface.
Examples: Runnable, Callable, Comparator, Predicate<T>, Function<T,R>, Consumer<T>, Supplier<T>.
Used with lambdas and method references.`,
          native: {
            Hinglish: `Interface ek contract hai — jaise job description. Usme likha hota hai kya karna hai, kaise karna hai yeh nahi. Abstract class mein kuch kaam already done hota hai, sirf kuch methods child ko fill karne hote hain. Java 8 se default methods aa gaye — toh purane interfaces mein naye methods add kar sakte ho bina sab implementing classes todne ke. Functional interface ek method wala interface hai jise lambda se use karte hain.`,
            Hindi: `Interface एक contract है। Abstract class में कुछ implementation होती है। Java 8 में default methods से पुराने interfaces extend हो सकते हैं। Functional interface में एक abstract method होता है।`,
            Tamil: `Interface ஒரு contract. Abstract class-ல் சில implementation இருக்கும். Java 8-ல் default methods வந்தன. Functional interface-ல் ஒரே ஒரு abstract method.`,
            Telugu: `Interface ఒక contract. Abstract class లో కొంత implementation ఉంటుంది. Java 8 లో default methods వచ్చాయి. Functional interface లో ఒక్క abstract method ఉంటుంది.`,
          },
          code: `// ─── Interface with Java 8+ features ────────────────────
@FunctionalInterface
interface Validator<T> {
    boolean validate(T value);             // single abstract method

    default Validator<T> and(Validator<T> other) {  // default method
        return value -> this.validate(value) && other.validate(value);
    }

    static <T> Validator<T> notNull() {     // static utility
        return value -> value != null;
    }
}

// Using with lambda (Functional Interface)
Validator<String> notEmpty  = s -> !s.isBlank();
Validator<String> minLength = s -> s.length() >= 6;
Validator<String> both      = notEmpty.and(minLength); // chained via default

System.out.println(both.validate("hello"));  // false (< 6 chars)
System.out.println(both.validate("password")); // true

// ─── Abstract class with shared state ────────────────────
abstract class Template {
    // Template Method Pattern
    public final void execute() {    // final: no overriding
        setup();
        doWork();   // abstract — subclass fills in
        teardown();
    }

    protected abstract void doWork();  // mandatory to override

    protected void setup()    { System.out.println("Setting up..."); }
    protected void teardown() { System.out.println("Done."); }
}

class EmailTask extends Template {
    @Override
    protected void doWork() { System.out.println("Sending emails..."); }
}

// ─── Multiple interface implementation ───────────────────
interface Serializable  { String serialize(); }
interface Cacheable     { String getCacheKey(); }

class UserProfile implements Serializable, Cacheable {
    private String id, name;
    public UserProfile(String id, String name) { this.id=id; this.name=name; }
    @Override public String serialize()     { return "{id:" + id + ",name:" + name + "}"; }
    @Override public String getCacheKey()   { return "user:" + id; }
}`,
          lang: 'java',
          quiz: {
            question: 'When should you choose an Abstract Class over an Interface in Java?',
            options: [
              'Always choose Interface — Abstract classes are deprecated in Java 11+',
              'Choose Abstract Class when related classes share common state (fields) and partial implementation. Use Interface when unrelated classes need to share a behaviour/capability contract.',
              'Choose Abstract Class only when you need static methods',
              'Abstract classes support multiple inheritance so always prefer them over interfaces',
            ],
            correct: 1,
            explanation: 'The rule: Abstract class = shared state + partial implementation for closely related classes (e.g., Vehicle → Car, Truck share fuel, speed fields). Interface = shared capability contract for unrelated classes (e.g., Bird and Airplane both implement Flyable, but aren\'t related). Key: interfaces cannot have instance fields (only static final constants) or constructors, so they can\'t share state. Java 8+ default methods blur the line but the principle stands.',
          },
        },
        {
          id: 'java-generics',
          title: 'Generics, Type Erasure, Bounded Wildcards',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Generics provide compile-time type safety and eliminate the need for casting.

Why Generics? Pre-generics: ArrayList stored Object, requiring explicit casts and risking ClassCastException at runtime. Generics move this error to compile time.

Generic Class: class Box<T> { private T value; }
Generic Method: <T extends Comparable<T>> T max(T a, T b)
Generic Interface: interface Repository<T, ID> { T findById(ID id); }

Type Erasure: Java implements generics via erasure. At runtime, all generic type information is removed — List<String> and List<Integer> are both just List at runtime. This is why:
• instanceof List<String> doesn't compile (use instanceof List)
• Arrays of generic types are discouraged

Wildcards:
• ? — unbounded wildcard. Read-only use. List<?> = "list of some unknown type."
• ? extends T — upper-bounded. Covariant. Can READ T or subtype. "Producer extends" (PECS).
• ? super T — lower-bounded. Contravariant. Can WRITE T or supertype. "Consumer super" (PECS).

PECS rule (Producer Extends, Consumer Super):
Use <? extends Animal> when you're reading (producing) Animal objects.
Use <? super Dog> when you're writing (consuming) Dog objects.`,
          native: {
            Hinglish: `Generics type safety dete hain — runtime pe ClassCastException nahi aata. Box<String> matlab sirf String rakh sakte ho — compiler check karta hai. Type erasure matlab runtime pe generic type remove ho jaati hai — sab sirf Object ban jaata hai. Wildcards: <? extends Animal> matlab read kar sakte ho (any Animal subtype), <? super Dog> matlab Dog ya uski parent type write kar sakte ho.`,
            Hindi: `Generics compile-time type safety देती हैं। Type erasure: runtime पर generic type remove हो जाती है। Upper bound: पढ़ने के लिए। Lower bound: लिखने के लिए।`,
            Tamil: `Generics compile-time type safety தருகின்றன. Type erasure: runtime-ல் generic type நீக்கப்படும். Upper bound: படிக்க. Lower bound: எழுத.`,
            Telugu: `Generics compile-time type safety ఇస్తాయి. Type erasure: runtime లో generic type తొలగిపోతుంది. Upper bound: చదవడానికి. Lower bound: రాయడానికి.`,
          },
          code: `// ─── Generic Class ───────────────────────────────────────
public class Pair<A, B> {
    private final A first;
    private final B second;

    public Pair(A first, B second) {
        this.first  = first;
        this.second = second;
    }

    public A getFirst()  { return first; }
    public B getSecond() { return second; }

    @Override public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

Pair<String, Integer> p = new Pair<>("Java", 21);
String lang  = p.getFirst();   // No cast needed ✓
Integer version = p.getSecond(); // type-safe ✓

// ─── Generic Method with Bounded Type ────────────────────
public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

System.out.println(max(10, 20));       // 20
System.out.println(max("apple", "z")); // z

// ─── Wildcards (PECS principle) ──────────────────────────
// Producer: reading — use <? extends>
void printAll(List<? extends Number> list) {
    for (Number n : list) System.out.println(n); // reads OK
    // list.add(1); // COMPILE ERROR — can't add, type unknown
}

// Consumer: writing — use <? super>
void addNumbers(List<? super Integer> list) {
    list.add(1); list.add(2); // writes OK
    // Integer n = list.get(0); // COMPILE ERROR — can only get Object
}

List<Integer> ints    = List.of(1, 2, 3);
List<Number>  numbers = new ArrayList<>();
printAll(ints);            // ✓ Integer extends Number
addNumbers(numbers);       // ✓ Number super Integer`,
          lang: 'java',
          quiz: {
            question: 'What does Java\'s Type Erasure mean for generics at runtime?',
            options: [
              'Generic types are strictly enforced at runtime via reflection, causing ClassCastException',
              'All generic type parameters are removed at runtime — List<String> and List<Integer> become just List. Type information exists only at compile time.',
              'Type erasure means generics only work with primitive types',
              'Type parameters are stored in the class file metadata and accessible via Class.getGenericType()',
            ],
            correct: 1,
            explanation: 'Java implements generics through erasure for backward compatibility with pre-generics code. The compiler checks types at compile time, inserts casts where needed, then removes all generic type info. At runtime, there is no difference between List<String> and List<Integer>—both are just List. This is why `instanceof List<String>` is illegal (can\'t check erased type), and creating generic arrays like `new T[]` is not allowed.',
          },
        },
      ],
    },
    /* ════════════════════════════════════════════════════════
       MODULE 3: Collections Framework
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m3',
      title: 'Module 3 — Collections Framework & HashMap Internals',
      topics: [
        {
          id: 'java-hashmap',
          title: 'HashMap Internals, Collision, Load Factor & ConcurrentHashMap',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `HashMap is the single most-tested Java data structure in placement interviews.

Internal Structure:
• An array of "buckets" (Node[] table). Default initial capacity: 16.
• Each bucket holds a singly-linked list (Node chain) of key-value Entry nodes.
• put(key, value) algorithm:
  1. hashCode() called on key → bitwise spread to distribute → bucket index = hash & (n-1)
  2. If bucket empty → new Node.
  3. If bucket has chain → traverse chain, compare key with equals(). Update if found, else append.
  4. Java 8+: if chain length > 8 AND table size >= 64 → treeify to Red-Black Tree (O(log n) vs O(n)).

Load Factor (default 0.75):
When entries fill 75% of capacity → resize to double (rehash ALL entries).
Trade-off: Lower LF → fewer collisions, more memory. Higher LF → more collisions, less memory.

Null handling: HashMap allows ONE null key (stored in bucket 0) and multiple null values.

Thread Safety: HashMap is NOT thread-safe. In concurrent code:
• ConcurrentHashMap (Java 8): Segment-level locking (Java 7) → CAS + synchronized at bucket level. NO null keys/values. read is lock-free.
• Collections.synchronizedMap(map): wraps entire map in synchronized — coarse lock, slower.
• Hashtable (legacy): All methods synchronized. Deprecated. Do not use.

LinkedHashMap: Maintains insertion order (doubly-linked list). O(1) get/put.
TreeMap: Red-Black Tree. Keys sorted (natural or Comparator). O(log n) operations.`,
          native: {
            Hinglish: `HashMap ek bada array hai jisme buckets hote hain. Key ka hashCode() nikala, bucket decide hota hai. Agar do keys ek bucket pe aayein (collision), toh chain banti hai. Java 8 mein agar chain 8 se zyada lambi ho toh tree ban jaata hai — searching fast ho jaati hai. Load factor 0.75 ka matlab hai jab 75% buckets bharo, tab size double ho jaata hai. ConcurrentHashMap thread-safe version hai — ek bucket lock pe ek hi thread kaam karta hai, pura map lock nahi hota.`,
            Hindi: `HashMap में buckets होते हैं। hashCode() से bucket निर्धारित होता है। Collision पर chain बनती है। Java 8 में chain > 8 पर Red-Black Tree बनता है। ConcurrentHashMap thread-safe है।`,
            Tamil: `HashMap-ல் buckets இருக்கின்றன. hashCode() bucket-ஐ தீர்மானிக்கிறது. Collision-ல் chain உருவாகும். Java 8-ல் chain > 8 ஆனால் Red-Black Tree. ConcurrentHashMap thread-safe.`,
            Telugu: `HashMap లో buckets ఉంటాయి. hashCode() bucket నిర్ణయిస్తుంది. Collision లో chain తయారవుతుంది. Java 8 లో chain > 8 అయితే Red-Black Tree. ConcurrentHashMap thread-safe.`,
          },
          code: `import java.util.*;
import java.util.concurrent.*;

// ─── HashMap internals demo ───────────────────────────────
Map<String, Integer> scores = new HashMap<>(16, 0.75f);

// put: hash("Rahul") → bucket → store
scores.put("Rahul",  95);
scores.put("Ananya", 87);
scores.put("Priya",  92);
scores.put(null, 0);       // ONE null key allowed in bucket 0

// get: hash("Rahul") → bucket → equals() chain walk → value
System.out.println(scores.get("Rahul")); // 95

// ─── Iteration methods ───────────────────────────────────
scores.forEach((k, v) -> System.out.println(k + " → " + v));

scores.entrySet().stream()
    .sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
    .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));

// ─── Merge & Compute (Java 8) ─────────────────────────────
Map<String, Integer> wordCount = new HashMap<>();
String[] words = {"java", "is", "java", "fun"};
for (String w : words) {
    wordCount.merge(w, 1, Integer::sum);
}
// {java=2, is=1, fun=1}

// getOrDefault, putIfAbsent
scores.getOrDefault("Unknown", 0); // 0
scores.putIfAbsent("Rahul", 100);  // no change — already exists

// ─── ConcurrentHashMap ───────────────────────────────────
ConcurrentHashMap<String, Integer> concurrent = new ConcurrentHashMap<>();
concurrent.put("A", 1); // thread-safe put
concurrent.computeIfAbsent("B", k -> k.length()); // atomic compute

// ─── LinkedHashMap (insertion order) ─────────────────────
Map<String, Integer> linked = new LinkedHashMap<>();
linked.put("C", 3); linked.put("A", 1); linked.put("B", 2);
System.out.println(linked.keySet()); // [C, A, B] — insertion order

// ─── TreeMap (sorted) ────────────────────────────────────
Map<String, Integer> sorted = new TreeMap<>(Comparator.reverseOrder());
sorted.putAll(linked);
System.out.println(sorted.keySet()); // [C, B, A] — sorted desc`,
          lang: 'java',
          quiz: {
            question: 'In Java 8+, what happens when a HashMap bucket\'s collision chain exceeds 8 entries?',
            options: [
              'HashMap throws ConcurrentModificationException to signal too many collisions',
              'The bucket\'s LinkedList is converted to a Red-Black Tree (if table size ≥ 64), reducing worst-case lookup from O(n) to O(log n)',
              'HashMap immediately doubles its capacity and rehashes all entries',
              'The oldest entries in the chain are evicted to maintain the chain at 8',
            ],
            correct: 1,
            explanation: 'Java 8 introduced treeification: when a single bucket accumulates more than 8 entries AND the overall table size is at least 64, the linked list is converted to a Red-Black Tree. This changes lookup from O(n) — worst case with a bad hash function causing all keys to collide — to O(log n). If the table is smaller than 64, HashMap resizes instead of treeifying.',
          },
        },
        {
          id: 'java-collections-choose',
          title: 'Choosing the Right Collection: List, Set, Queue, Map',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `The Java Collections Framework hierarchy:

Iterable ← Collection ← List, Set, Queue
Map (separate hierarchy)

LIST (ordered, indexed, duplicates allowed):
• ArrayList: backed by Object[]. get(i) O(1). add(middle) O(n). Best for: frequent random access, rare inserts at middle.
• LinkedList: doubly-linked. get(i) O(n). add/remove at ends O(1). Implements Deque. Best for: frequent inserts/removes at ends, queue/stack usage.
• Vector (legacy): like ArrayList but synchronized. Replaced by ArrayList + Collections.synchronizedList.
• CopyOnWriteArrayList: thread-safe. Copies array on every write. Best for: read-heavy concurrent lists.

SET (no duplicates, uses equals() + hashCode()):
• HashSet: backed by HashMap. O(1) add/contains/remove. No order.
• LinkedHashSet: HashSet + insertion order. Slightly slower but predictable.
• TreeSet: Red-Black Tree. O(log n). Elements sorted (natural or Comparator). No null.
• EnumSet: highly efficient set for enum constants. Uses bit vector internally.

QUEUE / DEQUE:
• PriorityQueue: Min-heap. Lowest element removed first. O(log n) add/poll. NOT thread-safe.
• ArrayDeque: Stack + Queue. Faster than Stack class. No null.
• BlockingQueue (LinkedBlockingQueue, ArrayBlockingQueue): Thread-safe. Used in producer-consumer.

MAP:
• HashMap: best general-purpose. O(1) average.
• LinkedHashMap: insertion/access order. O(1).
• TreeMap: sorted keys. O(log n).
• ConcurrentHashMap: thread-safe high-performance. O(1).
• EnumMap: keys must be enum. Uses array internally. O(1).`,
          native: {
            Hinglish: `Collection choose karna bahut important hai. Agar order chahiye aur random access chahiye → ArrayList. Agar dono ends se quickly add/remove karna ho → LinkedList ya ArrayDeque. Agar duplicates nahi chahiye → HashSet ya TreeSet (sorted). Agar key-value mapping chahiye → HashMap. Agar sorted mapping chahiye → TreeMap. Thread-safe → ConcurrentHashMap.`,
            Hindi: `ArrayList random access के लिए। LinkedList दोनों सिरों पर add/remove के लिए। HashSet duplicates न हों। TreeSet sorted। HashMap key-value। ConcurrentHashMap thread-safe।`,
            Tamil: `ArrayList random access-க்கு. LinkedList இரு முனைகளிலும் add/remove-க்கு. HashSet duplicates தவிர்க்க. TreeMap sorted mapping-க்கு.`,
            Telugu: `ArrayList random access కోసం. LinkedList రెండు చివరలలో add/remove కోసం. HashSet duplicates కోసం. TreeMap sorted mapping కోసం.`,
          },
          code: `import java.util.*;
import java.util.concurrent.*;

// ─── When to use which? ──────────────────────────────────

// ✓ ArrayList — random access, rare insertions
List<String> names = new ArrayList<>();
names.add("Rahul"); names.add("Priya"); names.add("Amit");
names.get(1);              // O(1) ✓
names.remove(0);           // O(n) — shifts elements

// ✓ LinkedList as Queue / Deque
Deque<String> tasks = new LinkedList<>();
tasks.offerFirst("URGENT"); // add to front
tasks.offerLast("normal");  // add to back
String next = tasks.pollFirst(); // remove from front O(1) ✓

// ✓ ArrayDeque (faster than LinkedList for stack/queue)
ArrayDeque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.push(2); // push = addFirst
stack.pop();                   // pop = removeFirst → 2

// ✓ HashSet — uniqueness constraint
Set<String> seen = new HashSet<>();
for (String s : new String[]{"a","b","a","c","b"}) {
    seen.add(s); // duplicates ignored
}
System.out.println(seen); // [a, b, c] (no order guarantee)

// ✓ TreeSet — sorted unique elements
TreeSet<Integer> sorted = new TreeSet<>();
sorted.addAll(List.of(5,1,3,2,4));
System.out.println(sorted.first()); // 1
System.out.println(sorted.last());  // 5
System.out.println(sorted.headSet(4)); // [1, 2, 3]

// ✓ PriorityQueue — min-heap (next exam by urgency)
PriorityQueue<int[]> pq = new PriorityQueue<>(
    Comparator.comparingInt(a -> a[1]) // sort by priority
);
pq.offer(new int[]{1, 3}); // task 1, priority 3
pq.offer(new int[]{2, 1}); // task 2, priority 1 (highest)
pq.poll(); // returns task 2 (lowest priority number = most urgent)`,
          lang: 'java',
          quiz: {
            question: 'You need a data structure that: stores student records sorted by marks, has no duplicates, and O(log n) operations. Which Java collection fits best?',
            options: [
              'ArrayList with Collections.sort() after each insert',
              'TreeSet with a custom Comparator — provides sorted, no-duplicate storage with O(log n) add/contains/remove',
              'LinkedHashSet — it maintains order and prevents duplicates',
              'PriorityQueue — it sorts elements automatically',
            ],
            correct: 1,
            explanation: 'TreeSet is backed by a Red-Black Tree, providing O(log n) add/remove/contains, automatic sorting (natural order or custom Comparator), and duplicate rejection via equals(). LinkedHashSet maintains insertion order (not sorted). PriorityQueue is a heap — sorting only applies to peek/poll operations, not iteration order. ArrayList would require O(n log n) sort after each insert.',
          },
        },
        {
          id: 'java-streams',
          title: 'Java 8 Streams API — map, filter, reduce, collectors',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `The Streams API (Java 8+) enables functional-style data processing pipelines on collections.

Stream = a sequence of elements supporting sequential/parallel aggregate operations.
Streams are LAZY — intermediate operations are not evaluated until a terminal operation is called.
Streams are SINGLE-USE — once consumed, cannot be reused.

Creating Streams:
• Collection.stream(), Collection.parallelStream()
• Stream.of(a, b, c), Arrays.stream(arr)
• Stream.iterate(0, n -> n + 2), Stream.generate(Math::random)
• IntStream.range(0, 10), IntStream.rangeClosed(1, 10)

Intermediate Operations (lazy, return Stream):
• filter(Predicate) — keep elements matching condition
• map(Function) — transform each element
• flatMap(Function<T, Stream<R>>) — flatten nested streams
• sorted(Comparator) — sort elements
• distinct() — remove duplicates
• limit(n) / skip(n) — pagination
• peek(Consumer) — debug side effect (don't use in production logic)

Terminal Operations (eager, trigger evaluation):
• forEach(Consumer) — iterate
• collect(Collector) — gather into List, Set, Map, String
• count(), sum(), min(), max(), average() — aggregation
• findFirst(), findAny() — short-circuit
• anyMatch(), allMatch(), noneMatch() — boolean checks
• reduce(identity, BinaryOperator) — fold

Collectors: Collectors.toList(), toSet(), toMap(), joining(), groupingBy(), partitioningBy(), counting(), summingInt().`,
          native: {
            Hinglish: `Streams ek assembly line ki tarah hai — data ek end se enter karta hai, filter hota hai, transform hota hai, aur doosre end se result nikalti hai. Lazy evaluation matlab jab tak terminal operation nahi aata, kuch nahi hota. flatMap nested lists ko ek flat list bana deta hai — jaise boxes ke andar boxes ko ek hi bade box mein dalna. groupingBy ek map bana deta hai jahan key ek category hai.`,
            Hindi: `Streams एक pipeline है। Lazy evaluation: terminal operation तक कुछ execute नहीं होता। map: transform करता है। filter: रखता है। collect: result इकट्ठा करता है।`,
            Tamil: `Streams ஒரு pipeline. Lazy evaluation: terminal operation வரை execute ஆகாது. map: transform செய்கிறது. filter: வடிகட்டுகிறது. collect: result சேர்க்கிறது.`,
            Telugu: `Streams ఒక pipeline. Lazy evaluation: terminal operation వరకు execute కాదు. map: transform చేస్తుంది. filter: వడపోస్తుంది. collect: result సేకరిస్తుంది.`,
          },
          code: `import java.util.*;
import java.util.stream.*;

List<Student> students = List.of(
    new Student("Rahul",  "Java",  88),
    new Student("Priya",  "React", 95),
    new Student("Amit",   "Java",  72),
    new Student("Ananya", "SQL",   91),
    new Student("Rohit",  "React", 85)
);

// ─── filter + map + collect ───────────────────────────────
List<String> topJavaStudents = students.stream()
    .filter(s -> s.track().equals("Java"))
    .filter(s -> s.score() >= 80)
    .map(Student::name)
    .sorted()
    .collect(Collectors.toList());
// ["Rahul"]

// ─── groupingBy ───────────────────────────────────────────
Map<String, List<Student>> byTrack = students.stream()
    .collect(Collectors.groupingBy(Student::track));

Map<String, Long> countByTrack = students.stream()
    .collect(Collectors.groupingBy(Student::track, Collectors.counting()));
// {Java=2, React=2, SQL=1}

Map<String, Double> avgScoreByTrack = students.stream()
    .collect(Collectors.groupingBy(Student::track,
             Collectors.averagingInt(Student::score)));

// ─── flatMap ──────────────────────────────────────────────
List<List<Integer>> nested = List.of(List.of(1,2,3), List.of(4,5), List.of(6));
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5, 6]

// ─── reduce ──────────────────────────────────────────────
int totalScore = students.stream()
    .mapToInt(Student::score)
    .sum(); // 431

OptionalInt max = students.stream().mapToInt(Student::score).max();

// ─── Collectors.joining ───────────────────────────────────
String csv = students.stream()
    .map(Student::name)
    .collect(Collectors.joining(", ", "[", "]"));
// [Rahul, Priya, Amit, Ananya, Rohit]

// ─── partitioningBy ──────────────────────────────────────
Map<Boolean, List<Student>> partition = students.stream()
    .collect(Collectors.partitioningBy(s -> s.score() >= 90));
// true=[Priya, Ananya], false=[Rahul, Amit, Rohit]`,
          lang: 'java',
          quiz: {
            question: 'What does `flatMap` do differently from `map` in Java Streams?',
            options: [
              'flatMap is faster than map because it processes in parallel',
              'map transforms each element to one element. flatMap transforms each element to a Stream and then flattens all streams into a single stream. Used for nested collections.',
              'flatMap removes null elements while mapping. map does not.',
              'flatMap applies the function only to elements passing a filter. map applies to all.',
            ],
            correct: 1,
            explanation: 'map is a 1-to-1 transformation. flatMap is a 1-to-many then flatten operation. Example: if each student has a List<String> of skills, map would give Stream<List<String>> (stream of lists). flatMap gives Stream<String> (all skills flattened into one stream). It\'s essential for working with nested collections, Optional chains, and splitting sentences into words.',
          },
        },
      ],
    },
    /* ════════════════════════════════════════════════════════
       MODULE 4: Multithreading & Concurrency
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m4',
      title: 'Module 4 — Multithreading & Concurrency',
      topics: [
        {
          id: 'java-threads-basics',
          title: 'Thread Lifecycle, ExecutorService & Thread Pools',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Multithreading enables concurrent execution. Understanding it is critical for senior Java roles.

Thread Lifecycle States:
NEW → (start()) → RUNNABLE → (CPU scheduler) → RUNNING → BLOCKED/WAITING/TIMED_WAITING → TERMINATED

Creating Threads (3 ways):
1. Extend Thread class — tight coupling, wastes a thread object per task.
2. Implement Runnable — decouples task from thread. Preferred for tasks without return value.
3. Implement Callable<T> — like Runnable but returns value and can throw checked exceptions.

Thread Pool (ExecutorService): Creating raw threads is expensive (~1MB per thread stack).
Thread pools reuse a fixed worker thread set. Tasks go into a queue.

Factory methods (Executors):
• newFixedThreadPool(n): exactly n threads. Unbounded queue. Best for CPU-bound tasks.
• newCachedThreadPool(): grows dynamically; reuses idle threads (60s TTL). Best for many short tasks.
• newSingleThreadExecutor(): 1 thread. Sequential. Best for ordered tasks.
• newScheduledThreadPool(n): delayed or periodic tasks. Like cron.
• ForkJoinPool (Java 7+): work-stealing. Best for divide-and-conquer parallel tasks.

CompletableFuture (Java 8): Non-blocking async pipelines.
Chain: supplyAsync → thenApply → thenAccept → exceptionally → thenCombine.`,
          native: {
            Hinglish: `Thread ek mini-program hai. Thread pool ek shared team hai — ek project ke liye baar baar naye log hire nahi karte. ExecutorService thread pool manage karta hai. Callable Runnable se behtar hai jab task ka result chahiye. CompletableFuture non-blocking chain hai — kaam shuru karo, chain mein next step likho, jab result aaye tab automatically next step chalegi.`,
            Hindi: `Thread Pool threads को reuse करता है। ExecutorService pool manage करता है। Callable result return करता है। CompletableFuture non-blocking async chain है।`,
            Tamil: `Thread Pool threads-ஐ reuse செய்கிறது. ExecutorService pool manage செய்கிறது. Callable result return செய்கிறது. CompletableFuture non-blocking async chain.`,
            Telugu: `Thread Pool threads ని reuse చేస్తుంది. ExecutorService pool manage చేస్తుంది. Callable result return చేస్తుంది. CompletableFuture non-blocking async chain.`,
          },
          code: `import java.util.concurrent.*;

// ─── Raw Thread (avoid in production) ─────────────────────
Thread t = new Thread(() -> System.out.println("Hello from thread"));
t.start();

// ─── ExecutorService (recommended) ───────────────────────
ExecutorService pool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors() // use CPU count
);

// Submit Runnable (fire and forget)
pool.submit(() -> System.out.println("Task 1: " + Thread.currentThread().getName()));

// Submit Callable (returns Future<T>)
Future<String> future = pool.submit(() -> {
    Thread.sleep(200); // simulate DB query
    return "User: Rahul";
});

try {
    String result = future.get(500, TimeUnit.MILLISECONDS); // blocks with timeout
    System.out.println(result);
} catch (TimeoutException e) {
    System.out.println("Query timed out!");
    future.cancel(true);
}

// Always shut down gracefully
pool.shutdown();
pool.awaitTermination(5, TimeUnit.SECONDS);

// ─── CompletableFuture Pipeline ───────────────────────────
CompletableFuture<String> greeting = CompletableFuture
    .supplyAsync(() -> fetchUser(42))             // runs async
    .thenApply(user -> "Hello, " + user.name())   // transform (stays async)
    .thenApply(String::toUpperCase)
    .exceptionally(ex -> "Error: " + ex.getMessage()); // error handling

greeting.thenAccept(System.out::println).join(); // wait for completion

// ─── Combining multiple async tasks ──────────────────────
CompletableFuture<String> task1 = CompletableFuture.supplyAsync(() -> "Data from DB");
CompletableFuture<String> task2 = CompletableFuture.supplyAsync(() -> "Data from API");

CompletableFuture<String> combined = task1.thenCombine(task2,
    (db, api) -> db + " + " + api);

// Wait for ALL:
CompletableFuture.allOf(task1, task2).join();`,
          lang: 'java',
          quiz: {
            question: 'Why is `Executors.newFixedThreadPool(n)` preferred over creating `new Thread()` for each task?',
            options: [
              'new Thread() is deprecated and throws UnsupportedOperationException in Java 17+',
              'Creating a new OS thread per task is expensive (~1MB stack). A fixed pool creates n threads once and reuses them via a queue — preventing thread explosion, controlling concurrency, and reducing GC pressure.',
              'Thread pools automatically handle synchronization between threads',
              'new Thread() cannot run Callable tasks, only Runnable',
            ],
            correct: 1,
            explanation: 'Each OS thread has significant overhead: ~1MB default stack size, OS scheduling cost, and creation latency. For 10,000 concurrent requests using raw threads, the JVM would allocate ~10GB of stack space and crash. A FixedThreadPool creates exactly n threads (typically CPU core count for CPU-bound work, or more for I/O-bound), queues tasks, and reuses threads — giving controlled concurrency, bounded memory, and dramatically better throughput.',
          },
        },
        {
          id: 'java-synchronization',
          title: 'synchronized, ReentrantLock, volatile, Atomic Classes',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Thread Safety: when multiple threads access shared data concurrently, race conditions can corrupt state.

Race Condition: Two threads read-modify-write without proper synchronization. Classic: counter++ is NOT atomic (3 operations: read, increment, write).

synchronized keyword (intrinsic/monitor lock):
• synchronized method: locks on the current object (this). Only one thread in synchronized method at a time.
• synchronized(object) block: finer-grained. Lock on specific object.
• static synchronized: locks on the Class object.
• Built-in but limited: no timeout, no try-lock, no fairness, no read/write distinction.

ReentrantLock (java.util.concurrent.locks):
• Explicit lock/unlock. Must use try-finally to ensure unlock.
• tryLock(timeout): attempt lock with timeout — avoids indefinite blocking.
• lockInterruptibly(): thread can be interrupted while waiting.
• Fairness mode (new ReentrantLock(true)): threads acquire lock in order of waiting.
• ReadWriteLock: multiple simultaneous readers, exclusive writer.

volatile keyword:
• Guarantees visibility: write to volatile variable is immediately visible to all threads (no CPU cache).
• Does NOT guarantee atomicity. counter++ on volatile is still a race condition.
• Use for: flags (running = false to stop a thread), double-checked locking with Singleton.

Atomic Classes (java.util.concurrent.atomic): Lock-free thread safety using CAS (Compare-And-Swap).
• AtomicInteger, AtomicLong, AtomicBoolean, AtomicReference
• CAS: "Set value to V only if current value is expectedV" — hardware-level atomic.
• incrementAndGet(), compareAndSet(), getAndAdd()`,
          native: {
            Hinglish: `Race condition tab hoti hai jab do threads ek hi data ek saath change karte hain — jaise do cashier ek hi account pe ek saath credit/debit karte hain. synchronized matlab sirf ek thread andar jaayega — jaise ATM ka room ek time pe ek hi insaan ke liye. volatile sirf visibility guarantee karta hai — CPU cache bypass. Atomic classes lock-free hain — hardware pe CAS instruction use karte hain, synchronized se fast.`,
            Hindi: `Race condition: दो threads एक साथ shared data बदलते हैं। synchronized: एक समय पर एक thread। volatile: visibility guarantee। Atomic: lock-free CAS।`,
            Tamil: `Race condition: இரண்டு threads ஒரே data-ஐ மாற்றும். synchronized: ஒரு நேரத்தில் ஒரு thread. volatile: visibility guarantee. Atomic: lock-free CAS.`,
            Telugu: `Race condition: రెండు threads ఒకే data మార్చడం. synchronized: ఒక్క thread ఒకే సమయంలో. volatile: visibility guarantee. Atomic: lock-free CAS.`,
          },
          code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.*;

// ─── Race Condition (BROKEN) ──────────────────────────────
class BrokenCounter {
    int count = 0;
    void increment() { count++; } // read + increment + write = NOT atomic
}

// ─── synchronized (simple, coarse-grained) ───────────────
class SynchronizedCounter {
    private int count = 0;

    public synchronized void increment() { count++; }
    public synchronized int get()        { return count; }
}

// ─── ReentrantLock (fine-grained control) ─────────────────
class LockCounter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock(true); // fair

    public void increment() {
        lock.lock();
        try   { count++; }
        finally { lock.unlock(); } // ALWAYS in finally
    }

    public boolean tryIncrement() {
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try   { count++; return true; }
                finally { lock.unlock(); }
            }
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        return false; // timed out
    }
}

// ─── ReadWriteLock — concurrent reads, exclusive write ───
ReadWriteLock rwLock = new ReentrantReadWriteLock();
// Multiple threads can hold readLock simultaneously
rwLock.readLock().lock();  // ... read shared cache ...
rwLock.readLock().unlock();

// Only one thread can hold writeLock (blocks all readers)
rwLock.writeLock().lock(); // ... update cache ...
rwLock.writeLock().unlock();

// ─── Atomic (fastest, lock-free) ─────────────────────────
AtomicInteger atomicCounter = new AtomicInteger(0);
atomicCounter.incrementAndGet(); // atomic, no lock
atomicCounter.compareAndSet(1, 2); // set to 2 only if current is 1

// ─── volatile (visibility only) ──────────────────────────
class Service {
    private volatile boolean running = true; // visible to all threads
    void stop() { running = false; }
    void run()  { while (running) { /* work */ } }
}`,
          lang: 'java',
          quiz: {
            question: 'A `volatile` variable is shared between threads. Does declaring it `volatile` make `counter++` thread-safe?',
            options: [
              'Yes — volatile ensures all thread operations on the variable are atomic',
              'No — volatile only guarantees visibility (no CPU cache). counter++ is 3 non-atomic operations (read, increment, write). Two threads can still race. Use AtomicInteger or synchronized instead.',
              'Yes — the JVM optimises volatile increments to use CAS internally',
              'No — volatile is only for boolean flags, not numeric types',
            ],
            correct: 1,
            explanation: '`volatile` solves the visibility problem (threads see each other\'s writes immediately, bypassing CPU caches) but NOT the atomicity problem. `counter++` decompiles to: (1) read current value, (2) add 1, (3) write new value — three separate instructions. Two threads can both read the same value before either writes back, causing a lost update. Use `AtomicInteger.incrementAndGet()` (CAS-based, lock-free) or `synchronized` for atomic counter operations.',
          },
        },
      ],
    },
    /* ════════════════════════════════════════════════════════
       MODULE 5: Modern Java (8 to 21)
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m5',
      title: 'Module 5 — Modern Java 8 to 21',
      topics: [
        {
          id: 'java-modern',
          title: 'Lambdas, Optional, Records, Sealed Classes, Pattern Matching',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Modern Java (8–21) significantly reduced boilerplate and improved expressiveness.

Lambda Expressions (Java 8): Anonymous functions. Syntax: (params) -> expression or (params) -> { body; }
Require a Functional Interface context.
Method References: shorthand for lambdas that just call a method.
  • Class::staticMethod, instance::method, Class::instanceMethod, Class::new

Optional<T> (Java 8): Wrapper to explicitly represent nullable values. Eliminates NullPointerException.
• Optional.of(value) — non-null value. Throws NullPointerException if null.
• Optional.ofNullable(value) — may be null.
• Optional.empty() — empty optional.
• .isPresent(), .get(), .orElse(default), .orElseGet(supplier), .orElseThrow()
• .map(fn), .flatMap(fn), .filter(predicate)

Records (Java 16): Concise immutable data classes. Auto-generates: constructor, getters, equals, hashCode, toString.
record Point(int x, int y) {} — Point p = new Point(3, 4); p.x(); p.y();
Cannot extend other classes. Can implement interfaces. Can add custom methods.

Sealed Classes (Java 17): Restricts which classes can extend/implement a type.
sealed interface Shape permits Circle, Rectangle, Triangle {}
Enables exhaustive pattern matching in switch.

Pattern Matching (Java 21 preview):
• instanceof pattern: if (obj instanceof String s) { s.length(); } — no explicit cast needed.
• switch expressions with patterns and guards.
• Deconstruction patterns for records.`,
          native: {
            Hinglish: `Lambda matlab anonymous function — ek hi line mein function pass karo. Optional NullPointerException se bachata hai — null handle karna mandatory ho jaata hai. Record ek clean data class hai — sirf fields likho, Java baaki sab (constructor, getters, equals) automatically bana deta hai. Sealed class restrict karta hai koi subclass na banaye — type safety badhaata hai.`,
            Hindi: `Lambda anonymous function है। Optional NullPointerException से बचाता है। Record immutable data class है — boilerplate-free। Sealed class subclassing restrict करती है।`,
            Tamil: `Lambda anonymous function. Optional NullPointerException-ஐ தவிர்க்கிறது. Record immutable data class. Sealed class subclassing-ஐ restrict செய்கிறது.`,
            Telugu: `Lambda anonymous function. Optional NullPointerException నుండి రక్షిస్తుంది. Record immutable data class. Sealed class subclassing restrict చేస్తుంది.`,
          },
          code: `// ─── Lambdas & Method References ─────────────────────────
List<String> names = List.of("Rahul", "Priya", "Amit", "Zara");

// Lambda
names.stream().filter(n -> n.startsWith("R")).forEach(System.out::println);

// Method references
Comparator<String> byLength = Comparator.comparingInt(String::length);
names.stream().sorted(byLength).forEach(System.out::println);

// ─── Optional — fluent null handling ─────────────────────
public Optional<User> findUser(String email) {
    return Optional.ofNullable(userRepository.findByEmail(email));
}

// Chained without null checks:
String city = findUser("rahul@email.com")
    .map(User::getAddress)
    .map(Address::getCity)
    .orElse("City Unknown");

// ─── Records (Java 16+) ──────────────────────────────────
record Student(String name, String track, int score) {
    // Compact constructor with validation
    Student {
        if (score < 0 || score > 100)
            throw new IllegalArgumentException("Score out of range: " + score);
        name = name.trim();
    }

    // Custom method
    public boolean isPassing() { return score >= 60; }

    // Override toString (though auto-generated too)
    @Override public String toString() {
        return name + " [" + track + "]: " + score + "%";
    }
}

Student s = new Student("Rahul", "Java", 88);
System.out.println(s.name());     // "Rahul"
System.out.println(s.isPassing()); // true
System.out.println(s);            // Rahul [Java]: 88%

// ─── Sealed Classes + Pattern Matching ───────────────────
sealed interface Result<T> permits Result.Ok, Result.Err {
    record Ok<T>(T value)       implements Result<T> {}
    record Err<T>(String error) implements Result<T> {}
}

Result<Integer> r = fetchScore();

// Pattern matching switch (Java 21)
String message = switch (r) {
    case Result.Ok<Integer> ok  -> "Score: " + ok.value();
    case Result.Err<Integer> err -> "Failed: " + err.error();
};`,
          lang: 'java',
          quiz: {
            question: 'What is the primary purpose of `Optional<T>` in Java and when should you use it?',
            options: [
              'Optional is used for thread-safe nullable field access in concurrent code',
              'Optional explicitly represents a potentially absent value, forcing callers to handle the null case and eliminating NullPointerExceptions. Use as return type for methods that might return null — not as parameter type or field type.',
              'Optional caches the wrapped value to prevent repeated database calls',
              'Optional replaces the need for try-catch blocks when dealing with null values',
            ],
            correct: 1,
            explanation: 'Optional is a container that explicitly signals "this method might not return a value." It makes null absence part of the API contract, forcing callers to handle both cases with `.orElse()`, `.map()`, etc. Guideline: use Optional as return types only (not as field types — serialization issues; not as parameter types — caller-side confusion). It chains beautifully with Stream-like operations for null-safe transformation pipelines.',
          },
        },
      ],
    },
    /* ════════════════════════════════════════════════════════
       MODULE 6: JDBC, Hibernate & Spring Boot
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m6',
      title: 'Module 6 — JDBC, Hibernate & Spring Boot',
      topics: [
        {
          id: 'java-jdbc',
          title: 'JDBC, HikariCP Connection Pool & Transactions',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `JDBC (Java Database Connectivity) is the standard API for relational database access from Java.

JDBC Flow:
1. Load driver (automatic in Java 6+ via ServiceLoader).
2. Get connection: DriverManager.getConnection(url, user, pass).
3. Create Statement or PreparedStatement.
4. Execute query.
5. Process ResultSet.
6. Close resources (always in finally or try-with-resources).

PreparedStatement vs Statement:
• PreparedStatement: SQL precompiled. Parameterised. PREVENTS SQL INJECTION. Use always.
• Statement: raw SQL. Never use with user input.

Connection Pooling (HikariCP): Creating a DB connection is expensive (~30-100ms). Pools maintain a set of ready connections.
HikariCP is the fastest, most widely used pool (used by Spring Boot by default).
Key configs: maximumPoolSize, minimumIdle, connectionTimeout, idleTimeout, maxLifetime.

Transactions: Ensure ACID properties.
• connection.setAutoCommit(false) → execute DML → connection.commit() or connection.rollback().
• Isolation levels: READ_UNCOMMITTED, READ_COMMITTED (default in most DBs), REPEATABLE_READ, SERIALIZABLE.
• Phenomena: Dirty Read, Non-Repeatable Read, Phantom Read.`,
          native: {
            Hinglish: `JDBC Java aur database ke beech ka bridge hai. PreparedStatement hamesha use karo — SQL injection se bachata hai. HikariCP connection pool hai — jaise taxi stand pe gaadiyaan ready hoti hain, har baar nai gaadi book nahi karte. Transaction matlab sab operations ek saath commit honge ya sab rollback honge — atomicity ensure karna.`,
            Hindi: `JDBC Java-Database bridge है। PreparedStatement SQL injection से बचाता है। HikariCP connection pool है। Transaction ACID properties ensure करता है।`,
            Tamil: `JDBC Java-Database bridge. PreparedStatement SQL injection-ஐ தவிர்க்கிறது. HikariCP connection pool. Transaction ACID properties உறுதி செய்கிறது.`,
            Telugu: `JDBC Java-Database bridge. PreparedStatement SQL injection నుండి రక్షిస్తుంది. HikariCP connection pool. Transaction ACID properties నిర్ధారిస్తుంది.`,
          },
          code: `import java.sql.*;
import com.zaxxer.hikari.*;

// ─── HikariCP Configuration ───────────────────────────────
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/placement_db");
config.setUsername("root");
config.setPassword("secret");
config.setMaximumPoolSize(10);         // max connections in pool
config.setMinimumIdle(2);             // keep 2 ready connections
config.setConnectionTimeout(3_000);   // 3s to get a connection
config.setIdleTimeout(600_000);       // remove idle after 10 min
config.setMaxLifetime(1_800_000);     // recycle connection after 30 min
HikariDataSource ds = new HikariDataSource(config);

// ─── PreparedStatement (SQL Injection safe) ───────────────
String sql = "SELECT id, name, score FROM students WHERE track = ? AND score >= ?";

try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setString(1, "Java");
    ps.setInt(2, 80);

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            int    id    = rs.getInt("id");
            String name  = rs.getString("name");
            int    score = rs.getInt("score");
            System.out.printf("%-3d %-15s %d%n", id, name, score);
        }
    }
} // auto-closed: connection returned to pool

// ─── Transaction Management ──────────────────────────────
public void transferScore(int fromId, int toId, int points) {
    try (Connection conn = ds.getConnection()) {
        conn.setAutoCommit(false); // START TRANSACTION
        try {
            PreparedStatement debit = conn.prepareStatement(
                "UPDATE students SET score = score - ? WHERE id = ?");
            debit.setInt(1, points); debit.setInt(2, fromId);
            debit.executeUpdate();

            PreparedStatement credit = conn.prepareStatement(
                "UPDATE students SET score = score + ? WHERE id = ?");
            credit.setInt(1, points); credit.setInt(2, toId);
            credit.executeUpdate();

            conn.commit();  // All success → commit
        } catch (SQLException e) {
            conn.rollback(); // Any failure → rollback
            throw new RuntimeException("Transfer failed", e);
        }
    }
}`,
          lang: 'java',
          quiz: {
            question: 'Why should you always use `PreparedStatement` instead of `Statement` for user-provided input in JDBC?',
            options: [
              'PreparedStatement is faster only for numeric parameters — use Statement for strings',
              'PreparedStatement parameterises the query (? placeholders): SQL is compiled once, user input is treated as pure data (not executable SQL), completely preventing SQL Injection attacks and improving performance via plan caching.',
              'Statement is deprecated since Java 11 and throws SqlDeprecatedException',
              'PreparedStatement automatically commits transactions while Statement requires manual commit',
            ],
            correct: 1,
            explanation: 'SQL Injection is one of the most critical security vulnerabilities. If you concatenate user input into a Statement: `"SELECT * FROM users WHERE name = \'" + userName + "\'"`, a malicious user can input `\' OR \'1\'=\'1` to bypass authentication. PreparedStatement separates SQL structure from data — the `?` placeholder is precompiled by the DB engine. User input is then bound as escaped, typed data, making injection impossible. Additionally, PreparedStatement allows the DB to reuse the query execution plan, improving performance for repeated queries.',
          },
        },
        {
          id: 'java-hibernate',
          title: 'Hibernate & JPA — Entity Mapping, N+1, Caching',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Hibernate is the most popular JPA (Java Persistence API) implementation. It maps Java objects to database tables (ORM — Object-Relational Mapping).

Core Annotations:
• @Entity: marks a class as a database entity.
• @Table(name="..."): specify table name.
• @Id: primary key field.
• @GeneratedValue(strategy=IDENTITY|SEQUENCE|AUTO|TABLE): PK generation.
• @Column(name, nullable, unique, length): column constraints.
• @OneToMany, @ManyToOne, @OneToOne, @ManyToMany: relationship mappings.

Fetch Strategies:
• LAZY (default for @OneToMany, @ManyToMany): loads related entities only when accessed. Efficient.
• EAGER (default for @ManyToOne, @OneToOne): loads related entities immediately in same query.

N+1 Select Problem: Most common Hibernate performance bug.
Scenario: fetch 100 students (1 query), then access each student's department (100 more queries) = 101 queries!
FIX: Use JOIN FETCH in JPQL, or @EntityGraph, or Batch fetching.

Caching:
• First-level cache (Session cache): within a Session, same entity ID returns same object. Automatic.
• Second-level cache (EhCache, Caffeine): cross-session. Configure per entity.

HQL/JPQL: Object-oriented query language. Queries entities and fields, not tables and columns.`,
          native: {
            Hinglish: `Hibernate Java objects ko database tables se map karta hai — @Entity likh diya, baaki Hibernate sambhalta hai. Lazy loading matlab related data tab load hoga jab actually use karo. N+1 problem tab hoti hai jab ek query ki response ke baad har object ke liye alag query chalaate ho — JOIN FETCH se ek hi query mein sab aata hai. Cache: first-level session ke andar same object dubara database pe nahi jaata.`,
            Hindi: `Hibernate Java objects को tables से map करता है। Lazy loading: जब use करो तब load। N+1 problem: JOIN FETCH से ठीक करें। Cache: repeated queries को avoid करता है।`,
            Tamil: `Hibernate Java objects-ஐ tables-உடன் map செய்கிறது. Lazy loading: உபயோகிக்கும்போது load. N+1 problem: JOIN FETCH-ஆல் சரி செய்யலாம். Cache: repeated queries-ஐ தவிர்க்கிறது.`,
            Telugu: `Hibernate Java objects ని tables తో map చేస్తుంది. Lazy loading: ఉపయోగించినప్పుడు load. N+1 problem: JOIN FETCH తో fix చేయండి. Cache: repeated queries నివారిస్తుంది.`,
          },
          code: `import javax.persistence.*;
import java.util.*;

// ─── Entity Mapping ──────────────────────────────────────
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)     // LAZY — avoids N+1
    @JoinColumn(name = "dept_id")
    private Department department;

    @OneToMany(mappedBy = "student",
               cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizResult> results = new ArrayList<>();
}

@Entity
@Table(name = "departments")
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private List<Student> students;
}

// ─── N+1 Problem — DO NOT DO THIS ────────────────────────
// Query 1: fetch all students
List<Student> students = em.createQuery("FROM Student", Student.class).getResultList();
// Queries 2..N+1: accessing lazy dept triggers separate query per student!
students.forEach(s -> System.out.println(s.getDepartment().getName())); // 💀 N+1

// ─── FIX: JOIN FETCH ──────────────────────────────────────
List<Student> fixed = em
    .createQuery("SELECT s FROM Student s JOIN FETCH s.department", Student.class)
    .getResultList();
// Single SQL with JOIN — department loaded with students ✓

// ─── Named Query & JPQL ──────────────────────────────────
List<Student> topStudents = em.createQuery(
    "SELECT s FROM Student s WHERE s.department.name = :dept " +
    "AND s.results.size > 0 ORDER BY s.name", Student.class)
    .setParameter("dept", "Engineering")
    .setMaxResults(10)
    .getResultList();`,
          lang: 'java',
          quiz: {
            question: 'What causes the N+1 Select Problem in Hibernate and how do you fix it?',
            options: [
              'Configuring too many EntityManager instances causes extra queries. Fix: use one shared EntityManager.',
              'Loading a collection of entities (1 query) and then accessing a lazy-loaded relationship on each entity (N more queries) for a total of N+1 queries. Fix: use JOIN FETCH in JPQL or @EntityGraph to load relationships in a single query.',
              'N+1 occurs when the same entity is persisted multiple times. Fix: check for duplicate persist() calls.',
              'N+1 is caused by incorrect @GeneratedValue strategy causing extra INSERT statements.',
            ],
            correct: 1,
            explanation: 'Classic N+1: 1 query fetches 100 students, but accessing each student\'s department (LAZY by default) triggers 100 more queries = 101 total. Fix options: (1) JPQL JOIN FETCH: "FROM Student s JOIN FETCH s.department" — one SQL JOIN; (2) @EntityGraph on the repository method specifying attributes to load eagerly; (3) @BatchSize(size=20) to batch load related entities in chunks. The N+1 problem can silently destroy application performance.',
          },
        },
        {
          id: 'java-spring-boot',
          title: 'Spring Boot REST API, Spring Data JPA & Spring Security JWT',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Spring Boot is the industry standard for building production Java services. Convention-over-configuration eliminates boilerplate.

Core Annotations:
• @SpringBootApplication = @Configuration + @ComponentScan + @EnableAutoConfiguration
• @RestController = @Controller + @ResponseBody (returns JSON by default)
• @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping
• @RequestBody — deserialise request JSON to Java object
• @PathVariable, @RequestParam — extract URL path and query params
• @Autowired — dependency injection (prefer constructor injection)
• @Service — business logic layer. Spring managed bean.
• @Repository — data access layer. Spring adds exception translation.
• @Component — generic Spring bean.
• @Transactional — wraps method in DB transaction. Rolls back on RuntimeException.
• @ControllerAdvice + @ExceptionHandler — global exception handling for REST APIs.
• @Validated + @Valid — request body validation with Jakarta Validation constraints.

Spring Data JPA: JpaRepository<Entity, ID> provides 30+ CRUD methods. Derived queries from method names.

Spring Security + JWT:
1. POST /auth/login → validate credentials → generate signed JWT.
2. Client sends Authorization: Bearer <token> header.
3. JwtFilter intercepts request → validates token signature + expiry → sets SecurityContext.
4. Method-level security: @PreAuthorize("hasRole('ADMIN')").

Layered Architecture: Controller → Service → Repository → DB.`,
          native: {
            Hinglish: `Spring Boot matlab Java web application ka shortcut — boilerplate hatao, sirf business logic likho. @RestController se URL endpoint banta hai. @Service mein asli kaam hota hai. @Repository database se baat karta hai. JWT token ek signed badge hai — login karo, badge lo, har request mein saath rakho, server badge verify karta hai. @Transactional matlab sab DB operations ya toh sab commit honge ya sab rollback honge.`,
            Hindi: `Spring Boot boilerplate कम करता है। @RestController REST endpoint बनाता है। JWT: token लो, हर request में भेजो। @Transactional: atomic operations।`,
            Tamil: `Spring Boot boilerplate குறைக்கிறது. @RestController REST endpoint உருவாக்குகிறது. JWT: token எடுத்து ஒவ்வொரு request-லும் அனுப்பு. @Transactional: atomic operations.`,
            Telugu: `Spring Boot boilerplate తగ్గిస్తుంది. @RestController REST endpoint create చేస్తుంది. JWT: token తీసుకుని ప్రతి request లో పంపు. @Transactional: atomic operations.`,
          },
          code: `// ─── Entity ──────────────────────────────────────────────
@Entity @Table(name = "students")
@Data @NoArgsConstructor @AllArgsConstructor
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(min=2, max=100)
    private String name;

    @Email @Column(unique=true) @NotBlank
    private String email;

    private String track;
    private int    score;
}

// ─── Repository ──────────────────────────────────────────
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByTrack(String track);
    List<Student> findByScoreGreaterThanOrderByScoreDesc(int minScore);
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT s FROM Student s WHERE s.score = " +
           "(SELECT MAX(s2.score) FROM Student s2 WHERE s2.track = :track)")
    Optional<Student> findTopByTrack(@Param("track") String track);
}

// ─── Service ─────────────────────────────────────────────
@Service @Transactional @RequiredArgsConstructor
public class StudentService {
    private final StudentRepository repo;

    public Student enroll(Student s) {
        if (repo.existsByEmail(s.getEmail()))
            throw new BusinessException("Email already enrolled: " + s.getEmail());
        return repo.save(s);
    }

    @Transactional(readOnly = true)
    public List<Student> getTopStudents(String track, int minScore) {
        return repo.findByScoreGreaterThanOrderByScoreDesc(minScore);
    }
}

// ─── Controller ──────────────────────────────────────────
@RestController @RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService service;

    @PostMapping
    public ResponseEntity<Student> enroll(@Valid @RequestBody Student s) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.enroll(s));
    }

    @GetMapping("/track/{track}")
    public List<Student> byTrack(@PathVariable String track,
                                  @RequestParam(defaultValue = "0") int minScore) {
        return service.getTopStudents(track, minScore);
    }
}

// ─── Global Exception Handler ────────────────────────────
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(ex.getMessage(), System.currentTimeMillis()));
    }
}`,
          lang: 'java',
          quiz: {
            question: 'What does `@Transactional(readOnly = true)` do on a Spring service method, and why is it useful?',
            options: [
              'It prevents any SELECT statements in that method — use it to block read operations',
              'It marks the transaction as read-only: the DB can optimise (skip dirty checking, use read-only replicas), Hibernate skips flushing, and the method cannot execute INSERT/UPDATE/DELETE — resulting in better performance for query-only methods.',
              'It makes the method return cached data without hitting the database',
              'readOnly = true enables parallel execution of the method across multiple threads',
            ],
            correct: 1,
            explanation: '@Transactional(readOnly = true) has several benefits: (1) Hibernate skips dirty checking (comparing entity state to flush changes) since no writes will happen — significant performance gain for large collections; (2) Some databases and connection pools can route read-only transactions to read replicas; (3) Spring marks the JDBC Connection as read-only which can enable DB-level optimisations; (4) It serves as documentation — clearly signals this method only reads data.',
          },
        },
      ],
    },
    /* ════════════════════════════════════════════════════════
       MODULE 7: Exception Handling & Design Patterns
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m7',
      title: 'Module 7 — Exception Handling & Design Patterns',
      topics: [
        {
          id: 'java-exceptions-hierarchy',
          title: 'Exception Hierarchy, Checked vs Unchecked, try-with-resources, multi-catch',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Exception handling is critical for building robust Java applications. The hierarchy starts with Throwable at the root.

Throwable has two main subclasses: Error (serious JVM problems like OutOfMemoryError, StackOverflowError that you shouldn't try to catch) and Exception.

Exceptions are divided into two categories:
• Checked Exceptions (Compile-time): Extend Exception (but not RuntimeException). E.g., IOException, SQLException. The compiler forces you to handle them (try-catch) or declare them (throws). They represent expected conditions outside your control (like file missing or network down).
• Unchecked Exceptions (Runtime): Extend RuntimeException. E.g., NullPointerException, IllegalArgumentException. The compiler doesn't force handling. They typically represent programming bugs.

try-with-resources (Java 7+): Automatically closes resources (files, sockets, DB connections) when the try block exits, avoiding memory leaks. The resource must implement AutoCloseable.
multi-catch (Java 7+): Catch multiple exception types in a single catch block to reduce code duplication, separated by a pipe (|).

Best Practices:
- Catch the most specific exception first (e.g., FileNotFoundException before IOException).
- Never swallow exceptions (empty catch block).
- Always clean up resources using try-with-resources instead of manual finally blocks.`,
          native: {
            Hinglish: `Checked exception matlab compiler tumhe force karega handle karne ko, jaise ghar se niklte waqt umbrella lena agar baarish hone wali ho. Unchecked exception achanak aati hai jaise raste mein pothole — code bugs ki wajah se. try-with-resources best hai kyunki file khud band ho jaati hai, tumhe finally block mein manual close karne ki zaroorat nahi hoti.`
          },
          code: `import java.io.*;
import java.sql.SQLException;

public class ExceptionDemo {
    public static void main(String[] args) {
        // ─── try-with-resources & multi-catch ─────────────────
        // Resources declared in parentheses are auto-closed in reverse order
        try (
            FileReader fr = new FileReader("config.txt");
            BufferedReader br = new BufferedReader(fr)
        ) {
            String line = br.readLine();
            processLine(line);
            
        } catch (FileNotFoundException | SQLException e) {
            // Multi-catch: handles specific errors the same way
            System.err.println("Resource error: " + e.getMessage());
            
        } catch (IOException e) {
            // More general checked exception handled last
            System.err.println("I/O error: " + e.getMessage());
            
        } catch (Exception e) {
            // Catch-all for unexpected errors (usually unchecked)
            System.err.println("Unknown error: " + e.getMessage());
        }
    }
    
    // Declares checked exceptions it might throw
    static void processLine(String line) throws SQLException, IOException {
        if (line == null) {
            // Throwing an unchecked exception
            throw new IllegalArgumentException("Line cannot be null");
        }
        // simulate logic
    }
}`,
          lang: 'java',
          quiz: {
            question: 'What happens if a resource declared in a try-with-resources block throws an exception while being closed, and the try block also threw an exception?',
            options: [
              'The exception from the close() method replaces the original exception.',
              'The original exception from the try block is thrown, and the close() exception is suppressed and attached to the original exception (accessible via getSuppressed()).',
              'The JVM terminates immediately with an Error.',
              'Both exceptions are combined into a new MultiException object.'
            ],
            correct: 1,
            explanation: 'In try-with-resources, if both the try block and the auto-close process throw exceptions, the exception from the try block takes precedence. The exception thrown by close() is "suppressed" and added to the original exception. You can access it using exception.getSuppressed(). This ensures the primary error causing the failure is not masked by a cleanup error.'
          }
        },
        {
          id: 'java-custom-exceptions',
          title: 'Custom Exceptions, Exception Chaining, finally block execution order',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Creating custom exceptions makes your application's error handling more domain-specific and easier to debug.

Custom Exceptions:
- Extend RuntimeException for unchecked errors (preferred in modern frameworks like Spring).
- Extend Exception for checked errors (when the caller MUST handle it).
- Always provide multiple constructors (message, message + cause, etc.) matching the superclass.

Exception Chaining:
When you catch one exception and throw a new one, you should pass the original exception as the "cause" to the new one. This preserves the original stack trace, making debugging much easier.

finally block rules:
- finally ALWAYS executes (except for System.exit() or JVM crash), regardless of whether an exception occurred or was caught.
- If a method returns a value in try or catch, the finally block still runs before the return happens.
- NEVER return a value from finally — it overrides any return value from try/catch.
- NEVER throw an exception from finally — it overrides any exception from try/catch.

Interview trap: A return in try, followed by a finally that modifies the return variable. Remember that primitive return values are evaluated before finally runs!`,
          native: {
            Hinglish: `Custom exception banate waqt RuntimeException extend karna aaj kal standard hai. Exception chaining matlab purani galti naye wrapper mein daal do taaki asli wajah (root cause) ghum na ho jaye. finally block bohot ziddi hota hai, woh tab tak nahi manta jab tak chal na jaye, yahan tak ki return statement milne ke baad bhi woh execute hota hai (lekin finally se return avoid karo).`
          },
          code: `// ─── Custom Unchecked Exception ────────────────────────
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class ExceptionAdvancedDemo {
    public static void main(String[] args) {
        System.out.println("Result: " + testFinally());
        
        try {
            findUser("999");
        } catch (UserNotFoundException e) {
            System.err.println("Error: " + e.getMessage());
            System.err.println("Root Cause: " + e.getCause());
        }
    }
    
    // ─── Exception Chaining ────────────────────────────────
    static void findUser(String id) {
        try {
            // Simulating a low-level DB error
            Integer.parseInt(id + "x"); // Throws NumberFormatException
        } catch (NumberFormatException e) {
            // Catch low-level, throw high-level custom exception WITH cause
            throw new UserNotFoundException("Failed to find user ID: " + id, e);
        }
    }
    
    // ─── Finally block execution order ─────────────────────
    static int testFinally() {
        try {
            System.out.println("1. Inside try");
            return 10; // Evaluated, but return delayed until finally finishes
        } catch (Exception e) {
            return 20;
        } finally {
            System.out.println("2. Inside finally");
            // DO NOT put return here! It would override the '10' from try block.
        }
    }
}`,
          lang: 'java',
          quiz: {
            question: 'What is the exact output of the testFinally() method in the code example?',
            options: [
              '1. Inside try\\nResult: 10',
              '1. Inside try\\n2. Inside finally\\nResult: 10',
              '2. Inside finally\\n1. Inside try\\nResult: 10',
              '1. Inside try\\nResult: 20'
            ],
            correct: 1,
            explanation: 'The code prints "1. Inside try" first. Then it encounters `return 10`, which evaluates the return value and prepares to exit. But before actually returning to the caller, the `finally` block must execute, printing "2. Inside finally". Only after `finally` completes does the method actually return 10 to the caller, printing "Result: 10".'
          }
        },
        {
          id: 'java-creational-patterns',
          title: 'Singleton, Factory, Builder Design Patterns in Java',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Creational design patterns deal with object creation mechanisms, optimizing them for the situation at hand.

1. Singleton Pattern: Ensures a class has only one instance and provides a global point of access to it.
• Use Cases: Thread pools, caches, configuration settings, database connections.
• Implementation: Private constructor, private static instance, public static get method.
• Double-Checked Locking is used to ensure thread safety without degrading performance. Enum is the most robust way to implement Singleton in Java (handles serialization automatically).

2. Factory Method Pattern: Defines an interface for creating an object, but lets subclasses alter the type of objects that will be created.
• Use Cases: When you don't know beforehand the exact types and dependencies of the objects your code should work with.
• Encapsulates object instantiation logic.

3. Builder Pattern: Separates the construction of a complex object from its representation, allowing the same construction process to create various representations.
• Use Cases: Objects with many optional parameters (avoiding telescoping constructors).
• Implementation: Static inner nested Builder class. Used extensively in modern Java (e.g., Lombok's @Builder).`,
          native: {
            Hinglish: `Singleton matlab ek hi object puri app mein share hoga. Factory matlab object banane ka factory — tu class ka naam bata, factory tujhe object degi. Builder ka use tab hota hai jab object mein bohot saare parameters ho aur tu constructor mein confuse na hona chahe. Jaise pizza order karna: base, cheese, toppings sab step-by-step Builder se lagte hain.`
          },
          code: `// ─── Singleton (Thread-Safe Double-Checked) ────────────
class DatabaseConnection {
    // volatile ensures changes are visible to all threads immediately
    private static volatile DatabaseConnection instance;
    
    private DatabaseConnection() {
        // private constructor prevents instantiation
    }
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}

// ─── Builder Pattern ──────────────────────────────────────
class User {
    private final String id;       // required
    private final String email;    // required
    private final String address;  // optional
    private final int age;         // optional
    
    private User(UserBuilder builder) {
        this.id = builder.id;
        this.email = builder.email;
        this.address = builder.address;
        this.age = builder.age;
    }
    
    // Static inner Builder class
    public static class UserBuilder {
        private final String id;
        private final String email;
        private String address = "";
        private int age = 0;
        
        public UserBuilder(String id, String email) {
            this.id = id;
            this.email = email;
        }
        
        public UserBuilder address(String address) {
            this.address = address;
            return this;
        }
        
        public UserBuilder age(int age) {
            this.age = age;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// ─── Usage ────────────────────────────────────────────────
public class PatternDemo {
    public static void main(String[] args) {
        User u = new User.UserBuilder("1", "test@test.com")
                         .age(25)
                         .address("Pune")
                         .build();
    }
}`,
          lang: 'java',
          quiz: {
            question: 'Why is the `volatile` keyword critical in the double-checked locking Singleton implementation?',
            options: [
              'It prevents multiple threads from accessing the getInstance() method simultaneously.',
              'It forces the JVM to cache the instance object in thread-local memory for faster access.',
              'It prevents the JVM from reordering instructions, ensuring the instance is fully initialized before it is assigned to the reference, avoiding partial initialization bugs.',
              'It automatically synchronizes all methods of the Singleton class.'
            ],
            correct: 2,
            explanation: 'Without `volatile`, the JVM might reorder the steps of object creation: it could allocate memory, assign the reference to `instance`, and THEN initialize the object. Another thread could check `instance == null`, find it false, and return a partially initialized object. `volatile` prevents this instruction reordering and ensures "happens-before" visibility.'
          }
        },
        {
          id: 'java-structural-behavioral-patterns',
          title: 'Strategy, Observer, Decorator Patterns',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `These patterns dictate how objects interact or how they are composed.

1. Strategy Pattern (Behavioral): Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
• Instead of massive if-else or switch statements for behavior, you create a Strategy interface.
• The Context object delegates work to a linked Strategy object.
• Example: Sorting algorithms, Payment methods (CreditCard, UPI, PayPal).

2. Observer Pattern (Behavioral): Defines a one-to-many dependency between objects. When the Subject changes state, all its Observers are notified automatically.
• Extensively used in GUI event listeners, Pub/Sub systems, and Reactive programming.
• Components: Subject (Maintains list of observers, attach/detach, notify) and Observer (update method).

3. Decorator Pattern (Structural): Attaches additional responsibilities to an object dynamically at runtime.
• A flexible alternative to subclassing for extending functionality.
• Example: Java I/O Streams. new BufferedReader(new InputStreamReader(new FileInputStream("x.txt"))) is classic Decorator!`,
          native: {
            Hinglish: `Strategy pattern matlab alag-alag plan rakhna aur runtime pe decide karna kaun sa use karna hai (jaise payment ke time UPI ya Card). Observer pattern matlab YouTube ka subscribe button — jab bhi naya video (Subject update) aayega, sab subscribers (Observers) ko notification chala jayega. Decorator matlab ek hi object par layers chadana — jaise plain dosa pe masala aur cheese daal ke Masala Cheese Dosa banana, bina naya class banaye.`
          },
          code: `import java.util.ArrayList;
import java.util.List;

// ─── Strategy Pattern ─────────────────────────────────────
interface PaymentStrategy {
    void pay(int amount);
}

class UPIPayment implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid " + amount + " via UPI"); }
}

class CardPayment implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid " + amount + " via Card"); }
}

class ShoppingCart {
    public void processPayment(PaymentStrategy strategy, int amount) {
        strategy.pay(amount); // Delegates to the injected strategy
    }
}

// ─── Observer Pattern ─────────────────────────────────────
interface Observer {
    void update(String videoTitle);
}

class YouTubeChannel {
    private List<Observer> subscribers = new ArrayList<>();
    
    public void subscribe(Observer o) { subscribers.add(o); }
    
    public void uploadVideo(String title) {
        for (Observer o : subscribers) {
            o.update(title); // Notify all observers
        }
    }
}

class User implements Observer {
    private String name;
    public User(String name) { this.name = name; }
    
    @Override
    public void update(String videoTitle) {
        System.out.println(name + ", new video is out: " + videoTitle);
    }
}

// ─── Execution ────────────────────────────────────────────
public class PatternDemo2 {
    public static void main(String[] args) {
        // Strategy Demo
        ShoppingCart cart = new ShoppingCart();
        cart.processPayment(new UPIPayment(), 500); // Swappable at runtime!
        
        // Observer Demo
        YouTubeChannel channel = new YouTubeChannel();
        channel.subscribe(new User("Rahul"));
        channel.subscribe(new User("Ananya"));
        channel.uploadVideo("Java Design Patterns!");
    }
}`,
          lang: 'java',
          quiz: {
            question: 'How does the Decorator pattern primarily differ from classical Inheritance?',
            options: [
              'Decorator provides multiple inheritance, which is normally not allowed in Java.',
              'Inheritance adds behavior at compile-time via subclassing, whereas Decorator adds behavior dynamically at runtime by wrapping objects.',
              'Decorator is only used for GUI components, whereas inheritance is used for business logic.',
              'Inheritance requires interfaces, but Decorator only works with abstract classes.'
            ],
            correct: 1,
            explanation: 'The Decorator pattern is used to dynamically add behavior to an object at runtime by wrapping it in a decorator object. This prevents class explosion (creating a subclass for every possible combination of features). Inheritance is static and determined at compile-time.'
          }
        },
        {
          id: 'java-di-ioc',
          title: 'Dependency Injection & Inversion of Control (without Spring)',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Dependency Injection (DI) and Inversion of Control (IoC) are the core principles behind modern frameworks like Spring, but they are general design concepts you must know.

Inversion of Control (IoC):
Traditionally, your custom code calls library functions (you are in control). In IoC, the framework calls your custom code (control is inverted). The framework acts as a container that manages object life cycles.

Dependency Injection (DI):
DI is a specific implementation of IoC. Instead of an object creating its own dependencies (using the 'new' keyword), the dependencies are "injected" into the object, usually via the constructor.

Why DI?
• Loose Coupling: Classes don't depend on concrete implementations, but on interfaces.
• Testability: You can easily inject mock objects during unit testing.
• Single Responsibility: A class shouldn't be responsible for instantiating its dependencies.

Types of DI:
1. Constructor Injection (Recommended): Dependencies passed through the constructor. Ensures the object is fully initialized and allows fields to be final.
2. Setter Injection: Dependencies passed via setter methods. Used for optional dependencies.
3. Field Injection: Directly injecting into fields via reflection (used in Spring via @Autowired on fields). Avoid this as it hides dependencies and makes testing harder.`,
          native: {
            Hinglish: `Pehle hum object khud banate the: 'Engine e = new Engine()'. Dependency injection ka matlab hai: 'Mujhe Engine chahiye, bahar se koi de do'. Isse loose coupling aati hai aur testing asaan ho jati hai kyunki test karte waqt hum asli Engine ki jagah Mock Engine pass kar sakte hain.`
          },
          code: `// ─── BAD: Tight Coupling (No DI) ─────────────────────────
class MySQLDatabase {
    void save(String data) { System.out.println("Saving to MySQL"); }
}

class UserServiceBad {
    private MySQLDatabase db;
    
    public UserServiceBad() {
        // Tight coupling! Hard to test, hard to switch databases.
        this.db = new MySQLDatabase();
    }
}

// ─── GOOD: Dependency Injection ───────────────────────────
// 1. Depend on an interface
interface Database {
    void save(String data);
}

class PostgresDatabase implements Database {
    public void save(String data) { System.out.println("Saving to PostgreSQL"); }
}

class MongoDatabase implements Database {
    public void save(String data) { System.out.println("Saving to MongoDB"); }
}

class UserService {
    private final Database db; // Interface reference
    
    // Constructor Injection
    public UserService(Database db) {
        this.db = db; // Dependency is injected from outside
    }
    
    public void registerUser() {
        db.save("User Data");
    }
}

// ─── Manual IoC Container (How Spring works internally) ──
public class DIDemo {
    public static void main(String[] args) {
        // The "Container" wires dependencies together
        Database pg = new PostgresDatabase();
        Database mongo = new MongoDatabase();
        
        // Injecting dependency
        UserService service1 = new UserService(pg);
        UserService service2 = new UserService(mongo);
        
        service1.registerUser(); // Saving to PostgreSQL
        service2.registerUser(); // Saving to MongoDB
    }
}`,
          lang: 'java',
          quiz: {
            question: 'Why is Constructor Injection preferred over Field Injection (like @Autowired directly on a private field)?',
            options: [
              'Field injection is faster at runtime than constructor injection.',
              'Constructor injection allows dependencies to be marked as `final`, ensuring the object is fully initialized and making it easy to instantiate the class in unit tests without a DI framework.',
              'Field injection cannot be used with interfaces, only with concrete classes.',
              'Constructor injection is required by Java specifications for all beans.'
            ],
            correct: 1,
            explanation: 'Constructor injection is the best practice because it enforces that the class cannot be instantiated without its mandatory dependencies. It allows fields to be `final` (immutable), and you can easily new up the object in a unit test by passing mocks into the constructor, without needing Spring or reflection.'
          }
        }
      ]
    },
    /* ════════════════════════════════════════════════════════
       MODULE 8: Data Structures & Algorithms in Java
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m8',
      title: 'Module 8 — Data Structures & Algorithms in Java',
      topics: [
        {
          id: 'java-arrays-lists',
          title: 'Arrays, ArrayList, LinkedList — time complexities, when to use',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `Choosing the right basic linear data structure is crucial for algorithm optimization.

Arrays (int[], String[]):
• Fixed size memory block. Contiguous memory allocation.
• Time Complexity: Access O(1), Search O(n), Insert/Delete O(n) due to shifting.
• Pros: Fastest iteration, cache-friendly, primitives support.
• Cons: Fixed size.

ArrayList:
• Dynamic array. Backed by an Object[] array. When full, it grows by 50% (newCapacity = oldCapacity + (oldCapacity >> 1)).
• Time Complexity: Access O(1), Add at end O(1) amortized, Insert/Delete in middle O(n).
• Pros: Dynamic resizing, O(1) random access.
• Cons: Shifting elements is slow, resizing requires creating a new array and copying elements.

LinkedList:
• Doubly-linked list. Each node has data, prev, and next pointers. Non-contiguous memory.
• Time Complexity: Access O(n), Insert/Delete at ends O(1), Insert/Delete in middle O(n) (requires traversal first).
• Pros: Fast insertions/deletions at the ends.
• Cons: Slow random access, high memory overhead per node.

When to use what:
- Use Arrays if size is fixed and known.
- Use ArrayList as your default List choice (99% of the time).
- Use LinkedList only if you need a Queue or Deque, or if you frequently add/remove from the absolute beginning/end.`,
          native: {
            Hinglish: `Array ek fixed size dabba hai — size bada nahi kar sakte. ArrayList elastic array hai, jab bhar jata hai toh khud bada (1.5x) ho jata hai. ArrayList mein search O(1) hai but beech mein insert karna mehenga hai kyunki sabko shift karna padta hai. LinkedList train ke dibbo jaisa hai, beech mein jodna aasan hai par 10th dibbe tak pahunchne ke liye start se chalna padega O(n).`
          },
          code: `import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class DSADemo1 {
    public static void main(String[] args) {
        // ─── Primitive Array ──────────────────────────────────
        int[] arr = new int[5]; // Fixed size
        arr[0] = 10;
        // Access: O(1) -> arr[3]
        
        // ─── ArrayList ────────────────────────────────────────
        List<Integer> arrayList = new ArrayList<>();
        arrayList.add(10); // O(1) amortized
        arrayList.add(20);
        arrayList.add(0, 5); // O(n) — shifts 10 and 20 to the right
        int val = arrayList.get(1); // O(1) random access
        
        // ─── LinkedList ───────────────────────────────────────
        LinkedList<Integer> linkedList = new LinkedList<>();
        linkedList.addFirst(10); // O(1)
        linkedList.addLast(20);  // O(1)
        
        // O(n) — must traverse from beginning to index 1
        int llVal = linkedList.get(1); 
        
        // LinkedList acts as a Queue/Deque
        linkedList.offer(30);   // Enqueue at tail
        linkedList.poll();      // Dequeue from head
    }
}`,
          lang: 'java',
          visualizer: {
            engine: 'dsa',
            dsType: 'array',
            title: 'Binary Search Pointer Movement — Visual Algorithm Tracing',
            steps: [
              { title: 'Initial State', array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], pointers: [{ index: 0, label: 'L' }, { index: 9, label: 'R' }], desc: 'Searching for target = 23 in sorted array. Initial L=0, R=9.' },
              { title: 'Step 1: Compute Mid', array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], highlight: [4], pointers: [{ index: 0, label: 'L' }, { index: 4, label: 'MID' }, { index: 9, label: 'R' }], desc: 'Mid = (0 + 9) / 2 = 4. arr[4] = 16. Target 23 > 16, move L to Mid + 1.' },
              { title: 'Step 2: Narrow Search Space', array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], highlight: [7], pointers: [{ index: 5, label: 'L' }, { index: 7, label: 'MID' }, { index: 9, label: 'R' }], desc: 'L=5, R=9. Mid = (5 + 9) / 2 = 7. arr[7] = 56. Target 23 < 56, move R to Mid - 1.' },
              { title: 'Step 3: Found Target!', array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], highlight: [5], pointers: [{ index: 5, label: 'L, R, MID' }], desc: 'L=5, R=6. Mid = 5. arr[5] = 23 == Target! Index 5 returned.' },
            ]
          },
          quiz: {
            question: 'If you have an application that requires millions of random reads by index, and very few insertions/deletions at the end, which data structure is optimal?',
            options: [
              'LinkedList, because insertions are fast.',
              'ArrayList, because random access by index is O(1) and it handles dynamic sizing.',
              'Vector, because it provides thread-safe O(1) access.',
              'HashSet, because it provides O(1) access.'
            ],
            correct: 1,
            explanation: 'ArrayList is backed by an array, providing O(1) time complexity for random access (get(index)). LinkedList requires O(n) traversal. While Vector also gives O(1) access, its synchronization adds unnecessary performance overhead in single-threaded scenarios.'
          }
        },
        {
          id: 'java-stack-queue-deque',
          title: 'Stack, Queue, Deque — implementation and interview problems',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Stacks and Queues are foundational abstract data types.

Stack (LIFO - Last In, First Out):
• Legacy Java Class: java.util.Stack (Extends Vector, heavily synchronized, DO NOT USE in modern Java).
• Modern implementation: Use ArrayDeque.
• Operations: push(), pop(), peek().
• Classic problems: Valid Parentheses, Next Greater Element, Evaluate Reverse Polish Notation.

Queue (FIFO - First In, First Out):
• Interface in Java, typically implemented by LinkedList or ArrayDeque.
• Operations: offer() (add), poll() (remove and return), peek().
• Classic problems: Level Order Traversal (BFS), LRU Cache logic, Task Scheduling.

Deque (Double Ended Queue):
• Interface for a queue that supports insertion and removal at BOTH ends.
• Implementations: ArrayDeque, LinkedList.
• ArrayDeque is generally faster than LinkedList as it is backed by a circular array (cache friendly, less GC overhead).
• Classic problems: Sliding Window Maximum.

PriorityQueue:
• Min-Heap by default. Elements are ordered by natural ordering or Comparator.
• Insertion O(log n), Retrieval of min O(1), Removal of min O(log n).
• Classic problems: Top K Frequent Elements, Merge K Sorted Lists.`,
          native: {
            Hinglish: `Stack matlab plates ka dher — jo plate aakhir mein rakhi, wohi sabse pehle uthegi (LIFO). Queue matlab movie ki line — jo pehle aaya, woh pehle ticket paayega (FIFO). Interview tip: Java mein 'Stack' class legacy hai aur slow hai, isliye hamesha 'ArrayDeque' ko stack ya queue dono ke roop mein use karo.`
          },
          code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

public class DSADemo2 {
    public static void main(String[] args) {
        // ─── Stack implementation using ArrayDeque ────────────
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10);
        stack.push(20);
        System.out.println(stack.peek()); // 20
        System.out.println(stack.pop());  // 20 (Removed)
        
        // ─── Queue implementation using ArrayDeque ────────────
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("Alice");
        queue.offer("Bob");
        System.out.println(queue.poll()); // "Alice" (Removed)
        
        // ─── PriorityQueue (Min-Heap default) ─────────────────
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        pq.offer(50);
        pq.offer(10);
        pq.offer(30);
        // Extracts elements in sorted order: 10, 30, 50
        while (!pq.isEmpty()) {
            System.out.print(pq.poll() + " "); 
        }
        
        System.out.println();
        // PriorityQueue as Max-Heap
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
        maxHeap.offer(10);
        maxHeap.offer(50);
        System.out.println("Max element: " + maxHeap.peek()); // 50
    }
}`,
          lang: 'java',
          quiz: {
            question: 'Why is `ArrayDeque` recommended over `Stack` and `LinkedList` for typical LIFO and FIFO operations in Java?',
            options: [
              'ArrayDeque provides O(1) performance and doesn\'t have the synchronization overhead of Stack, nor the node-allocation memory overhead of LinkedList.',
              'ArrayDeque automatically sorts its elements, making retrieval faster.',
              'ArrayDeque is fully thread-safe, unlike Stack and LinkedList.',
              'ArrayDeque allows null elements, preventing NullPointerExceptions.'
            ],
            correct: 0,
            explanation: '`java.util.Stack` is a legacy class extending Vector, meaning every operation is synchronized, causing performance hits. `LinkedList` creates a new Node object for every element, leading to higher memory overhead and GC pressure. `ArrayDeque` uses a resizable circular array, avoiding both synchronization and node allocation overhead, making it significantly faster.'
          }
        },
        {
          id: 'java-binary-search-patterns',
          title: 'Binary Search, Two Pointers, Sliding Window patterns',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `These three algorithmic patterns solve a massive chunk of array/string interview problems.

1. Binary Search (O(log n)):
• Used on SORTED arrays to find an element or a condition boundary.
• Core logic: Divide search space in half.
• Template trick: while (left <= right), mid = left + (right - left) / 2 to avoid integer overflow.
• Variations: Find first occurrence, find last occurrence, search in rotated sorted array.

2. Two Pointers (O(n)):
• Used for searching pairs or manipulating arrays in-place.
• Types: 
  - Opposite directional (start & end moving inwards): Reverse array, Two Sum II, Container With Most Water.
  - Same directional (fast & slow runners): Linked List cycle detection, Remove duplicates.

3. Sliding Window (O(n)):
• Used on subarrays or substrings to find longest/shortest/fixed-length sequences satisfying a condition.
• Fixed Window: Window size 'k' is constant. Move right by 1, remove left by 1.
• Dynamic Window: Expand 'right' until condition breaks, then shrink 'left' until condition is valid again.
• Example: Longest Substring Without Repeating Characters, Minimum Size Subarray Sum.`,
          native: {
            Hinglish: `Binary search matlab dictionary mein word dhoondna — direct beech mein kholo aur aadhi book discard kar do. Two pointers mein hum do variables rakhte hain (start, end) taaki array ko dono taraf se process kar sakein. Sliding window ek frame jaisa hai jo array ke upar sarakta hai — longest substring nikalne ke liye yeh best hai kyunki O(n^2) ko O(n) mein convert kar deta hai.`
          },
          code: `public class DSAPatterns {
    
    // 1. Binary Search (Find first true condition)
    static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2; // Prevents overflow
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
    
    // 2. Two Pointers (Two Sum in Sorted Array)
    static int[] twoSumSorted(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return new int[]{left, right};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }
    
    // 3. Sliding Window (Longest substring with K distinct characters approx logic)
    static int maxSumSubarray(int[] arr, int k) {
        int maxSum = 0, windowSum = 0;
        for (int i = 0; i < arr.length; i++) {
            windowSum += arr[i]; // Add next element
            
            // If window size reached k
            if (i >= k - 1) {
                maxSum = Math.max(maxSum, windowSum);
                windowSum -= arr[i - (k - 1)]; // Remove first element of window
            }
        }
        return maxSum;
    }
}`,
          lang: 'java',
          quiz: {
            question: 'Why do we calculate the middle index in Binary Search as `left + (right - left) / 2` instead of `(left + right) / 2`?',
            options: [
              'It forces integer division to truncate towards zero.',
              'It prevents integer overflow when `left` and `right` are very large numbers.',
              'It ensures the middle index leans towards the left side for even-length arrays.',
              'There is no difference; it is purely a stylistic preference.'
            ],
            correct: 1,
            explanation: 'If `left` and `right` are both close to Integer.MAX_VALUE (2,147,483,647), their sum `left + right` will overflow a 32-bit signed integer, resulting in a negative number and a crash. `left + (right - left) / 2` calculates the exact same mathematical value but keeps the intermediate calculation within the bounds of a 32-bit integer.'
          }
        },
        {
          id: 'java-recursion-backtracking',
          title: 'Recursion & Backtracking — examples with Java code',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Recursion is when a function calls itself to solve smaller instances of the same problem.
Every recursive function needs:
1. Base Case: The condition that stops the recursion.
2. Recursive Step: The breakdown of the problem into smaller problems.

Call Stack: Recursion uses the system's memory (Stack) to hold variables for each function call. Too deep recursion causes StackOverflowError.

Backtracking is an algorithmic technique for solving constraint satisfaction problems incrementally.
It builds candidate solutions step by step and abandons a candidate ("backtracks") as soon as it determines that the candidate cannot possibly lead to a valid solution.

Classic Backtracking Template:
void backtrack(path, choices) {
    if (goal reached) { add path to results; return; }
    for (choice in choices) {
        if (choice is valid) {
            make choice;
            backtrack(path + choice, remaining choices);
            undo choice; // BACKTRACK
        }
    }
}

Common Problems: N-Queens, Sudoku Solver, Subsets, Permutations, Word Search.`,
          native: {
            Hinglish: `Recursion ek mirror ke aage doosra mirror rakhne jaisa hai — jab tak ek limit (base case) na aaye tab tak loop chalta rahega. Backtracking maze (bhool-bhulaiya) solve karne jaisa hai: ek rasta chuno, agar dead end mile toh wapis piche aao (undo choice) aur doosra rasta try karo.`
          },
          code: `import java.util.ArrayList;
import java.util.List;

public class BacktrackingDemo {
    
    // Find all permutations of an array
    public static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(result, new ArrayList<>(), nums);
        return result;
    }
    
    private static void backtrack(List<List<Integer>> result, List<Integer> tempList, int[] nums) {
        // Base Case: If the current list has the same size as input, it's a valid permutation
        if (tempList.size() == nums.length) {
            result.add(new ArrayList<>(tempList)); // Add a COPY of the list
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            // Skip elements already in the current permutation path
            if (tempList.contains(nums[i])) continue; 
            
            // 1. Choose
            tempList.add(nums[i]);
            
            // 2. Explore deeper
            backtrack(result, tempList, nums);
            
            // 3. Un-choose (Backtrack!)
            tempList.remove(tempList.size() - 1);
        }
    }
    
    public static void main(String[] args) {
        List<List<Integer>> perms = permute(new int[]{1, 2, 3});
        for (List<Integer> p : perms) {
            System.out.println(p);
        }
    }
}`,
          lang: 'java',
          quiz: {
            question: 'In the backtracking template, why is it critical to create a new `ArrayList` copy when adding the result, e.g., `result.add(new ArrayList<>(tempList))`?',
            options: [
              'Because adding `tempList` directly causes a compilation error in Java.',
              '`tempList` is passed by reference. If you add it directly, subsequent backtracking (which removes elements from `tempList`) will modify the list already inside the results array.',
              'Creating a new list prevents OutOfMemory errors.',
              'Because `tempList` is destroyed immediately after the method returns.'
            ],
            correct: 1,
            explanation: 'In Java, objects are passed by reference. `tempList` is a single object being modified constantly throughout the recursive process. If you add it directly to `result`, you are just storing a reference to it. When the recursion eventually finishes and empties `tempList`, your result list will just contain references to empty lists. You must snapshot the state by creating a new `ArrayList`.'
          }
        },
        {
          id: 'java-big-o',
          title: 'Big O Notation — space/time complexity analysis',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Big O Notation evaluates the efficiency of an algorithm based on the input size (N), focusing on the worst-case scenario.

Time Complexity: How execution time grows as input grows.
• O(1) Constant: Array access arr[i], HashMap put/get.
• O(log n) Logarithmic: Binary Search, TreeSet lookup. Halving data per step.
• O(n) Linear: For-loops iterating over arrays, LinkedList traversal.
• O(n log n) Linearithmic: Efficient sorting algorithms (Merge Sort, Quick Sort, Arrays.sort()).
• O(n^2) Quadratic: Nested for-loops (Bubble Sort, 2D matrix brute force).
• O(2^n) Exponential: Recursive Fibonacci without memoization.

Space Complexity: Extra memory required by the algorithm (excluding the input data itself).
• O(1): Using a few variables/pointers (Two Pointers pattern).
• O(n): Creating a new array/hashmap proportional to input, or a call stack N levels deep (linear recursion).

Rules to Remember:
1. Drop constants: O(2N) becomes O(N).
2. Drop non-dominant terms: O(N^2 + N) becomes O(N^2).
3. Sequence counts as addition: Two separate O(N) loops = O(N).
4. Nesting counts as multiplication: Loop inside loop = O(N^2).`,
          native: {
            Hinglish: `Big O bas yeh batata hai ki jab data 10 se 10 million ho jayega, toh algorithm kitna royega. O(1) best hai (instant), O(n) chalta hai (linear), aur O(n^2) tabahi hai (nested loops). Space complexity mein recursion ka stack space hamesha yaad rakho, kyunki woh dikhta nahi hai par memory khata hai.`
          },
          code: `public class BigODemo {
    
    // Time: O(1), Space: O(1)
    static void checkFirst(int[] arr) {
        if (arr.length > 0) System.out.println(arr[0]);
    }
    
    // Time: O(N), Space: O(1)
    static void printAll(int[] arr) {
        for (int x : arr) {
            System.out.println(x);
        }
    }
    
    // Time: O(N^2), Space: O(1)
    static void printPairs(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                System.out.println(arr[i] + ", " + arr[j]);
            }
        }
    }
    
    // Time: O(N), Space: O(N) due to Recursion Call Stack
    static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
          lang: 'java',
          quiz: {
            question: 'An algorithm iterates through a 1D array of size N to find a value, then iterates through it again to find another value. It uses no extra memory. What is its Time and Space complexity?',
            options: [
              'Time: O(N^2), Space: O(1)',
              'Time: O(N), Space: O(N)',
              'Time: O(N), Space: O(1)',
              'Time: O(2N), Space: O(0)'
            ],
            correct: 2,
            explanation: 'The algorithm performs two separate, sequential iterations over the array, making the time complexity O(N + N) = O(2N). In Big O, we drop the constants, resulting in O(N). Since it uses no extra memory (no new arrays, hash maps, or deep recursion), the space complexity is O(1).'
          }
        }
      ]
    },
    /* ════════════════════════════════════════════════════════
       MODULE 9: System Design & Testing
    ════════════════════════════════════════════════════════ */
    {
      id: 'java-m9',
      title: 'Module 9 — System Design & Testing',
      topics: [
        {
          id: 'java-junit-mockito',
          title: 'JUnit 5, Mockito — unit testing Spring Boot applications',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Testing ensures code reliability. Unit tests isolate a single class, replacing its dependencies with mocks.

JUnit 5 (Jupiter): The standard Java testing framework.
• @Test: Marks a method as a test.
• @BeforeEach / @AfterEach: Runs before/after every test method.
• @BeforeAll / @AfterAll: Runs once per class (must be static).
• Assertions: assertEquals, assertTrue, assertThrows.

Mockito: A mocking framework used alongside JUnit.
• Mocks simulate the behavior of real dependencies (like a database or external API) so you can test business logic in isolation.
• @Mock: Creates a fake instance of a class/interface.
• @InjectMocks: Creates an instance of the class under test and injects the @Mock fields into it.
• when(...).thenReturn(...): Defines the behavior of a mock.
• verify(...): Asserts that a method on a mock was called with specific arguments.

Spring Boot Testing:
• @SpringBootTest loads the ENTIRE application context (integration test, slow).
• @WebMvcTest(Controller.class) loads only the web layer for testing APIs.
• Prefer plain JUnit + Mockito for fast unit tests without starting the Spring container.`,
          native: {
            Hinglish: `Unit testing matlab apne code ke har chote tukde ko check karna. Mockito ka kaam hai 'jhooth bolna'. Agar service ko database chahiye, toh Mockito ek nakli DB banakar de dega jo wahi reply karega jo tum chahte ho, taaki tum sirf service ka logic test kar sako, bina DB connect kiye.`
          },
          code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Service we want to test
class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }
    
    public String getUserName(int id) {
        User u = repo.findById(id);
        if (u == null) throw new IllegalArgumentException("Not found");
        return u.getName().toUpperCase();
    }
}

interface UserRepository { User findById(int id); }
class User { 
    private String name; 
    public User(String n) { name = n; }
    public String getName() { return name; } 
}

// ─── The Test Class ───────────────────────────────────────
@ExtendWith(MockitoExtension.class) // Enables Mockito annotations
class UserServiceTest {

    @Mock
    UserRepository repoMock; // The fake dependency

    @InjectMocks
    UserService service; // The class being tested, receives the mock

    @Test
    void testGetUserName_Success() {
        // Arrange (Setup mock behavior)
        User fakeUser = new User("rahul");
        when(repoMock.findById(1)).thenReturn(fakeUser);

        // Act (Call the actual method)
        String result = service.getUserName(1);

        // Assert (Check results and verifications)
        assertEquals("RAHUL", result);
        verify(repoMock, times(1)).findById(1); // verify it was called
    }

    @Test
    void testGetUserName_NotFound_ThrowsException() {
        // Arrange
        when(repoMock.findById(99)).thenReturn(null);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            service.getUserName(99);
        });
    }
}`,
          lang: 'java',
          quiz: {
            question: 'What is the primary difference between `@Mock` and `@InjectMocks` in Mockito?',
            options: [
              '`@Mock` is used for classes, while `@InjectMocks` is used for interfaces.',
              '`@Mock` creates a dummy fake object, while `@InjectMocks` creates a real instance of the class under test and injects the `@Mock` objects into its constructor/fields.',
              '`@Mock` loads the Spring Context, whereas `@InjectMocks` does not.',
              'There is no difference, they are aliases.'
            ],
            correct: 1,
            explanation: '`@Mock` instructs Mockito to create a completely fake proxy object of a dependency (like a Repository). `@InjectMocks` is used on the actual class you are trying to test (like a Service). Mockito will instantiate the Service and automatically inject all the declared `@Mock` objects into it.'
          }
        },
        {
          id: 'java-maven-gradle',
          title: 'Maven & Gradle build tools, dependency management',
          level: 'Beginner',
          badge: 'badge-sky',
          summary: `Build tools automate compiling code, running tests, managing dependencies, and packaging applications (JAR/WAR).

Maven:
• XML based configuration (pom.xml).
• Strict, rigid lifecycle phases: clean, validate, compile, test, package, verify, install, deploy.
• Dependencies are downloaded from Maven Central Repository.
• Transitive dependencies: If A depends on B, and B depends on C, Maven automatically pulls C.
• Command: mvn clean install

Gradle:
• Groovy or Kotlin DSL based (build.gradle).
• Much faster than Maven because of incremental builds, build cache, and daemon processes.
• Highly customizable and scriptable. The standard for Android development, and gaining heavy traction in Spring Boot.
• Command: ./gradlew build

Dependency Scopes:
• compile (Maven) / implementation (Gradle): Required at compile time and runtime.
• test / testImplementation: Only required for testing (e.g., JUnit, Mockito).
• provided / compileOnly: Required at compile time, but provided by the environment at runtime (e.g., Lombok, Servlet API).`,
          native: {
            Hinglish: `Bina Maven/Gradle ke tumhe sabhi third-party libraries (jar files) manually download karke class path mein daalni padti. In tools ki wajah se bas ek pom.xml mein naam likho, aur ye khud internet se download karke project set kar dete hain. Maven XML use karta hai jo thoda lamba hota hai, Gradle modern hai aur fast hai.`
          },
          code: `<!-- ─── pom.xml (Maven Example) ────────────────────────── -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0</version>
    
    <dependencies>
        <!-- Standard runtime dependency -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>3.1.0</version>
        </dependency>
        
        <!-- Test dependency (not included in final production JAR) -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.9.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>

// ─── build.gradle (Gradle Equivalent) ─────────────────────
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.1.0'
}

group = 'com.example'
version = '1.0.0'

repositories {
    mavenCentral() // Tells Gradle to download from Maven repo
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.9.2'
}`,
          lang: 'java',
          quiz: {
            question: 'What is the purpose of the `provided` (Maven) or `compileOnly` (Gradle) dependency scope?',
            options: [
              'It makes the dependency available for tests but hides it from main code.',
              'It downloads the dependency at runtime instead of compile time.',
              'It provides the library during compilation to avoid errors, but expects the server/environment to provide it at runtime, omitting it from the final built artifact.',
              'It forces the dependency to be checked into version control.'
            ],
            correct: 2,
            explanation: 'Libraries like Lombok or the Servlet API are needed to compile your code. However, Lombok is only a compile-time tool (it generates code and isn\'t needed at runtime), and the Servlet API is already provided by Tomcat servers. Using `provided/compileOnly` prevents these libraries from being bundled inside your final JAR/WAR, saving space.'
          }
        },
        {
          id: 'java-microservices',
          title: 'Microservices Architecture — REST vs gRPC, service discovery',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Microservices architecture breaks a large Monolith application into smaller, independently deployable services that communicate over a network.

Monolith vs Microservices:
• Monolith: One large codebase, single DB. Easy to test and deploy, but hard to scale and maintain as teams grow.
• Microservices: Independent databases, tech stacks, and deployments. Highly scalable, resilient (one crash doesn't bring down everything), but complex to operate (requires distributed tracing, network handling).

Communication protocols:
1. REST (HTTP/1.1 with JSON): Standard, easy to debug, stateless. Slow due to text-based JSON parsing and large headers.
2. gRPC (HTTP/2 with Protobuf): Developed by Google. Uses binary serialization (Protocol Buffers). Much faster, strongly typed, supports streaming. Great for internal service-to-service communication.
3. Message Brokers (Kafka, RabbitMQ): Asynchronous event-driven communication.

Service Discovery:
In the cloud, services constantly scale up and down, changing IP addresses. A Service Registry (like Netflix Eureka, Consul, or Kubernetes CoreDNS) keeps track of all active service instances. When Service A needs to call Service B, it asks the registry for B's current IP address.

API Gateway:
A single entry point for all clients. Handles routing, authentication, rate limiting, and load balancing before requests reach the actual microservices (e.g., Spring Cloud Gateway).`,
          native: {
            Hinglish: `Monolith matlab ek bada thali jisme sab mix hai. Microservices matlab buffet system — alag-alag stalls (services), har koi apna independent kaam kar raha hai. Agar dessert stall band ho jaye, toh starter ka kaam nahi rukta. In services ko aapas mein baat karne ke liye REST (JSON) ya gRPC (super fast binary) ka use hota hai.`
          },
          code: `// ─── Spring Cloud Service Discovery (Eureka Client) ───────
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient // Registers this service with Eureka
@RestController
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

    @GetMapping("/orders")
    public String getOrders() {
        return "Order details from Order-Service";
    }
}

// ─── Feign Client (Declarative REST Client) ────────────────
// Used to call another microservice using its name, not IP
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

// Resolves "inventory-service" via the Service Registry
@FeignClient(name = "inventory-service") 
public interface InventoryClient {
    
    @GetMapping("/inventory/check")
    boolean checkStock();
}`,
          lang: 'java',
          quiz: {
            question: 'Why is gRPC often preferred over REST for internal microservice-to-microservice communication?',
            options: [
              'gRPC uses XML which is easier to parse than JSON.',
              'gRPC runs over HTTP/1.1, making it highly compatible with old browsers.',
              'gRPC uses Protocol Buffers (binary data) and HTTP/2, making it significantly faster, smaller in payload size, and strongly typed compared to REST/JSON.',
              'gRPC inherently provides better security than HTTPS.'
            ],
            correct: 2,
            explanation: 'REST uses JSON over HTTP/1.1. JSON is text-based and requires heavy CPU cycles to serialize/deserialize, and HTTP/1.1 is not multiplexed. gRPC uses Protocol Buffers (a highly compressed binary format) over HTTP/2 (allowing multiplexing). This results in lower latency, lower bandwidth usage, and faster communication between backend services.'
          }
        },
        {
          id: 'java-docker',
          title: 'Docker basics for Java developers — Dockerfile, containerizing Spring Boot',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Docker solves the "It works on my machine" problem by packaging an application and its dependencies into a standardized unit called a Container.

Image vs Container:
• Image: A read-only template with instructions (OS, Java, your App JAR). Like a Java Class.
• Container: A runnable instance of an Image. Like a Java Object.

Dockerfile for Spring Boot:
To containerize a Java app, you write a Dockerfile.
1. FROM: Base image (e.g., eclipse-temurin:17-jre). Use JRE instead of JDK for smaller production images.
2. WORKDIR: Set working directory inside the container.
3. COPY: Copy your compiled .jar file from host into the image.
4. EXPOSE: Document the port the container listens on.
5. ENTRYPOINT or CMD: The command to run the app (java -jar app.jar).

Multi-stage builds:
A powerful Docker feature where you use one image to compile the code (using Maven/JDK) and a second smaller image (JRE only) to run it. This keeps the final image lightweight and secure, leaving source code and build tools behind.

Commands:
docker build -t myapp . (Build image)
docker run -p 8080:8080 myapp (Run container, map host port to container port)`,
          native: {
            Hinglish: `Docker ek virtual tiffin box hai. Tumhara code, Java, aur settings sab is tiffin box mein pack ho jate hain. Phir chahe tum ise Windows pe chalao ya AWS cloud pe, yeh har jagah exactly same behave karega. Dockerfile us tiffin box ko pack karne ki recipe hai.`
          },
          code: `# ─── Simple Spring Boot Dockerfile ────────────────────────
# Use an official Java Runtime environment as a base image
FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged jar file into the container
COPY target/my-spring-app-1.0.jar app.jar

# Inform Docker that the container listens on port 8080
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]


# ─── Multi-Stage Build (Advanced & Recommended) ───────────
# Stage 1: Build the application using Maven & JDK
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
# Download dependencies first to cache this layer
RUN mvn dependency:go-offline 
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application using lightweight JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy ONLY the built JAR from the builder stage
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
          lang: 'bash',
          quiz: {
            question: 'What is the primary advantage of using a Multi-Stage Docker build for a Java application?',
            options: [
              'It allows running multiple Spring Boot applications in the same container.',
              'It results in a much smaller and more secure final image by separating the heavy build environment (JDK/Maven) from the runtime environment (JRE).',
              'It improves the application\'s runtime performance by compiling the Java code natively.',
              'It bypasses Docker\'s layer caching, making builds faster.'
            ],
            correct: 1,
            explanation: 'A Maven+JDK image is very large (hundreds of MBs) and contains tools unnecessary for production, which also increases the security attack surface. A multi-stage build uses the heavy image only to compile the JAR, and then copies just the compiled JAR into a fresh, minimal JRE image. The final image is tiny, secure, and production-ready.'
          }
        },
        {
          id: 'java-caching-redis',
          title: 'Caching strategies — Redis with Spring Boot, @Cacheable annotation',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Caching significantly improves application performance by storing frequently accessed, computationally expensive, or I/O heavy data in fast memory (RAM).

Caching Strategies:
• Cache-Aside (Lazy Loading): App looks in cache. If hit, return data. If miss, fetch from DB, save to cache, return data. Most common in Spring.
• Write-Through: App writes data to cache and DB simultaneously.
• Eviction Policies: LRU (Least Recently Used), TTL (Time To Live).

Redis (Remote Dictionary Server):
An in-memory, key-value NoSQL database. It is incredibly fast and commonly used as a distributed cache. Distributed caching is essential for microservices so all instances share the same cache state.

Spring Boot Caching Framework:
Spring provides an abstraction over caching providers (ConcurrentHashMap, Redis, EhCache).
• @EnableCaching: Add to main class.
• @Cacheable("users"): Caches the method return value. Subsequent calls with the same parameters return from cache without executing the method.
• @CachePut: Updates the cache without interfering with method execution (good for updates).
• @CacheEvict: Removes data from the cache (good for deletes).`,
          native: {
            Hinglish: `Database se data laana hard disk se data padhne jaisa hai, time lagta hai. Caching RAM mein temporary data rakhna hai. Redis ek super fast RAM-based database hai. Spring mein sirf method ke upar @Cacheable laga do, agli baar same request aayegi toh Spring DB tak jayega hi nahi, direct Redis se data wapas de dega.`
          },
          code: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

@SpringBootApplication
@EnableCaching // Step 1: Enable caching mechanism
public class CacheDemoApp {
    public static void main(String[] args) {
        SpringApplication.run(CacheDemoApp.class, args);
    }
}

@Service
class ProductService {

    // Fetch from DB, then save to "products" cache with key as the ID.
    // Next time, if key exists, method body is skipped!
    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        simulateSlowDatabaseCall();
        return new Product(id, "Laptop", 1000.0);
    }

    // Always executes. Updates the cache with the new returned Product.
    @CachePut(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        // Save to DB logic here
        return product;
    }

    // Removes the specific item from the cache.
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        // Delete from DB logic here
    }
    
    private void simulateSlowDatabaseCall() {
        try { Thread.sleep(3000); } 
        catch (InterruptedException e) { }
    }
}`,
          lang: 'java',
          quiz: {
            question: 'What happens when a method annotated with `@Cacheable(value="items", key="#id")` is called, and the data is already present in the cache for that key?',
            options: [
              'The method executes normally, and the returned value overwrites the existing cache.',
              'The method is completely bypassed (not executed), and the cached value is returned immediately.',
              'The method executes, but the database connection is intercepted and replaced.',
              'An exception is thrown indicating a cache collision.'
            ],
            correct: 1,
            explanation: 'Spring implements caching using AOP (Aspect-Oriented Programming) proxies. When a `@Cacheable` method is called, the proxy checks the cache first. If a cache hit occurs, the proxy returns the cached data immediately and the actual method is completely skipped, saving the time it would take to execute the method logic or DB queries.'
          }
        }
      ]
    }
  ],
};
