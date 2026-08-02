export const TRACKS = [
  {
    id: 'java',
    label: 'Java Ecosystem',
    icon: 'java',
    color: '#f59e0b',
    activeClass: 'active-java',
    desc: 'From Basic Syntax → OOP → Collections → Multithreading → JDBC → Hibernate → Spring Boot',
    modules: [
      {
        id: 'java-m1',
        title: 'Module 1 — Java Basics & OOP',
        topics: [
          {
            id: 'java-jvm',
            title: 'JDK vs JRE vs JVM & Memory Model',
            level: 'Beginner',
            badge: 'badge-sky',
            summary: `Java code goes through a unique journey before it runs. You write .java source code, the Java Compiler (javac) converts it to .class bytecode, and the JVM interprets/JIT-compiles that bytecode into native machine instructions.

— JDK (Java Development Kit): Complete toolkit — compiler, debugger, libraries. What developers install.
— JRE (Java Runtime Environment): Subset of JDK. Only runtime libraries + JVM. What end-users install to run Java apps.
— JVM (Java Virtual Machine): The heart. Platform-specific engine that runs bytecode. "Write once, run anywhere."

Memory Regions inside JVM:
• Heap Memory — where all objects live (shared across threads).
• Stack Memory — per-thread. Holds method frames, local primitives, object references.
• String Constant Pool — part of Heap. Literal strings ("hello") are deduplicated here.
• Method Area — stores class metadata, static variables, bytecode.`,
            native: {
              Hinglish: `JDK matlab aapka poora toolbox — compiler bhi, debugger bhi. JRE sirf program chalane ke liye. JVM woh magic machine hai jo bytecode ko har computer pe same tarah chalata hai. Memory mein Heap bada ghar hai sab objects ke liye, aur Stack har method ke liye ek temporary desk hai.`,
              Hindi: `JDK एक पूरा टूलबॉक्स है जिसमें compiler और debugger दोनों हैं। JRE सिर्फ program चलाने के लिए है। JVM वह magical engine है जो bytecode को हर platform पर same तरीके से चलाता है।`,
              Tamil: `JDK என்பது compiler மற்றும் debugger உள்ள முழு கருவிப்பெட்டி. JVM என்பது bytecode-ஐ எந்த கணினியிலும் இயக்கக்கூடிய magic engine.`,
              Telugu: `JDK అనేది compiler మరియు debugger తో కూడిన పూర్తి toolbox. JVM అనేది bytecode ని ఏ platform లోనైనా అదే విధంగా run చేసే magic engine.`,
            },
            code: `// JVM Memory in action
public class MemoryDemo {
    // Static field → stored in Method Area
    static int instanceCount = 0;

    // Instance field → stored in Heap (inside object)
    private String name;

    public MemoryDemo(String name) {
        this.name = name;        // "name" reference on Stack,
                                 // actual String in Heap / String Pool
        instanceCount++;
    }

    public static void main(String[] args) {
        // args reference → Stack
        // MemoryDemo objects → Heap
        MemoryDemo a = new MemoryDemo("Java");
        MemoryDemo b = new MemoryDemo("Spring");

        // String literals → String Constant Pool (Heap)
        String s1 = "hello";
        String s2 = "hello";  // same object as s1 (pooled)
        String s3 = new String("hello");  // new object, NOT pooled

        System.out.println(s1 == s2);  // true  (same pool reference)
        System.out.println(s1 == s3);  // false (different heap object)
        System.out.println(instanceCount); // 2
    }
}`,
            lang: 'java',
            quiz: {
              question: 'Where are String literals created using `String s = "hello";` stored in JVM memory?',
              options: [
                'Stack Memory (per-thread local frame)',
                'String Constant Pool inside Heap Memory — reused for duplicate literals',
                'Method Area alongside static class metadata',
                'Native Method Stack used for JNI calls',
              ],
              correct: 1,
              explanation: 'String literals are stored in the String Constant Pool (a special region inside Heap Memory). When you write `String s = "hello"` twice, both variables point to the same pooled object — saving memory. `new String("hello")` bypasses the pool and creates a fresh Heap object.'
            }
          },
          {
            id: 'java-oop',
            title: 'OOP Pillars: Encapsulation, Inheritance, Polymorphism, Abstraction',
            level: 'Beginner',
            badge: 'badge-sky',
            summary: `The four OOP pillars form the backbone of every Java interview and every production codebase.

1. Encapsulation — Bundling data (fields) and methods together in a class, and restricting direct access using private/protected modifiers with getter/setter methods. WHY: Prevents invalid state and hides internal implementation.

2. Inheritance — A subclass (child) acquires the properties and behaviours of a superclass (parent) using extends. Java supports single-class inheritance. WHY: Code reuse and hierarchical modelling.

3. Polymorphism — "Many forms." One reference type, many implementations.
   • Compile-time: Method Overloading (same name, different parameters).
   • Runtime: Method Overriding (child redefines parent method, resolved at runtime via virtual method table).

4. Abstraction — Hiding complex implementation details. Done via:
   • Abstract classes (0–100% abstract). Can have state, constructors, concrete methods.
   • Interfaces (100% abstract contract by default pre-Java 8; can have default/static methods since Java 8).`,
            native: {
              Hinglish: `Encapsulation matlab apna data lock karo aur sirf safe doors (getters/setters) se access do. Inheritance matlab beta class ko papa class ki saari cheezein milti hain. Polymorphism matlab ek hi naam, alag-alag shapes — jaise "speak()" method different animals ke liye alag bolta hai. Abstraction matlab microwave ka button press karo — andar ka circuit mat dekho.`,
              Hindi: `Encapsulation का अर्थ है data को private रखना और getter/setter से access करना। Inheritance में child class parent class की properties लेती है। Polymorphism में एक method अलग-अलग forms में काम करता है।`,
              Tamil: `Encapsulation என்பது data-ஐ private வைத்து getters/setters மூலம் access செய்வது. Inheritance என்பது child class parent class-இன் properties-ஐ பெறுவது.`,
              Telugu: `Encapsulation అనేది data ని private గా ఉంచి getters/setters ద్వారా access చేయడం. Inheritance అనేది child class parent class ని extend చేయడం.`,
            },
            code: `// All 4 OOP pillars in one example
abstract class Animal {            // Abstraction
    private String name;           // Encapsulation: private field

    public Animal(String name) { this.name = name; }

    public String getName() { return name; }  // Controlled access

    public abstract void speak();  // Abstract: child MUST implement
}

class Dog extends Animal {         // Inheritance
    public Dog(String name) { super(name); }

    @Override
    public void speak() {          // Runtime Polymorphism (overriding)
        System.out.println(getName() + " says: Woof!");
    }

    // Compile-time Polymorphism (overloading)
    public void speak(int times) {
        for (int i = 0; i < times; i++) speak();
    }
}

class Cat extends Animal {
    public Cat(String name) { super(name); }

    @Override
    public void speak() {
        System.out.println(getName() + " says: Meow!");
    }
}

// Usage
Animal[] animals = { new Dog("Bruno"), new Cat("Whiskers") };
for (Animal a : animals) a.speak();  // Dynamic dispatch at runtime`,
            lang: 'java',
            quiz: {
              question: 'What is the key difference between method Overloading and method Overriding in Java?',
              options: [
                'Overloading occurs at runtime; Overriding occurs at compile time',
                'Overloading is compile-time polymorphism (same name, different params in same class); Overriding is runtime polymorphism (child redefines parent method with same signature)',
                'Both are resolved at compile time; Overriding just needs the @Override annotation',
                'Overloading requires inheritance; Overriding does not',
              ],
              correct: 1,
              explanation: 'Method Overloading is resolved at compile time by the compiler based on method signature (parameter count/types) — this is static/compile-time polymorphism. Method Overriding is resolved at runtime by the JVM\'s virtual method table based on the actual object type — this is dynamic/runtime polymorphism.'
            }
          },
          {
            id: 'java-collections',
            title: 'Java Collections Framework & HashMap Internals',
            level: 'Intermediate',
            badge: 'badge-amber',
            summary: `The Collections Framework is one of the most frequently tested topics in Java interviews. Every data structure choice has performance implications.

Core Interfaces:
• List (ordered, duplicates allowed): ArrayList (O(1) get, O(n) insert middle), LinkedList (O(n) get, O(1) insert ends)
• Set (no duplicates): HashSet (O(1) add/get, unordered), TreeSet (O(log n), sorted), LinkedHashSet (insertion order)
• Map (key-value pairs): HashMap, TreeMap, LinkedHashMap, ConcurrentHashMap
• Queue/Deque: LinkedList, ArrayDeque, PriorityQueue

HashMap Internal Mechanics (Critical Interview Topic):
1. hashCode() is called on the key → produces a hash → bucket index = hash % capacity.
2. At each bucket: a singly LinkedList of Entry nodes stores collisions.
3. Java 8+: if collision chain length > 8, it treeifies to Red-Black Tree (O(log n) instead of O(n)).
4. Load Factor (default 0.75): when 75% full, HashMap resizes to double capacity and re-hashes all entries.
5. HashMap is NOT thread-safe. Use ConcurrentHashMap for concurrent access (uses segment-level locking in Java 7, CAS in Java 8).`,
            native: {
              Hinglish: `HashMap ek dictionary ki tarah hai — key daalo, value milega. Internally ek array of buckets hota hai. hashCode() key ko ek slot number deta hai. Agar do keys ek hi slot pe aaye (collision), woh ek chain banaate hain. Java 8 mein agar chain bahut lamba ho jaaye (>8), toh balanced tree ban jaata hai — searching faster ho jaati hai.`,
              Hindi: `HashMap एक dictionary की तरह है। Key का hashCode() bucket index देता है। Collision होने पर LinkedList बनती है। Java 8 में 8 से ज़्यादा collision होने पर Red-Black Tree बन जाता है।`,
              Tamil: `HashMap என்பது dictionary போன்றது. hashCode() bucket index-ஐ கண்டறிகிறது. Collision ஏற்பட்டால் LinkedList உருவாகிறது. Java 8-இல் 8க்கு மேல் collision இருந்தால் Red-Black Tree ஆகிறது.`,
              Telugu: `HashMap అనేది dictionary లాంటిది. hashCode() bucket index ని ఇస్తుంది. Collision వస్తే LinkedList అవుతుంది. Java 8 లో 8 కంటే ఎక్కువ collision లు వస్తే Red-Black Tree అవుతుంది.`,
            },
            code: `import java.util.*;

// ArrayList vs LinkedList performance
List<Integer> arr  = new ArrayList<>();   // O(1) random access
List<Integer> link = new LinkedList<>();  // O(1) insert at head/tail

// HashMap mechanics
Map<String, Integer> scores = new HashMap<>();
scores.put("Rahul", 95);   // hashCode("Rahul") → bucket index
scores.put("Ananya", 87);
scores.get("Rahul");        // O(1) average, O(n) worst-case collision

// Iteration order: HashMap = unordered
//                 LinkedHashMap = insertion order
//                 TreeMap = sorted by key
Map<String, Integer> sorted = new TreeMap<>(scores);

// Thread-safe map
Map<String, Integer> concurrent = new ConcurrentHashMap<>();

// Java 8 Streams on collections
List<String> names = List.of("Rahul", "Ananya", "Amit", "Priya", "Rohit");
List<String> filtered = names.stream()
    .filter(n -> n.length() > 4)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
// Output: [ANANYA, PRIYA, RAHUL, ROHIT]

// Streams: map vs flatMap
List<List<Integer>> nested = List.of(List.of(1,2), List.of(3,4));
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());
// [1, 2, 3, 4]`,
            lang: 'java',
            quiz: {
              question: 'What happens inside a HashMap when two different keys produce the same hashCode() bucket index?',
              options: [
                'The newer key-value pair silently overwrites the older one',
                'A hash collision occurs — entries are stored in a LinkedList (or Red-Black Tree if chain > 8) at that bucket index',
                'HashMap throws a ConcurrentModificationException',
                'HashMap automatically doubles capacity and rehashes immediately',
              ],
              correct: 1,
              explanation: 'A hash collision means two different keys map to the same bucket index. Java resolves this by chaining: the bucket holds a LinkedList of entries. From Java 8 onward, if a bucket\'s chain length exceeds 8, it converts to a Red-Black Tree (O(log n) lookups vs O(n) for a long chain). HashMap resizes (rehashes) when the load factor (75% by default) is reached, NOT immediately on a collision.'
            }
          },
        ]
      },
      {
        id: 'java-m2',
        title: 'Module 2 — Concurrency, Streams & Modern Java',
        topics: [
          {
            id: 'java-threads',
            title: 'Multithreading, ExecutorService & CompletableFuture',
            level: 'Advanced',
            badge: 'badge-violet',
            summary: `Multithreading is essential for building responsive, high-performance Java applications. Every senior interview covers this.

Thread lifecycle: NEW → RUNNABLE → RUNNING → BLOCKED/WAITING/TIMED_WAITING → TERMINATED.

Creating threads:
• Extend Thread class — tight coupling, wastes an entire thread per task.
• Implement Runnable — decouples task from execution. Preferred.
• Callable<T> — like Runnable but returns a value and can throw checked exceptions.

Thread Pools (ExecutorService): Creating raw threads is expensive. Thread pools reuse a fixed set of threads.
• Executors.newFixedThreadPool(n) — n threads, queue grows unbounded.
• Executors.newCachedThreadPool() — grows as needed, reuses idle threads (60s TTL).
• Executors.newSingleThreadExecutor() — 1 thread, sequential tasks.

Synchronization:
• synchronized keyword — intrinsic (monitor) lock. One thread at a time inside the block.
• ReentrantLock — explicit lock with tryLock(), timed waits, fairness.
• volatile — guarantees visibility (no CPU caching), NOT atomicity.
• Atomic classes (AtomicInteger, AtomicReference) — lock-free CAS operations.

CompletableFuture (Java 8):
Non-blocking async pipelines: fetch data from API → transform → combine → handle errors.`,
            native: {
              Hinglish: `Thread ek mini-program hai jo simultaneously chal sakta hai. Thread pool ek team ki tarah hai — 4 log milke kaam karte hain, har kaam ke liye naya hire nahi karte. synchronized block matlab ek time pe sirf ek thread andar jaayega — jaise ATM booth. CompletableFuture matlab kaam shuru karo, baaki kaam karo, jab result ready ho tab use karo.`,
              Hindi: `Thread एक mini-program है जो simultaneously चल सकता है। Thread pool एक team की तरह है। synchronized का मतलब है एक समय पर एक ही thread access करेगा।`,
              Tamil: `Thread என்பது ஒரே நேரத்தில் இயங்கும் mini-program. Thread pool என்பது ஒரு team. synchronized என்பது ஒரு நேரத்தில் ஒரு thread மட்டுமே உள்ளே செல்லும்.`,
              Telugu: `Thread అనేది ఒకే సమయంలో run అయ్యే mini-program. Thread pool అనేది ఒక team. synchronized అంటే ఒక time లో ఒక్క thread మాత్రమే access చేయగలదు.`,
            },
            code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

// ─── Thread Pool ───────────────────────────────────────
ExecutorService pool = Executors.newFixedThreadPool(4);

pool.submit(() -> System.out.println("Task 1 on: " + Thread.currentThread().getName()));
pool.submit(() -> System.out.println("Task 2 on: " + Thread.currentThread().getName()));

pool.shutdown();  // graceful shutdown after tasks finish

// ─── Callable: task with a return value ────────────────
ExecutorService es = Executors.newSingleThreadExecutor();
Future<String> future = es.submit(() -> {
    Thread.sleep(500);   // simulate work
    return "Result ready!";
});
System.out.println(future.get()); // blocks until done

// ─── CompletableFuture pipeline ────────────────────────
CompletableFuture<String> cf = CompletableFuture
    .supplyAsync(() -> fetchUserFromDB(42))        // async
    .thenApply(user -> "Hello, " + user.getName()) // transform
    .exceptionally(ex -> "Error: " + ex.getMessage());

System.out.println(cf.get());

// ─── Atomic counter (thread-safe, no lock) ─────────────
AtomicInteger counter = new AtomicInteger(0);
// Counter.incrementAndGet() uses CAS — no synchronized needed`,
            lang: 'java',
            quiz: {
              question: 'Why should you use ExecutorService with a thread pool rather than creating raw `new Thread()` for each task?',
              options: [
                'new Thread() is deprecated in Java 11 and later versions',
                'Thread creation is expensive (OS-level overhead). A pool reuses threads, controls concurrency, and prevents thread explosion that can crash the JVM',
                'ExecutorService automatically handles synchronized and volatile for you',
                'new Thread() cannot handle Callable tasks — only Runnable',
              ],
              correct: 1,
              explanation: 'Creating a new OS thread for every task has significant overhead (memory ~1MB per thread stack, OS context-switch cost). A thread pool creates N threads once and reuses them across tasks via a queue. This prevents thread explosion (e.g. 10,000 simultaneous requests = 10,000 threads → OutOfMemoryError), controls concurrency, and dramatically improves throughput.'
            }
          },
        ]
      },
      {
        id: 'java-m3',
        title: 'Module 3 — JDBC, Hibernate & Spring Boot',
        topics: [
          {
            id: 'java-spring-boot',
            title: 'Spring Boot REST API with Spring Data JPA',
            level: 'Advanced',
            badge: 'badge-violet',
            summary: `Spring Boot is the industry-standard for building production Java applications. It eliminates XML boilerplate via auto-configuration and convention-over-configuration.

Core annotations:
• @SpringBootApplication — bundles @Configuration + @ComponentScan + @EnableAutoConfiguration.
• @RestController — combines @Controller + @ResponseBody. Every method return value → JSON/XML response.
• @GetMapping, @PostMapping, @PutMapping, @DeleteMapping — map HTTP methods to controller methods.
• @Service — marks business logic layer. Spring manages its lifecycle.
• @Repository — data access layer. Spring adds exception translation.

Spring Data JPA eliminates JDBC boilerplate:
• Extend JpaRepository<Entity, ID> to get 30+ CRUD methods for free.
• Derived queries: findByEmailAndActive(email, true) → SELECT * FROM users WHERE email=? AND active=true.
• @Transactional ensures either ALL database operations in a method succeed or ALL roll back.

Spring Security with JWT:
1. Client sends POST /auth/login with credentials.
2. Server validates, generates a signed JWT token.
3. Client includes token in every subsequent request header: Authorization: Bearer <token>.
4. Server validates token signature + expiry on each request.`,
            native: {
              Hinglish: `Spring Boot matlab Java ka factory mode — boilerplate code hatao, sirf business logic likho. @RestController se URL endpoint banta hai. Spring Data JPA matlab SQL likhne ki zarurat nahi — bas method ka naam sahi rakho. JWT token matlab ek tamper-proof badge jisme aapki identity hoti hai.`,
              Hindi: `Spring Boot में boilerplate code नहीं लिखना पड़ता। @RestController से REST API बनती है। Spring Data JPA में findBy methods से SQL automatically बनता है।`,
              Tamil: `Spring Boot-ல் boilerplate code தேவையில்லை. @RestController REST API உருவாக்குகிறது. Spring Data JPA-ல் findBy methods SQL-ஐ automatically உருவாக்குகிறது.`,
              Telugu: `Spring Boot లో boilerplate code రాయాల్సిన అవసరం లేదు. @RestController REST API create చేస్తుంది. Spring Data JPA లో findBy methods automatically SQL generate చేస్తాయి.`,
            },
            code: `// ─── Entity ─────────────────────────────────────────────
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String track;    // e.g., "Java", "React"
    // getters/setters omitted for brevity
}

// ─── Repository ─────────────────────────────────────────
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByTrack(String track);           // auto SQL
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);
}

// ─── Service ────────────────────────────────────────────
@Service
@Transactional
public class StudentService {
    @Autowired
    private StudentRepository repo;

    public Student enroll(Student s) {
        if (repo.existsByEmail(s.getEmail()))
            throw new RuntimeException("Email already enrolled!");
        return repo.save(s);
    }

    public List<Student> getByTrack(String track) {
        return repo.findByTrack(track);
    }
}

// ─── Controller ─────────────────────────────────────────
@RestController
@RequestMapping("/api/students")
public class StudentController {
    @Autowired
    private StudentService service;

    @PostMapping
    public ResponseEntity<Student> enroll(@RequestBody Student s) {
        return ResponseEntity.ok(service.enroll(s));
    }

    @GetMapping("/track/{track}")
    public List<Student> byTrack(@PathVariable String track) {
        return service.getByTrack(track);
    }
}`,
            lang: 'java',
            quiz: {
              question: 'What does `@Transactional` guarantee in a Spring service method that calls multiple repository save() operations?',
              options: [
                'It runs the method in a separate thread to improve performance',
                'It ensures all database operations in the method either ALL commit successfully, or ALL roll back — maintaining data consistency',
                'It caches the result of the method to prevent repeat database calls',
                'It applies JWT authentication to the method before execution',
              ],
              correct: 1,
              explanation: '@Transactional wraps the method in a database transaction. If any step throws an unchecked exception, Spring rolls back all changes made so far — preventing partial writes. For example: debit from Account A and credit to Account B must both succeed or both fail (atomicity). Without @Transactional, a crash between the two operations could leave the database in an inconsistent state.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'sql',
    label: 'SQL & Databases',
    icon: 'sql',
    color: '#10b981',
    desc: 'DDL/DML → Joins → Subqueries → CTEs → Window Functions → Query Optimization',
    modules: [
      {
        id: 'sql-m1',
        title: 'Module 1 — Joins, Subqueries & CTEs',
        topics: [
          {
            id: 'sql-joins',
            title: 'All Types of SQL JOINs with Real Examples',
            level: 'Beginner',
            badge: 'badge-emerald',
            summary: `JOINs are the most tested SQL topic in placement rounds. They combine rows from two or more tables based on a related column.

INNER JOIN — Returns rows that have matching values in BOTH tables.
LEFT (OUTER) JOIN — Returns ALL rows from the left table + matching rows from the right. Unmatched right rows → NULL.
RIGHT (OUTER) JOIN — Returns ALL rows from the right table + matching from the left. Unmatched left rows → NULL.
FULL OUTER JOIN — Returns ALL rows from both tables. Unmatched rows → NULL on the respective side.
CROSS JOIN — Cartesian product: every row of left × every row of right. N×M rows. Rarely used in practice.
SELF JOIN — Joining a table to itself. Common for hierarchical data (employees and their managers).

Key Interview Trap: NULL behaviour.
LEFT JOIN WHERE right.col IS NULL → Anti-join (rows in left that have NO match in right).`,
            native: {
              Hinglish: `JOIN matlab do tables ko ek saath milana. INNER JOIN sirf woh rows deta hai jo dono tables mein match karti hain. LEFT JOIN matlab left table ki sab rows + right table se jo bhi match kare (nahi mila toh NULL). Think karo: left table = sab students, right table = result. INNER JOIN = jo students pass hue. LEFT JOIN = sab students, pass hue ke liye marks aur fail ke liye NULL.`,
              Hindi: `JOIN से दो tables को मिलाते हैं। INNER JOIN दोनों tables में matching rows देता है। LEFT JOIN left table की सभी rows देता है + right table से matching rows।`,
              Tamil: `JOIN என்பது இரண்டு tables-ஐ இணைப்பது. INNER JOIN இரண்டு tables-லும் match ஆகும் rows மட்டும் தருகிறது. LEFT JOIN left table-இன் அனைத்து rows-உம் தருகிறது.`,
              Telugu: `JOIN అంటే రెండు tables ని కలపడం. INNER JOIN రెండు tables లోనూ match అయ్యే rows ఇస్తుంది. LEFT JOIN left table అన్ని rows ఇస్తుంది.`,
            },
            code: `-- Sample schema used in SQL Sandbox below
-- employees(emp_id, emp_name, dept_id, salary, hire_date)
-- departments(dept_id, dept_name, location)

-- INNER JOIN: only employees WITH a department
SELECT e.emp_name, d.dept_name, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- LEFT JOIN: ALL employees, even if no department assigned
SELECT e.emp_name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- Anti-join: employees with NO department (NULL trick)
SELECT e.emp_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
WHERE d.dept_id IS NULL;

-- SELF JOIN: Find employees earning more than their manager
SELECT e.emp_name AS employee, m.emp_name AS manager
FROM employees e
INNER JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;`,
            lang: 'sql',
            hasSandbox: true,
            quiz: {
              question: 'A LEFT JOIN returns all rows from Table A with matching rows from Table B. What value appears for Table B columns when there is NO matching row?',
              options: [
                'The row is completely excluded from the result set (same as INNER JOIN)',
                'NULL is returned for all Table B columns on that unmatched row',
                'The string "N/A" is auto-inserted by SQL engine',
                'An error is thrown indicating the join key is missing',
              ],
              correct: 1,
              explanation: 'LEFT JOIN always returns every row from the left (first) table. When no matching row exists in the right table, SQL fills all right-table columns with NULL. This is essential for finding records that exist in one table but NOT in another (anti-join pattern: add WHERE right.key IS NULL).'
            }
          },
          {
            id: 'sql-window',
            title: 'Window Functions: RANK, ROW_NUMBER, LEAD, LAG',
            level: 'Advanced',
            badge: 'badge-violet',
            summary: `Window functions perform calculations across a set of rows related to the current row WITHOUT collapsing the result set (unlike GROUP BY which reduces rows).

OVER (PARTITION BY ... ORDER BY ...) defines the "window" (frame) for each calculation.

ROW_NUMBER() — Unique sequential number per partition. No ties — always unique.
RANK()       — Same rank for ties, then SKIPS the next rank(s). (1, 1, 3, 4)
DENSE_RANK() — Same rank for ties, does NOT skip. (1, 1, 2, 3)
NTILE(n)     — Divides rows into n equal buckets.
LEAD(col, n) — Access value from n rows AHEAD in the window.
LAG(col, n)  — Access value from n rows BEHIND in the window.

Interview question: "Find the 2nd highest salary per department."
→ Use DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) then filter WHERE rank = 2.`,
            native: {
              Hinglish: `Window functions GROUP BY se alag hain — GROUP BY rows collapse kar deta hai, window functions nahi karta. Socho: ROW_NUMBER ek race number hai — koi tie nahi. RANK mein agar do log same time pe aaye toh same rank milega, aur agla number skip hoga. DENSE_RANK mein skip nahi hoga. LEAD aur LAG matlab next month aur last month ki value aaj ki row ke saath dekhna.`,
              Hindi: `Window functions GROUP BY से अलग हैं — rows collapse नहीं होते। RANK में tie होने पर same number मिलता है पर अगला skip होता है। DENSE_RANK में skip नहीं होता।`,
              Tamil: `Window functions GROUP BY போல் rows-ஐ collapse செய்வதில்லை. RANK-ல் tie ஆனால் same rank கிடைக்கும், அடுத்தது skip ஆகும். DENSE_RANK-ல் skip இல்லை.`,
              Telugu: `Window functions GROUP BY లాగా rows collapse చేయవు. RANK లో tie అయితే same rank వస్తుంది, తర్వాత skip అవుతుంది. DENSE_RANK లో skip అవ్వదు.`,
            },
            code: `-- ROW_NUMBER vs RANK vs DENSE_RANK comparison
SELECT
    emp_name,
    dept_id,
    salary,
    ROW_NUMBER()  OVER (PARTITION BY dept_id ORDER BY salary DESC) AS row_num,
    RANK()        OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,
    DENSE_RANK()  OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dense_rnk
FROM employees;

-- Find 2nd highest salary per department (classic interview Q)
SELECT emp_name, dept_id, salary
FROM (
    SELECT
        emp_name, dept_id, salary,
        DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dr
    FROM employees
) ranked
WHERE dr = 2;

-- Month-over-month salary comparison using LAG
SELECT
    emp_name,
    salary AS current_salary,
    LAG(salary, 1) OVER (PARTITION BY dept_id ORDER BY hire_date) AS prev_hire_salary,
    salary - LAG(salary, 1) OVER (PARTITION BY dept_id ORDER BY hire_date) AS diff
FROM employees;`,
            lang: 'sql',
            hasSandbox: true,
            quiz: {
              question: 'Employees A and B both earn 90,000 — the highest salary. What rank does employee C (earning 80,000) receive with RANK() vs DENSE_RANK()?',
              options: [
                'RANK() = 2, DENSE_RANK() = 2 (both skip nothing)',
                'RANK() = 3 (skips rank 2 after the tie), DENSE_RANK() = 2 (no gap)',
                'RANK() = 2, DENSE_RANK() = 3 (DENSE_RANK always leaves a gap)',
                'Both functions return 1 since C has the second-highest salary',
              ],
              correct: 1,
              explanation: 'A and B are tied at rank 1. RANK() skips rank 2 (because two people "used" ranks 1 and 2), so C gets rank 3. DENSE_RANK() never skips — A and B share rank 1, so C gets rank 2. In interviews, use DENSE_RANK() for "Nth highest" queries to avoid gaps in ranking.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: 'javascript',
    color: '#0ea5e9',
    desc: 'V8 Engine → Scope & Closures → Prototypes → Event Loop → Promises → ES6+',
    modules: [
      {
        id: 'js-m1',
        title: 'Module 1 — Execution Model & Async JS',
        topics: [
          {
            id: 'js-event-loop',
            title: 'Event Loop, Microtask vs Macrotask Queue',
            level: 'Intermediate',
            badge: 'badge-sky',
            summary: `Understanding the Event Loop is the single most important JavaScript concept for interviews. It explains why JS is non-blocking despite being single-threaded.

JavaScript Runtime Components:
• Call Stack — Executes code synchronously. LIFO. When a function is called, a frame is pushed; when it returns, it's popped.
• Web APIs — Provided by the browser (setTimeout, fetch, DOM events). JS offloads async work here.
• Microtask Queue (aka Job Queue) — Holds Promise callbacks (.then/.catch), queueMicrotask(), MutationObserver. HIGH PRIORITY.
• Macrotask Queue (aka Task Queue / Callback Queue) — Holds setTimeout, setInterval, setImmediate, I/O callbacks. LOWER PRIORITY.

Event Loop algorithm:
1. Execute all synchronous code on Call Stack until empty.
2. Drain the ENTIRE Microtask Queue (process all pending microtasks).
3. Take ONE macrotask from Macrotask Queue, execute it.
4. Drain Microtask Queue again.
5. Repeat from step 3.

Key rule: Microtasks ALWAYS run before the next Macrotask.`,
            native: {
              Hinglish: `JS single-threaded hai matlab ek kaam ek baar mein. Call Stack ek stack of plates jaisa hai — upar wala pehle khatam hoga. setTimeout ka kaam browser Web API ko dedo — jab time khatam ho, callback ko queue mein daalo. Promise callbacks MicroTask queue mein jaate hain — yeh PEHLE chalti hai, timeout ke bhi pehle. Isliye Promise.resolve() setTimeout se pehle print karta hai.`,
              Hindi: `JS single-threaded है। Call Stack में synchronous code चलता है। Promise callbacks Microtask Queue में जाते हैं जो Macrotask (setTimeout) से पहले execute होती है।`,
              Tamil: `JS single-threaded. Call Stack-ல் synchronous code இயங்குகிறது. Promise callbacks Microtask Queue-ல் செல்கின்றன, setTimeout-ஐ விட முன்னால் execute ஆகும்.`,
              Telugu: `JS single-threaded. Call Stack లో synchronous code run అవుతుంది. Promise callbacks Microtask Queue లో వెళ్తాయి, setTimeout కంటే ముందు execute అవుతాయి.`,
            },
            code: `// Classic Event Loop interview output question
console.log("1 — Start");                    // synchronous

setTimeout(() => console.log("2 — Timeout (Macrotask)"), 0); // macrotask queue

Promise.resolve()
  .then(() => console.log("3 — Promise .then (Microtask)"))  // microtask queue
  .then(() => console.log("4 — Chained .then (Microtask)")); // microtask queue

console.log("5 — End");                      // synchronous

// OUTPUT ORDER:
// 1 — Start
// 5 — End
// 3 — Promise .then (Microtask)   ← entire microtask queue drains first
// 4 — Chained .then (Microtask)
// 2 — Timeout (Macrotask)         ← macrotask runs AFTER all microtasks

// ─── async/await desugared ───────────────────────────────
async function fetchData() {
    console.log("A — before await");
    const result = await Promise.resolve("API data"); // microtask
    console.log("B — after await:", result);          // runs as microtask
}

fetchData();
console.log("C — synchronous after fetchData()");

// OUTPUT: A → C → B`,
            lang: 'javascript',
            hasJSPlayground: true,
            quiz: {
              question: 'Which queue has higher priority in the JavaScript Event Loop?',
              options: [
                'Macrotask Queue (setTimeout, setInterval) — it runs first since it was registered first',
                'Microtask Queue (Promise callbacks, queueMicrotask) — it is completely drained before any macrotask runs',
                'Both queues have equal priority; the order is determined by registration time',
                'Priority depends on the JavaScript engine (V8 vs SpiderMonkey)',
              ],
              correct: 1,
              explanation: 'The Microtask Queue always has higher priority. After every synchronous script and after every macrotask, the Event Loop drains the ENTIRE Microtask Queue before picking the next macrotask. This is why Promise.resolve().then() always prints before setTimeout(..., 0) even though setTimeout was registered earlier.'
            }
          },
          {
            id: 'js-closures',
            title: 'Closures, Scope Chain & the this Keyword',
            level: 'Intermediate',
            badge: 'badge-sky',
            summary: `Closures are one of the most powerful and frequently misunderstood concepts in JavaScript.

Closure: A function that "closes over" and retains access to variables from its outer lexical scope, even after the outer function has returned.

Lexical Scope: JS uses lexical (static) scoping — a function's scope is determined by WHERE it is defined in the source code, not WHERE it is called.

Practical use cases:
• Data privacy / encapsulation (simulating private variables before ES6 classes).
• Factory functions and currying.
• Event listeners, timers with captured state.

The "this" keyword — resolved at CALL SITE, not definition site:
• Regular function: this = the object calling the function. In non-strict global scope: window.
• Arrow function: this is lexically inherited from the enclosing scope. Arrow functions don't have their own this.
• call(thisArg, ...args), apply(thisArg, [args]), bind(thisArg) — explicitly set this.`,
            native: {
              Hinglish: `Closure matlab inner function bahar wali function ke variables "yaad" rakhta hai, even after outer function return ho gayi. Jaise ek actor apni previous movie ke dialogue yaad rakhta hai. 'this' keyword ka matlab hai — isko kisne call kiya. Regular function mein 'this' caller hota hai. Arrow function mein 'this' wahi hota hai jo outer scope mein tha.`,
              Hindi: `Closure में inner function outer function के variables को remember करता है। 'this' keyword caller को indicate करता है। Arrow function में 'this' lexically inherited होता है।`,
              Tamil: `Closure-ல் inner function outer function-இன் variables-ஐ நினைவில் வைத்திருக்கும். 'this' keyword caller-ஐ indicate செய்கிறது. Arrow functions-ல் 'this' lexically inherited.`,
              Telugu: `Closure లో inner function outer function variables ని remember చేస్తుంది. 'this' keyword caller ని indicate చేస్తుంది. Arrow functions లో 'this' lexically inherited.`,
            },
            code: `// ─── Closure for data privacy ────────────────────────────
function createCounter(initial = 0) {
    let count = initial;  // private — not accessible outside

    return {
        increment: () => ++count,
        decrement: () => --count,
        value:     () => count,
        reset:     () => { count = initial; }
    };
}

const counter = createCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.value();     // 11
// count is not accessible directly: counter.count → undefined ✓

// ─── Classic closure loop bug & fix ──────────────────────
// BUG: var leaks across iterations
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var:", i), 100); // 3, 3, 3
}

// FIX 1: let (block-scoped, new binding each iteration)
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log("let:", i), 100); // 0, 1, 2
}

// ─── 'this' binding rules ────────────────────────────────
const person = {
    name: "Rahul",
    greet() {
        console.log("Hello, " + this.name); // this = person ✓
    },
    greetArrow: () => {
        console.log("Hello, " + this.name); // this = outer scope (undefined in module) ✗
    }
};

person.greet();       // Hello, Rahul
person.greetArrow();  // Hello, undefined

// Explicit binding
function introduce() { return "I am " + this.name; }
introduce.call({ name: "Ananya" }); // "I am Ananya"`,
            lang: 'javascript',
            hasJSPlayground: true,
            quiz: {
              question: 'What does a closure "close over" in JavaScript?',
              options: [
                'It closes the outer function to prevent further calls to it',
                'It retains a reference to its outer lexical scope\'s variables, making them accessible even after the outer function has returned',
                'It creates a private copy of all global variables at the time of function creation',
                'It prevents garbage collection of the entire module scope',
              ],
              correct: 1,
              explanation: 'A closure is a function bundled with its lexical environment. When a function is created inside another function, it holds a live reference (not a copy) to the outer variables. Even after the outer function returns and its execution context is popped from the stack, the inner function\'s closure keeps those variables alive in memory — allowing classic patterns like data privacy, memoization, and factory functions.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'react',
    label: 'React.js',
    icon: 'react',
    color: '#8b5cf6',
    desc: 'Virtual DOM → Fiber → All Hooks → State Management → Router → Performance',
    modules: [
      {
        id: 'react-m1',
        title: 'Module 1 — Hooks & Performance',
        topics: [
          {
            id: 'react-hooks',
            title: 'Complete Guide to All React Hooks',
            level: 'Intermediate',
            badge: 'badge-violet',
            summary: `React Hooks were introduced in React 16.8 to let functional components use state and lifecycle features previously reserved for class components.

Core Hooks:

useState(initial) — Declares local state. Returns [value, setter]. Every setState call triggers a re-render.

useEffect(fn, deps) — Side effects (API calls, subscriptions, DOM manipulation). Runs AFTER render.
• No deps array: runs after every render.
• Empty array []: runs ONCE after mount (like componentDidMount).
• [dep1, dep2]: runs when deps change.
• Return a cleanup function: runs before next effect and on unmount.

useRef(initial) — Mutable container (.current) that DOESN'T trigger re-renders. Use for: DOM access, storing prev value, timers.

useContext(Context) — Subscribe to React Context. Eliminates prop drilling.

useMemo(() => value, deps) — Memoizes an expensive computed value. Recalculates only when deps change.
useCallback(fn, deps) — Memoizes a function reference. Critical when passing callbacks to child components wrapped in React.memo.

useReducer(reducer, initial) — Alternative to useState for complex state logic. (state, action) → newState pattern.

Custom Hooks — Any function starting with "use" that calls other hooks. Extracts reusable stateful logic.`,
            native: {
              Hinglish: `useState: component ki memory. useEffect: kuch side effect karo (API call, timer set karo) jab render ho. useRef: ek box hai jo change hone pe screen reload nahi karta — DOM element pakdne ke liye. useMemo: expensive calculation ka result yaad rakhta hai jab tak dependency nahi badlti. Custom Hook: apna khud ka hook banao — reusable logic ko package karo.`,
              Hindi: `useState component की memory है। useEffect side effects के लिए है। useRef DOM access के लिए। useMemo expensive calculations को cache करता है। Custom Hooks reusable stateful logic के लिए हैं।`,
              Tamil: `useState component-இன் memory. useEffect side effects-க்காக. useRef DOM access-க்காக. useMemo expensive calculations-ஐ cache செய்கிறது. Custom Hooks reusable logic-க்காக.`,
              Telugu: `useState component యొక్క memory. useEffect side effects కోసం. useRef DOM access కోసం. useMemo expensive calculations cache చేస్తుంది. Custom Hooks reusable logic కోసం.`,
            },
            code: `import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ─── useState + useEffect: data fetching pattern ─────────
function StudentProfile({ studentId }) {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        fetch(\`/api/students/\${studentId}\`)
            .then(r => r.json())
            .then(data => { if (!cancelled) { setStudent(data); setLoading(false); } });

        return () => { cancelled = true; };  // cleanup on unmount / id change
    }, [studentId]);  // re-fetch only when id changes

    if (loading) return <div>Loading...</div>;
    return <h2>{student?.name}</h2>;
}

// ─── useRef: DOM focus without re-render ─────────────────
function SearchBox() {
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []); // focus on mount

    return <input ref={inputRef} placeholder="Search topics..." />;
}

// ─── Custom Hook: reusable data fetching ─────────────────
function useFetch(url) {
    const [data, setData]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    useEffect(() => {
        fetch(url)
            .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
}

// Usage of custom hook
function App() {
    const { data, loading } = useFetch('/api/tracks');
    return loading ? <p>Loading...</p> : <pre>{JSON.stringify(data)}</pre>;
}`,
            lang: 'javascript',
            hasJSPlayground: false,
            quiz: {
              question: 'What is the difference between passing an empty array `[]` vs no array at all as the second argument to useEffect?',
              options: [
                'No difference — both run after every render',
                'Empty array []: effect runs once after initial mount only. No dependency array: effect runs after EVERY render',
                'Empty array []: effect never runs. No array: runs only on mount',
                'Empty array []: effect runs after mount and unmount. No array: runs continuously',
              ],
              correct: 1,
              explanation: 'useEffect\'s second argument (dependency array) controls when the effect re-runs. No array = run after every render (can cause infinite loops if state is set inside). Empty array [] = run once after initial mount (equivalent to componentDidMount in class components). Specific deps [a, b] = re-run when a or b changes. Always return a cleanup function to prevent memory leaks (clear timers, cancel subscriptions).'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'communication',
    label: 'Communication & HR',
    icon: 'communication',
    color: '#f43f5e',
    desc: 'Technical Vocabulary → STAR Method → English Fluency → AI Voice Mock Interviews',
    modules: [
      {
        id: 'hr-m1',
        title: 'Module 1 — HR Interview Mastery',
        topics: [
          {
            id: 'hr-star',
            title: 'STAR Method: Answering Behavioural Questions',
            level: 'Beginner',
            badge: 'badge-rose',
            summary: `Behavioural interview questions ("Tell me about a time when...") are designed to predict your future behaviour based on past experiences. The STAR framework ensures your answers are structured, specific, and compelling.

S — Situation: Set the context. Where were you? What was happening?
T — Task: What was YOUR specific responsibility or challenge? (Not "we" — say "I")
A — Action: The specific steps YOU took. Use active verbs. Be technical if the role requires it.
R — Result: Quantify the outcome. Numbers are gold: "reduced load time by 60%", "cut bug count by 40%".

Common HR Questions & STAR Strategy:

"Tell me about yourself" → Not your bio. 30-second pitch: education + strongest tech skill + a key achievement + what you're looking for.

"What is your greatest weakness?" → Choose a REAL weakness. Show you are actively working on it. Never say "I'm a perfectionist."

"Why this company?" → Research their tech stack, product, values. Connect to YOUR goals.

"Tell me about a challenging project" → Use STAR. Focus on YOUR contribution, obstacles you solved, measurable impact.`,
            native: {
              Hinglish: `STAR ek formula hai — pehle context batao (Situation), phir apni responsibility (Task), phir exactly kya kiya (Action — "I" use karo, "we" nahi), phir kya result aaya (Result — numbers dene ki koshish karo). "Tell me about yourself" ko apni hi life story mat banao — 30-second ka elevator pitch dena hai: skills + achievement + goal.`,
              Hindi: `STAR एक framework है। Situation (context), Task (आपकी जिम्मेदारी), Action (आपने क्या किया), Result (numbers के साथ outcome). "Tell me about yourself" में 30-second pitch दें।`,
              Tamil: `STAR ஒரு framework. Situation (context), Task (உங்கள் பொறுப்பு), Action (நீங்கள் என்ன செய்தீர்கள்), Result (numbers உடன் outcome). "Tell me about yourself"-க்கு 30-second pitch தயார் செய்யுங்கள்.`,
              Telugu: `STAR ఒక framework. Situation (context), Task (మీ responsibility), Action (మీరు ఏమి చేశారు), Result (numbers తో outcome). "Tell me about yourself" కి 30-second pitch ఇవ్వండి.`,
            },
            code: `// STAR answer template for: "Describe a challenging project you worked on"

Situation:
"In my final year project, we were building a Student Placement Portal
 using React and Spring Boot. During the final sprint, our SQL queries
 on the dashboard were taking 6–8 seconds per page load."

Task:
"I was responsible for the backend API layer and was asked to
 investigate and resolve the performance bottleneck before the demo."

Action:
"I analysed the slow queries using MySQL EXPLAIN ANALYZE.
 I found that we had 3 N+1 query problems caused by lazy loading
 in Hibernate. I replaced them with JOIN FETCH queries and added
 composite indexes on the most-filtered columns (dept_id, hire_date).
 I also added response-level caching for static data using Spring Cache."

Result:
"Dashboard load time dropped from 7 seconds to under 400ms — a 95%
 improvement. The demo went smoothly and our project received an A grade.
 The technique was adopted by two other teams."`,
            lang: 'text',
            quiz: {
              question: 'In the STAR method for answering "Tell me about a challenging project", what should the Action (A) component focus on?',
              options: [
                'The team\'s collective effort and what "we" decided together as a group',
                'YOUR specific actions, decisions, and technical steps — using first-person "I" — with enough technical detail to demonstrate competence',
                'The problem itself and why it was difficult (since that shows the stakes)',
                'The tools and technologies available to the team at the time',
              ],
              correct: 1,
              explanation: 'Interviewers want to understand YOUR specific contribution — not the team\'s. Always say "I analyzed", "I implemented", "I reduced". Vague team-focused answers ("we decided", "our team built") fail to showcase your individual skills. Be specific about the exact technical actions you took, the decisions you made, and WHY you made them. Quantify results wherever possible.'
            }
          }
        ]
      }
    ]
  },
];
