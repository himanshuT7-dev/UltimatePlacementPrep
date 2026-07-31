export const SQL_TRACK = {
  id: 'sql',
  label: 'SQL & Databases',
  icon: '🛢️',
  color: '#10b981',
  totalTopics: 20,
  description: 'Master everything from basic queries to advanced window functions, indexing strategies, and database normalization.',
  modules: [
    {
      id: 'mod_sql_foundations',
      title: 'SQL Foundations',
      description: 'Master the basics of database creation, data manipulation, and essential data retrieval operations.',
      topics: [
        {
          id: 'sql_ddl_dml',
          title: 'Database Fundamentals (DDL, DML, DCL, TCL)',
          level: 'Beginner',
          badge: 'badge-emerald',
          summary: `SQL commands are divided into four main categories, each serving a distinct purpose in database management. 
Data Definition Language (DDL) is used to define the database structure or schema. It includes commands like CREATE (to make new tables or databases), ALTER (to modify existing structures), and DROP (to delete structures entirely).
Data Manipulation Language (DML) manages data within schema objects. This includes INSERT (adding new rows), UPDATE (modifying existing data), and DELETE (removing data).
Data Control Language (DCL) manages permissions, primarily using GRANT (giving access) and REVOKE (removing access).
Transaction Control Language (TCL) manages transactions to maintain consistency, using COMMIT (saving changes) and ROLLBACK (undoing changes). Understanding these categories is the first step to mastering SQL, as they form the foundation of how we interact with any relational database system.`,
          native: {
            Hinglish: 'Jaise ghar banane ke liye naksha chahiye (DDL), usme furniture rakhna DML hai. Keys DCL hain, aur changes save karna TCL hai.',
            Hindi: 'जैसे घर बनाने के लिए नक्शा चाहिए (DDL), उसमें सामान रखना DML है। चाबियां DCL हैं, और बदलाव सहेजना TCL है।',
            Tamil: 'ஒரு வீடு கட்ட வரைபடம் (DDL), அதில் பொருட்களை வைப்பது (DML) போல. சாவி (DCL), மாற்றங்களை சேமிப்பது (TCL).',
            Telugu: 'ఇల్లు కట్టడానికి ప్లాన్ (DDL), అందులో వస్తువులు పెట్టడం (DML). తాళం (DCL), మార్పులు సేవ్ చేయడం (TCL).'
          },
          code: `-- DDL: Create a new table
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(100),
    dept_id INT,
    salary DECIMAL(10,2)
);

-- DML: Insert data into the table
INSERT INTO employees (emp_id, emp_name, dept_id, salary) 
VALUES (1, 'Alice', 101, 75000.00),
       (2, 'Bob', 102, 60000.00);

-- DML: Update existing data
UPDATE employees 
SET salary = 80000.00 
WHERE emp_id = 1;

-- DML: Delete data
DELETE FROM employees 
WHERE emp_id = 2;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'Which of the following SQL commands is considered a Data Definition Language (DDL) command?',
            options: ['INSERT', 'UPDATE', 'CREATE', 'GRANT'],
            correct: 2,
            explanation: 'CREATE is a DDL command because it defines the structure of the database objects (like tables). INSERT and UPDATE are DML commands as they manipulate data, while GRANT is a DCL command used for managing permissions.'
          }
        },
        {
          id: 'sql_select_where',
          title: 'Data Retrieval Basics (SELECT & WHERE)',
          level: 'Beginner',
          badge: 'badge-emerald',
          summary: `The SELECT statement is the heart of SQL, allowing you to fetch data from a database. You can retrieve all columns using the asterisk (*) or specify exact column names to limit the data transferred, which is a best practice for performance.
The WHERE clause filters the results based on specific conditions, ensuring you only get the rows you actually need. 
You can combine multiple conditions using logical operators like AND, OR, and NOT. Additionally, operators like IN (to check against a list of values), BETWEEN (for ranges), and LIKE (for pattern matching) provide powerful ways to narrow down your results. 
Understanding how to efficiently query and filter data is crucial because fetching unnecessary data puts undue load on both the database and the network.`,
          native: {
            Hinglish: 'SELECT matlab menu se dish order karna, aur WHERE matlab "bina pyaz ke" bolna. Sirf wahi aayega jo aapne manga hai.',
            Hindi: 'SELECT मतलब मेनू से डिश ऑर्डर करना, और WHERE मतलब "बिना प्याज के" बोलना। सिर्फ वही आएगा जो आपने मांगा है।',
            Tamil: 'SELECT என்பது மெனுவிலிருந்து உணவை ஆர்டர் செய்வது, WHERE என்பது "வெங்காயம் இல்லாமல்" கேட்பது போல.',
            Telugu: 'SELECT అంటే మెనూ నుండి వంటకాన్ని ఆర్డర్ చేయడం, WHERE అంటే "ఉల్లిపాయలు లేకుండా" అని అడగడం లాంటిది.'
          },
          code: `-- Select specific columns
SELECT emp_name, salary 
FROM employees;

-- Filter with WHERE, AND, OR
SELECT * 
FROM employees 
WHERE salary > 50000 AND dept_id = 101;

-- Pattern matching with LIKE
SELECT emp_name 
FROM employees 
WHERE emp_name LIKE 'A%'; -- Names starting with 'A'

-- Filtering with IN and BETWEEN
SELECT * 
FROM employees 
WHERE dept_id IN (101, 102) 
AND salary BETWEEN 40000 AND 90000;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'Which operator would you use in a WHERE clause to find values that match a specific string pattern?',
            options: ['IN', 'BETWEEN', 'LIKE', 'EXISTS'],
            correct: 2,
            explanation: 'The LIKE operator is used in a WHERE clause to search for a specified pattern in a column. It is commonly used with wildcards like % (represents zero, one, or multiple characters) and _ (represents a single character).'
          }
        },
        {
          id: 'sql_group_by_having',
          title: 'Aggregation (GROUP BY & HAVING)',
          level: 'Beginner',
          badge: 'badge-emerald',
          visualizer: {
            engine: 'sql-join',
            title: 'GROUP BY Simulator',
            steps: []
          },
          summary: `Aggregation functions like COUNT(), SUM(), AVG(), MAX(), and MIN() allow you to perform calculations on a set of values and return a single scalar result. They are essential for summarizing data.
The GROUP BY statement works with these functions to group the result set by one or more columns. For instance, you can find the average salary per department.
While the WHERE clause filters rows before aggregation occurs, the HAVING clause was added to SQL because WHERE cannot be used with aggregate functions. HAVING filters the results after they have been grouped.
A common mistake is trying to use WHERE to filter aggregated metrics (e.g., WHERE SUM(salary) > 1000). Always remember: WHERE filters raw data, HAVING filters grouped data.`,
          native: {
            Hinglish: 'GROUP BY matlab class ke hisaab se students ko batna. HAVING matlab sirf un classes ko dekhna jinki average marks 80 se zyada hain.',
            Hindi: 'GROUP BY मतलब क्लास के हिसाब से छात्रों को बांटना। HAVING मतलब सिर्फ उन क्लासों को देखना जिनके औसत अंक 80 से ज्यादा हैं।',
            Tamil: 'GROUP BY என்பது மாணவர்களை வகுப்புகளாக பிரிப்பது. HAVING என்பது 80% மேல் வாங்கிய வகுப்புகளை மட்டும் பார்ப்பது.',
            Telugu: 'GROUP BY అంటే విద్యార్థులను తరగతులుగా విభజించడం. HAVING అంటే 80% కంటే ఎక్కువ మార్కులు వచ్చిన తరగతులను మాత్రమే చూడటం.'
          },
          code: `-- Calculate total salary per department
SELECT dept_id, SUM(salary) as total_salary
FROM employees
GROUP BY dept_id;

-- Find departments with more than 5 employees
SELECT dept_id, COUNT(emp_id) as emp_count
FROM employees
GROUP BY dept_id
HAVING COUNT(emp_id) > 5;

-- Combine WHERE and HAVING
-- (Filter out low earners first, then find depts with high averages)
SELECT dept_id, AVG(salary) as avg_salary
FROM employees
WHERE salary > 30000
GROUP BY dept_id
HAVING AVG(salary) > 60000;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What is the primary difference between the WHERE and HAVING clauses?',
            options: [
              'WHERE is used with SELECT, HAVING is used with UPDATE',
              'WHERE filters rows before grouping, HAVING filters groups after aggregation',
              'HAVING filters rows before grouping, WHERE filters groups after aggregation',
              'There is no difference, they can be used interchangeably'
            ],
            correct: 1,
            explanation: 'WHERE applies conditions to individual rows before they are aggregated or grouped. HAVING is applied after the GROUP BY clause and is used to filter groups based on aggregate conditions like SUM or COUNT.'
          }
        }
      ]
    },
    {
      id: 'mod_sql_relational',
      title: 'Relational Operations',
      description: 'Learn how to combine data from multiple tables using joins, subqueries, and CTEs.',
      topics: [
        {
          id: 'sql_joins',
          title: 'SQL Joins (INNER, OUTER, CROSS, SELF)',
          level: 'Intermediate',
          badge: 'badge-amber',
          visualizer: {
            engine: 'sql-join',
            title: 'SQL JOIN Simulator',
            steps: []
          },
          summary: `JOINs are used to combine rows from two or more tables based on a related column between them.
INNER JOIN returns records that have matching values in both tables.
LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table, and the matched records from the right table (NULL if no match). RIGHT JOIN is the exact opposite.
FULL JOIN returns all records when there is a match in either left or right table, filling missing matches with NULLs.
CROSS JOIN produces a Cartesian product, matching every row of the first table with every row of the second. SELF JOIN is a regular join but the table is joined with itself (useful for hierarchical data like employee-manager relationships).
Choosing the correct JOIN type is critical for ensuring data accuracy and avoiding bloated result sets (like accidental Cartesian products).`,
          native: {
            Hinglish: 'INNER JOIN matlab common friends. LEFT JOIN matlab mere sabhi friends aur unme se jo common hain. CROSS JOIN matlab sabhi ka sabhi se connection.',
            Hindi: 'INNER JOIN मतलब कॉमन दोस्त। LEFT JOIN मतलब मेरे सभी दोस्त और उनमें से जो कॉमन हैं। CROSS JOIN मतलब सभी का सभी से कनेक्शन।',
            Tamil: 'INNER JOIN என்பது பொதுவான நண்பர்கள். LEFT JOIN என்பது எனது எல்லா நண்பர்களும், அதில் பொதுவானவர்களும்.',
            Telugu: 'INNER JOIN అంటే కామన్ ఫ్రెండ్స్. LEFT JOIN అంటే నా స్నేహితులందరూ మరియు వారిలో కామన్ గా ఉన్నవారు.'
          },
          code: `-- INNER JOIN: Employees and their department names
SELECT e.emp_name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- LEFT JOIN: All employees, even if they lack a department
SELECT e.emp_name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- FULL JOIN: All employees and all departments
SELECT e.emp_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;

-- SELF JOIN: Find managers of employees
SELECT e1.emp_name AS Employee, e2.emp_name AS Manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.emp_id;`,
          lang: 'sql',
          hasSandbox: true,
          visualizer: {
            engine: 'sql-join',
            title: 'Interactive SQL Join Engine — Visual Row Matching'
          },
          quiz: {
            question: 'Which JOIN type returns all rows from the left table, even if there are no matches in the right table?',
            options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL JOIN'],
            correct: 2,
            explanation: 'A LEFT JOIN returns all records from the left (first) table, and any matched records from the right (second) table. The result is NULL from the right side if there is no match.'
          }
        },
        {
          id: 'sql_subqueries',
          title: 'Subqueries (Scalar, Inline, Correlated)',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `A Subquery is a query nested inside another query (e.g., inside a SELECT, INSERT, UPDATE, or DELETE statement).
A Scalar subquery returns a single value (one row and one column) and can be used in SELECT or WHERE clauses.
An Inline View is a subquery used in the FROM clause, acting as a temporary table that you can select from or join with.
A Correlated subquery is special: it references columns from the outer query. Unlike normal subqueries which evaluate once, a correlated subquery evaluates once for EVERY row processed by the outer query. 
While correlated subqueries can solve complex row-by-row comparisons (like finding employees who earn more than their department's average), they can be extremely slow on large datasets and should often be rewritten using JOINs or Window Functions.`,
          native: {
            Hinglish: 'Subquery matlab box ke andar box. Normal subquery ek baar khulta hai. Correlated subquery har item ke liye naya box kholta hai (isliye slow hai).',
            Hindi: 'Subquery मतलब बॉक्स के अंदर बॉक्स। Normal subquery एक बार खुलता है। Correlated subquery हर आइटम के लिए नया बॉक्स खोलता है (इसलिए धीमा है)।',
            Tamil: 'Subquery என்பது பெட்டிக்குள் பெட்டி. Correlated subquery ஒவ்வொரு பொருளுக்கும் புதிய பெட்டியை திறக்கும் (அதனால் மெதுவாக இருக்கும்).',
            Telugu: 'Subquery అంటే పెట్టె లోపల పెట్టె. Correlated subquery ప్రతి వస్తువు కోసం కొత్త పెట్టెను తెరుస్తుంది (అందుకే స్లో గా ఉంటుంది).'
          },
          code: `-- Scalar Subquery in WHERE: Employees earning above overall average
SELECT emp_name, salary 
FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Inline View in FROM: Joining with a temporary result
SELECT d.dept_name, temp_e.max_sal
FROM departments d
JOIN (SELECT dept_id, MAX(salary) as max_sal FROM employees GROUP BY dept_id) temp_e
  ON d.dept_id = temp_e.dept_id;

-- Correlated Subquery: Employees earning above THEIR department's average
SELECT e1.emp_name, e1.salary, e1.dept_id
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.dept_id = e1.dept_id -- References outer query table e1
);`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'Why can a correlated subquery be bad for performance on large datasets?',
            options: [
              'It does not allow the use of indexes',
              'It evaluates once for every row processed by the outer query',
              'It requires creating a physical temporary table on the disk',
              'It can only return scalar values'
            ],
            correct: 1,
            explanation: 'A correlated subquery references columns from the outer query, meaning it must be executed sequentially for every single row returned by the outer query, leading to N query executions (where N is outer rows) and potentially terrible performance.'
          }
        },
        {
          id: 'sql_ctes',
          title: 'Common Table Expressions (CTEs)',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `A Common Table Expression (CTE) is a temporary, named result set created using the WITH clause. CTEs exist only during the execution of a single statement (SELECT, INSERT, UPDATE, or DELETE).
CTEs make complex queries much more readable compared to deeply nested subqueries. You can define multiple CTEs in a single WITH clause, separating them with commas, and they can reference each other sequentially.
Recursive CTEs are a powerful variant used to query hierarchical data, such as organizational charts (manager-employee relationships) or graph traversal. A recursive CTE consists of an anchor member (the base case) and a recursive member (the step), unioned together.
Using CTEs improves code maintainability and allows developers to break down massive queries into logical, bite-sized blocks.`,
          native: {
            Hinglish: 'CTE matlab complex formula ko chhote variables me todna. Readability badh jati hai. Jaise maths me let x = ..., let y = ..., fir x + y.',
            Hindi: 'CTE मतलब जटिल फॉर्मूले को छोटे वेरिएबल्स में तोड़ना। इसे पढ़ना आसान हो जाता है। जैसे गणित में let x = ..., let y = ..., फिर x + y.',
            Tamil: 'CTE என்பது பெரிய சூத்திரத்தை சிறிய மாறிகளாகப் பிரிப்பது. கணக்கில் x=.., y=.. என்று வைத்து பின்பு x+y செய்வது போல.',
            Telugu: 'CTE అంటే పెద్ద ఫార్ములాను చిన్న వేరియబుల్స్ గా విడగొట్టడం. లెక్కల్లో x=.., y=.. అని అనుకుని తర్వాత x+y చేయడం లాంటిది.'
          },
          code: `-- Standard CTE to calculate department averages
WITH DeptAvg AS (
    SELECT dept_id, AVG(salary) as avg_sal
    FROM employees
    GROUP BY dept_id
)
-- Use the CTE in the main query
SELECT e.emp_name, e.salary, da.avg_sal
FROM employees e
JOIN DeptAvg da ON e.dept_id = da.dept_id
WHERE e.salary > da.avg_sal;

-- Recursive CTE: Find employee hierarchy starting from the top boss
WITH RECURSIVE EmpHierarchy AS (
    -- Anchor member: CEO (no manager)
    SELECT emp_id, emp_name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive member: Employees reporting to the ones found so far
    SELECT e.emp_id, e.emp_name, e.manager_id, eh.level + 1
    FROM employees e
    INNER JOIN EmpHierarchy eh ON e.manager_id = eh.emp_id
)
SELECT * FROM EmpHierarchy;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What keyword is used to declare a Common Table Expression (CTE)?',
            options: ['CREATE TEMP', 'DECLARE', 'WITH', 'AS'],
            correct: 2,
            explanation: 'The WITH clause is used to declare a CTE. For example: WITH cte_name AS (SELECT ...) SELECT * FROM cte_name.'
          }
        }
      ]
    },
    {
      id: 'mod_sql_advanced',
      title: 'Advanced Analytics & Performance',
      description: 'Dive deep into window functions, understand indexing, and learn how to optimize query execution.',
      topics: [
        {
          id: 'sql_window_functions',
          title: 'Window Functions (ROW_NUMBER, RANK, LEAD, LAG)',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Window functions perform calculations across a set of table rows that are somehow related to the current row, similar to aggregate functions. However, unlike standard aggregations (which collapse rows into a single output), window functions do NOT cause rows to become grouped into a single output row — the rows retain their separate identities.
The OVER() clause defines the window. PARTITION BY divides the result set into partitions (like GROUP BY). ORDER BY defines the logical order of rows within that partition.
Common functions include:
- ROW_NUMBER(): Assigns a unique sequential integer to rows.
- RANK() & DENSE_RANK(): Rank rows; RANK skips numbers on ties (1, 2, 2, 4), DENSE_RANK doesn't (1, 2, 2, 3).
- LEAD() & LAG(): Access data from subsequent or previous rows in the same result set without self-joining. Very useful for time-series analysis (e.g., day-over-day growth).
- SUM() OVER(): Calculates running totals or moving averages.`,
          native: {
            Hinglish: 'Aggregate functions rows ko crush karke ek bana dete hain. Window functions rows ko zinda rakhte hain par bagal me calculation ka column add kar dete hain.',
            Hindi: 'Aggregate functions रोस को कुचल कर एक बना देते हैं। Window functions रोस को जिंदा रखते हैं पर बगल में कैलकुलेशन का कॉलम जोड़ देते हैं।',
            Tamil: 'Aggregate functions வரிசைகளை ஒன்றாக சேர்க்கும். Window functions வரிசைகளை அப்படியே வைத்து, பக்கத்தில் கணக்கீட்டு நெடுவரிசையை சேர்க்கும்.',
            Telugu: 'Aggregate functions అడ్డు వరుసలను కలిపి ఒకటి చేస్తాయి. Window functions అడ్డు వరుసలను ఉంచి, పక్కన లెక్కల కాలమ్‌ని జోడిస్తాయి.'
          },
          code: `-- ROW_NUMBER, RANK, and DENSE_RANK
SELECT emp_name, dept_id, salary,
       ROW_NUMBER() OVER(PARTITION BY dept_id ORDER BY salary DESC) as row_num,
       RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) as rank_val,
       DENSE_RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) as dense_rank_val
FROM employees;

-- LEAD and LAG: Compare current salary to the next lowest salary in department
SELECT emp_name, salary,
       LAG(salary) OVER(PARTITION BY dept_id ORDER BY salary) as prev_lower_salary,
       LEAD(salary) OVER(PARTITION BY dept_id ORDER BY salary) as next_higher_salary
FROM employees;

-- Running Total (Cumulative Sum)
SELECT emp_name, salary,
       SUM(salary) OVER(ORDER BY emp_id) as running_total
FROM employees;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'If three employees have the exact same highest salary, what values will DENSE_RANK() assign to them, and what will the fourth highest employee get?',
            options: [
              '1, 1, 1 for the highest, and 4 for the fourth',
              '1, 2, 3 for the highest, and 4 for the fourth',
              '1, 1, 1 for the highest, and 2 for the fourth',
              'It will throw an error for duplicate values'
            ],
            correct: 2,
            explanation: 'DENSE_RANK() gives the same rank for ties (1, 1, 1) and does NOT skip the next rank number. Therefore, the next distinct salary will get rank 2. Standard RANK() would assign 4 to the next person.'
          }
        },
        {
          id: 'sql_indexes',
          title: 'Indexing (B-Tree, Hash, Composite, Covering)',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `An Index is a performance optimization data structure that improves the speed of data retrieval operations on a database table at the cost of slower writes (INSERT/UPDATE/DELETE) and increased storage space.
B-Tree (Balanced Tree) is the default index type in most RDBMS. It keeps data sorted and allows for fast searches, range queries (>, <, BETWEEN), and sorting.
Hash Indexes are used for exact match lookups (=) and are extremely fast, but they cannot be used for range queries or sorting.
A Composite Index spans multiple columns. Order matters immensely here (Leftmost Prefix Rule). If you index (A, B, C), queries filtering on A, or A and B will use the index, but queries filtering ONLY on B or C will not.
A Covering Index is an index that includes all the columns needed to satisfy the query. If a query finds all its SELECT columns in the index itself, it doesn't need to read the actual table data (an Index-Only Scan), which is incredibly fast.`,
          native: {
            Hinglish: 'Index book ke peeche ke index page jaisa hai. Bina uske puri book (table scan) padhni padegi kisi word ko dhundne ke liye.',
            Hindi: 'इंडेक्स किताब के पीछे के इंडेक्स पेज जैसा है। बिना इसके किसी शब्द को ढूंढने के लिए पूरी किताब (टेबल स्कैन) पढ़नी पड़ेगी।',
            Tamil: 'Index என்பது புத்தகத்தின் பின்னால் உள்ள அட்டவணை போல. இது இல்லாவிட்டால் ஒரு சொல்லைத் தேட முழுப் புத்தகத்தையும் படிக்க வேண்டும்.',
            Telugu: 'Index అనేది పుస్తకం వెనుక ఉండే ఇండెక్స్ పేజీ లాంటిది. ఇది లేకపోతే ఒక పదాన్ని వెతకడానికి మొత్తం పుస్తకం చదవాలి.'
          },
          code: `-- Create a basic B-Tree index on a single column
CREATE INDEX idx_emp_salary ON employees(salary);

-- Create a Composite Index (Order matters!)
-- Good for queries filtering by dept_id AND hire_date
CREATE INDEX idx_dept_hire ON employees(dept_id, hire_date);

-- Creating a Covering Index
-- If we frequently run: SELECT emp_name, salary FROM employees WHERE dept_id = 101;
-- We can INCLUDE non-key columns so the table isn't touched at all
CREATE INDEX idx_dept_covering ON employees(dept_id) INCLUDE (emp_name, salary);

-- Drop an index
DROP INDEX idx_emp_salary;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'You have a composite index on columns (Country, State, City). Which of the following WHERE clauses will NOT effectively utilize this index?',
            options: [
              'WHERE Country = "USA"',
              'WHERE Country = "USA" AND State = "CA"',
              'WHERE State = "CA" AND City = "LA"',
              'WHERE Country = "USA" AND State = "CA" AND City = "LA"'
            ],
            correct: 2,
            explanation: 'According to the Leftmost Prefix Rule, a composite index can only be used if the query filters on the leftmost columns. Filtering by State and City without Country skips the first part of the index, making it mostly useless.'
          }
        },
        {
          id: 'sql_explain_analyze',
          title: 'Query Optimization & EXPLAIN ANALYZE',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `EXPLAIN is a command that shows the execution plan of a statement. The execution plan dictates how the database engine will retrieve the data (e.g., using a Sequential Scan, Index Scan, Hash Join).
While EXPLAIN gives you the estimated plan, EXPLAIN ANALYZE actually executes the query and shows both the estimated costs AND the actual runtime execution times. This is the ultimate tool for diagnosing slow queries.
When analyzing plans, look out for "Seq Scan" (Sequential Scan) on large tables, which means the database is reading every single row because no suitable index exists. Look for expensive operations like "Nested Loop Joins" on unindexed columns or disk-based "External Merge Sorts".
Optimizing queries often involves rewriting them (e.g., replacing correlated subqueries with JOINs), adding appropriate indexes, updating table statistics, or limiting the dataset size early in the plan.`,
          native: {
            Hinglish: 'EXPLAIN aapko batata hai Google Maps kis raste se jayega. EXPLAIN ANALYZE actual me car chala ke batata hai kitna time laga aur kahan traffic (bottleneck) tha.',
            Hindi: 'EXPLAIN आपको बताता है Google Maps किस रास्ते से जाएगा। EXPLAIN ANALYZE असल में कार चला कर बताता है कि कितना समय लगा और कहां ट्रैफिक था।',
            Tamil: 'EXPLAIN கூகுள் மேப்ஸ் எந்த வழியில் செல்லும் என்று கூறும். EXPLAIN ANALYZE உண்மையில் பயணம் செய்து எங்கு டிராஃபிக் இருந்தது என்று கூறும்.',
            Telugu: 'EXPLAIN గూగుల్ మ్యాప్స్ ఏ దారిలో వెళ్తుందో చెప్తుంది. EXPLAIN ANALYZE నిజంగా ప్రయాణించి ఎక్కడ ట్రాఫిక్ ఉందో చెప్తుంది.'
          },
          code: `-- See the estimated execution plan (Doesn't run the query)
EXPLAIN 
SELECT e.emp_name, d.dept_name 
FROM employees e 
JOIN departments d ON e.dept_id = d.dept_id 
WHERE e.salary > 50000;

-- See the actual execution plan with real timings (Runs the query!)
EXPLAIN ANALYZE 
SELECT e.emp_name, d.dept_name 
FROM employees e 
JOIN departments d ON e.dept_id = d.dept_id 
WHERE e.salary > 50000;

-- Example bottleneck: 
-- If the EXPLAIN output says "Seq Scan on employees (cost=0.00..15.00 rows=500 width=32)"
-- It means it's scanning the whole table. An index on 'salary' could change this to an "Index Scan".`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What is the primary difference between EXPLAIN and EXPLAIN ANALYZE?',
            options: [
              'EXPLAIN ANALYZE is only for PostgreSQL, EXPLAIN is universal',
              'EXPLAIN shows estimates without running the query, EXPLAIN ANALYZE actually runs the query and shows real times',
              'EXPLAIN ANALYZE formats the output in JSON, EXPLAIN uses text',
              'There is no difference, they are aliases'
            ],
            correct: 1,
            explanation: 'EXPLAIN provides the query planner\'s estimates. EXPLAIN ANALYZE physically executes the query, discards the output, and returns the actual execution times and row counts, allowing you to see if the planner\'s estimates were accurate.'
          }
        }
      ]
    },
    {
      id: 'mod_sql_architecture',
      title: 'Architecture & Design',
      description: 'Learn database transaction management, concurrency, and schema normalization techniques.',
      topics: [
        {
          id: 'sql_transactions',
          title: 'Transactions & TCL Commands',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `A Transaction is a single logical unit of work that consists of one or more SQL statements. Transactions guarantee that either all the statements within them succeed, or none of them do, preventing partial updates that could corrupt business logic (like transferring money between bank accounts).
TCL (Transaction Control Language) commands manage these transactions.
BEGIN or START TRANSACTION initiates the block.
COMMIT saves all changes made during the transaction permanently to the disk.
ROLLBACK undoes all changes made during the transaction, reverting the database to its state before the transaction began.
SAVEPOINT allows you to set a marker within a transaction, so you can roll back to that specific point without canceling the entire transaction. Properly managing transactions is crucial for data integrity in concurrent applications.`,
          native: {
            Hinglish: 'Transaction matlab "All or Nothing". Ya toh ATM se paise niklenge aur account minus hoga (COMMIT), ya agar error aaya toh kuch nahi hoga (ROLLBACK).',
            Hindi: 'ट्रांजैक्शन मतलब "सब या कुछ नहीं"। या तो ATM से पैसे निकलेंगे और अकाउंट से कटेंगे (COMMIT), या अगर एरर आया तो कुछ नहीं होगा (ROLLBACK)।',
            Tamil: 'Transaction என்பது "எல்லாம் அல்லது எதுவும் இல்லை". ATM-ல் பணம் வந்தால் கணக்கில் குறையும் (COMMIT), பிழை என்றால் எதுவும் நடக்காது (ROLLBACK).',
            Telugu: 'Transaction అంటే "అంతా లేదా ఏమీ లేదు". ATM లో డబ్బులు వస్తే అకౌంట్ లో తగ్గుతాయి (COMMIT), ఎర్రర్ వస్తే ఏమీ జరగదు (ROLLBACK).'
          },
          code: `-- Start a transaction (Syntax varies slightly by DB, e.g., BEGIN vs START TRANSACTION)
BEGIN;

-- Deduct 500 from Account A
UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;

-- Add 500 to Account B
UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;

-- If both succeeded, we commit the changes permanently
COMMIT;

-- ==============================================
-- Using Rollback and Savepoints
BEGIN;
INSERT INTO employees (emp_id, emp_name) VALUES (99, 'Test');
SAVEPOINT sp1; -- Set a checkpoint

UPDATE employees SET salary = 0 WHERE emp_id = 99;
-- Realized mistake! Rollback only to the savepoint
ROLLBACK TO sp1; 

-- Commit the insertion, but not the update
COMMIT;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What does the ROLLBACK command do?',
            options: [
              'Restarts the database server',
              'Saves all changes made in the current transaction',
              'Undoes all changes made in the current transaction since it began or since the last savepoint',
              'Deletes the tables involved in the transaction'
            ],
            correct: 2,
            explanation: 'ROLLBACK reverses any uncommitted changes made within the current transaction block, returning the data to its previous consistent state.'
          }
        },
        {
          id: 'sql_acid',
          title: 'ACID Properties & Isolation Levels',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `ACID is an acronym defining 4 key properties of database transactions: 
Atomicity (All or nothing), Consistency (Data remains valid before/after), Isolation (Concurrent transactions don't interfere), and Durability (Committed data survives crashes).
Isolation Levels control how strictly transactions are separated from each other, balancing data consistency against performance/concurrency.
1. Read Uncommitted: Lowest level. Suffers from "Dirty Reads" (reading uncommitted data from another transaction).
2. Read Committed: Prevents dirty reads. But suffers from "Non-repeatable Reads" (reading the same row twice gives different results if someone else committed an update).
3. Repeatable Read: Prevents non-repeatable reads by locking read rows. Suffers from "Phantom Reads" (new rows might appear if someone else inserts data matching your query criteria).
4. Serializable: Highest level. Complete isolation as if transactions ran sequentially. No dirty, non-repeatable, or phantom reads, but heavily limits concurrency and causes lock contention.`,
          native: {
            Hinglish: 'ACID rules database ko reliable banate hain. Isolation levels decide karte hain ki do users ek hi data ko edit karein toh unhe kya dikhega.',
            Hindi: 'ACID नियम डेटाबेस को विश्वसनीय बनाते हैं। Isolation levels तय करते हैं कि अगर दो यूजर्स एक ही डेटा को एडिट करें तो उन्हें क्या दिखेगा।',
            Tamil: 'ACID விதிகள் டேட்டாபேஸை நம்பகமானதாக்கும். இரண்டு பேர் ஒரே தரவை மாற்றினால் என்ன நடக்கும் என்பதை Isolation levels முடிவு செய்யும்.',
            Telugu: 'ACID రూల్స్ డేటాబేస్ ని నమ్మకంగా ఉంచుతాయి. ఇద్దరు ఒకే డేటాని ఎడిట్ చేస్తే వారికి ఏమి కనిపిస్తుందో Isolation levels నిర్ణయిస్తాయి.'
          },
          code: `-- Change the isolation level for the next transaction (MySQL syntax)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
SELECT SUM(salary) FROM employees;
COMMIT;

-- Highest isolation level: Serializable
-- Prevents Phantom Reads by acquiring range locks.
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
-- If someone tries to INSERT an employee with dept_id = 101 right now, 
-- they will be blocked until we COMMIT.
SELECT * FROM employees WHERE dept_id = 101;
COMMIT;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'Which isolation level prevents "Dirty Reads" but still allows "Non-Repeatable Reads"?',
            options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
            correct: 1,
            explanation: 'Read Committed ensures you only read data that has been fully committed by other transactions (no dirty reads). However, if you read a row, someone else updates it and commits, and you read it again in the same transaction, you will see the new value (non-repeatable read).'
          }
        },
        {
          id: 'sql_normalization',
          title: 'Database Normalization (1NF to BCNF)',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Normalization is the process of organizing data to reduce redundancy and improve data integrity.
1NF (First Normal Form): Eliminate repeating groups and ensure each column contains atomic (indivisible) values. No comma-separated lists in a column!
2NF (Second Normal Form): Must be in 1NF. Every non-key column must be fully dependent on the ENTIRE primary key (crucial for composite keys). Removes partial dependencies.
3NF (Third Normal Form): Must be in 2NF. Every non-key column must depend ONLY on the primary key, not on other non-key columns. "The key, the whole key, and nothing but the key." Removes transitive dependencies.
BCNF (Boyce-Codd Normal Form): A slightly stronger version of 3NF. For every non-trivial functional dependency X -> Y, X must be a superkey.
While normalizing reduces duplication and write anomalies, over-normalizing (many small tables) requires too many joins, slowing down read queries. Denormalization is sometimes used in Data Warehouses for read performance.`,
          native: {
            Hinglish: 'Normalization matlab data ko saaf aur organize karna taaki duplicate na ho. 1NF: ek dabbe me ek cheez. 3NF: har cheez sirf ID pe depend kare, dusre details pe nahi.',
            Hindi: 'Normalization मतलब डेटा को साफ और व्यवस्थित करना ताकि डुप्लीकेट न हो। 1NF: एक डिब्बे में एक चीज। 3NF: हर चीज सिर्फ ID पर निर्भर करे, दूसरे डिटेल्स पर नहीं।',
            Tamil: 'Normalization என்பது தரவை சுத்தமாக ஒழுங்கமைப்பது. 1NF: ஒரு பெட்டியில் ஒரு பொருள். 3NF: ஒவ்வொரு பொருளும் ID-யை மட்டுமே நம்பியிருக்க வேண்டும்.',
            Telugu: 'Normalization అంటే డేటాని శుభ్రంగా ఆర్గనైజ్ చేయడం. 1NF: ఒక పెట్టెలో ఒకే వస్తువు. 3NF: ప్రతి వస్తువు ID పై మాత్రమే ఆధారపడి ఉండాలి.'
          },
          code: `-- Example: Unnormalized Table
-- CREATE TABLE orders_unnormalized (order_id INT, items VARCHAR(100), customer_name VARCHAR(50), customer_address VARCHAR(100));
-- Problem: 'items' has comma separated values (Fails 1NF). 
-- Problem: 'customer_address' depends on 'customer_name', not just 'order_id' (Fails 3NF).

-- Normalized Design (Up to 3NF)

-- Table 1: Customers (Addresses transitive dependency)
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(50),
    customer_address VARCHAR(100)
);

-- Table 2: Orders
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date DATE
);

-- Table 3: Order_Items (Addresses atomicity / repeating groups)
CREATE TABLE order_items (
    order_id INT REFERENCES orders(order_id),
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'Which Normal Form requires that there are no transitive dependencies (i.e., non-key columns depending on other non-key columns)?',
            options: ['1NF', '2NF', '3NF', 'BCNF'],
            correct: 2,
            explanation: 'Third Normal Form (3NF) is satisfied when the table is in 2NF and all its columns are not transitively dependent on the primary key. Meaning, all non-key columns must depend on the primary key and nothing else.'
          }
        }
      ]
    },
    {
      id: 'mod_sql_procedural',
      title: 'Stored Objects & Procedural SQL',
      description: 'Master views, stored procedures, triggers, and advanced cursor logic to write powerful database-side operations.',
      topics: [
        {
          id: 'sql_views',
          title: 'Views & Materialized Views',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `A View is essentially a virtual table based on the result-set of an SQL statement. It doesn't store data itself (standard views), but rather saves a complex query. This is great for simplifying complex joins for end-users and providing an additional layer of security by restricting access to underlying base tables.
However, standard views re-run their underlying query every time they are accessed. This can be slow for massive datasets.
A Materialized View, on the other hand, actually stores the query result physically on the disk. Accessing it is extremely fast, just like reading a regular table. The trade-off is that the data can become stale. Materialized views must be refreshed (manually or on a schedule) to reflect changes in the underlying base tables.
Understanding when to use a standard view (for security and simplicity on live data) versus a materialized view (for fast read access on dashboard data that doesn't need to be real-time) is a frequent interview discussion point.`,
          native: {
            Hinglish: 'View ek smart window hai, parda hatao toh original data dikhta hai. Materialized view ek photo hai, fast khulti hai par agar original change ho toh photo refresh karni padti hai.'
          },
          code: `-- Create a standard view to hide salary details from junior staff
CREATE VIEW dept_summary AS
SELECT dept_id, COUNT(emp_id) as total_employees
FROM employees
GROUP BY dept_id;

-- Query the view just like a table
SELECT * FROM dept_summary WHERE total_employees > 10;

-- PostgreSQL specific: Create a Materialized View for performance
-- This physically stores the data for fast retrieval
CREATE MATERIALIZED VIEW monthly_sales_report AS
SELECT date_trunc('month', sale_date) as month, SUM(amount) as total
FROM huge_sales_table
GROUP BY date_trunc('month', sale_date);

-- Refresh the materialized view when data changes
REFRESH MATERIALIZED VIEW monthly_sales_report;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What is the primary difference between a standard View and a Materialized View?',
            options: [
              'A standard view cannot be joined with other tables, but a materialized view can.',
              'A standard view re-executes its query every time it is called, while a materialized view stores the result physically on disk.',
              'A standard view is used for DML operations, while a materialized view is strictly read-only.',
              'There is no functional difference; they are just different syntax across SQL dialects.'
            ],
            correct: 1,
            explanation: 'Standard views are virtual and execute their underlying query upon every access, ensuring real-time data but potentially slower performance. Materialized views cache the query result physically, offering rapid read performance but requiring manual or scheduled refreshes to update stale data.'
          }
        },
        {
          id: 'sql_stored_procedures',
          title: 'Stored Procedures & Functions',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Stored Procedures and Functions allow you to write procedural code (using variables, IF/ELSE statements, loops) and store it directly inside the database.
A Stored Function must return a single value (or a table) and can be used directly inside SELECT or WHERE statements. They are strictly for computation and cannot modify database state (no INSERT/UPDATE/DELETE).
A Stored Procedure does not return a direct value in the same way (though it can use OUT parameters) and cannot be used in a SELECT statement. However, it can perform multiple complex operations, manage transactions (COMMIT/ROLLBACK), and execute DML statements to modify data.
Using them encapsulates business logic at the database level, reducing network traffic between the application and the DB. However, overuse can lead to "vendor lock-in" (tying you tightly to Oracle, SQL Server, etc.) and makes version control and debugging harder compared to application-layer code.`,
          native: {
            Hinglish: 'Function ek calculator ki tarah hai, input do aur result lo. Procedure ek robot ki tarah hai, usko order do aur wo database ke andar jaake update, delete, sab karke aayega.'
          },
          code: `-- MySQL Example: Creating a Stored Procedure
DELIMITER //
CREATE PROCEDURE GiveRaise(IN p_emp_id INT, IN p_percentage DECIMAL, OUT p_new_salary DECIMAL)
BEGIN
    -- Declare a variable
    DECLARE current_salary DECIMAL(10,2);
    
    -- Get current salary
    SELECT salary INTO current_salary FROM employees WHERE emp_id = p_emp_id;
    
    -- Calculate new salary and update
    SET p_new_salary = current_salary * (1 + (p_percentage / 100));
    UPDATE employees SET salary = p_new_salary WHERE emp_id = p_emp_id;
    
END //
DELIMITER ;

-- Call the procedure
CALL GiveRaise(101, 10.0, @new_sal);
SELECT @new_sal;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'Which of the following is true regarding Stored Functions vs Stored Procedures?',
            options: [
              'Functions can execute COMMIT/ROLLBACK, but Procedures cannot.',
              'Procedures can be called inside a SELECT statement, but Functions cannot.',
              'Functions must return a value and are typically used for computations, while Procedures are used to execute complex business logic and DML operations.',
              'There is no difference; they are interchangeable terms.'
            ],
            correct: 2,
            explanation: 'Stored Functions are designed to return a specific value and be embedded directly within SQL queries (like SELECT). Stored Procedures do not return a direct value in the same manner, cannot be embedded in SELECTs, but can perform complex multi-step data modifications and transaction control.'
          }
        },
        {
          id: 'sql_triggers',
          title: 'Database Triggers',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `A Trigger is a special type of stored procedure that automatically executes (fires) when a specific event occurs in the database table. These events are typically DML operations: INSERT, UPDATE, or DELETE.
Triggers can be set to run BEFORE or AFTER the event. 
BEFORE triggers are often used for data validation or sanitization (e.g., ensuring a negative salary cannot be inserted, or converting text to uppercase before saving).
AFTER triggers are commonly used for maintaining audit trails, logging changes, or updating related tables (e.g., inserting a record into a 'history' table after an employee's salary is updated).
While triggers enforce rules automatically at the database level, they should be used sparingly. Because they run silently in the background ("magic"), they can cause hidden performance bottlenecks or unintended cascading effects that are extremely difficult for developers to debug.`,
          native: {
            Hinglish: 'Trigger ek hidden security guard hai. Jaise hi koi table me data dalta hai, trigger apne aap activate hoke check karta hai ya log book me entry kar deta hai.'
          },
          code: `-- Create an Audit table to track changes
CREATE TABLE salary_audit (
    emp_id INT,
    old_salary DECIMAL(10,2),
    new_salary DECIMAL(10,2),
    changed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MySQL Example: Trigger to log salary changes
DELIMITER //
CREATE TRIGGER before_salary_update 
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
    -- Check if the salary is actually changing
    IF OLD.salary <> NEW.salary THEN
        -- Insert a record into the audit table
        INSERT INTO salary_audit (emp_id, old_salary, new_salary) 
        VALUES (OLD.emp_id, OLD.salary, NEW.salary);
        
        -- Prevent lowering salary (Business Rule Enforcement)
        IF NEW.salary < OLD.salary THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Salary cannot be decreased!';
        END IF;
    END IF;
END; //
DELIMITER ;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What is a common use case for an AFTER UPDATE trigger?',
            options: [
              'Validating input data before it reaches the table',
              'Modifying the values that are about to be inserted into the row',
              'Writing the old values into an audit log table',
              'Preventing the UPDATE operation from occurring if a condition is met'
            ],
            correct: 2,
            explanation: 'AFTER triggers execute after the data modification has successfully completed on the table. This makes them perfect for downstream actions like writing to audit logs or updating related tables, whereas BEFORE triggers are used for validation or preventing the action.'
          }
        },
        {
          id: 'sql_cursors',
          title: 'Cursors & Temporary Tables',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `SQL is inherently set-based, meaning it prefers to operate on entire blocks of data simultaneously. However, sometimes procedural row-by-row processing is unavoidable. This is where Cursors come in.
A Cursor allows you to iterate through a result set one row at a time. It involves declaring the cursor, opening it, fetching rows in a loop, and closing it. While useful for complex sequential logic that cannot be handled by standard JOINs or Window Functions, cursors are notoriously slow and consume significant database resources. They should be considered a last resort.
Temporary Tables (#temp or standard CREATE TEMP TABLE) are short-lived tables that exist only for the duration of a session or transaction. They are extremely useful for breaking down massively complex queries. Instead of a giant 10-table join, you can process smaller chunks, insert intermediate results into a temp table, and join against that. This often provides the query planner a much better execution path and improves overall performance.`,
          native: {
            Hinglish: 'SQL ek baari me sab kaam karne me acha hai. Cursor matlab ek-ek karke kaam karna, jo slow hai. Temp table rough copy jaisa hai, hisaab lagaya aur session khatam hote hi phek diya.'
          },
          code: `-- Example of a Temporary Table (PostgreSQL / MySQL)
-- Creating a temporary table to hold intermediate calculations
CREATE TEMPORARY TABLE temp_top_earners AS
SELECT dept_id, MAX(salary) as max_sal
FROM employees
GROUP BY dept_id;

-- Join with the temp table (much faster than complex correlated subqueries)
SELECT e.emp_name, e.salary, t.dept_id
FROM employees e
JOIN temp_top_earners t ON e.dept_id = t.dept_id AND e.salary = t.max_sal;

-- The temp table automatically drops when the connection/session ends.
-- Explicit drop:
DROP TABLE temp_top_earners;

-- Note: Cursor syntax varies heavily by DB and is extremely verbose. 
-- Avoid them unless absolutely necessary for complex procedural logic.`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'Why are Cursors generally discouraged in SQL development?',
            options: [
              'They can only be used with Temporary Tables.',
              'They process data row-by-row, violating the set-based nature of SQL and severely impacting performance.',
              'They cannot be used inside Stored Procedures.',
              'They permanently lock the tables they are querying.'
            ],
            correct: 1,
            explanation: 'Relational databases are heavily optimized for set-based operations (processing blocks of data at once). Cursors force the database to process data row-by-row sequentially, leading to massive overhead and terrible performance on large datasets.'
          }
        }
      ]
    },
    {
      id: 'mod_sql_advanced_design',
      title: 'Advanced Design & Interview Patterns',
      description: 'Master data modeling, explore anti-patterns, and understand database scaling through partitioning and NoSQL comparisons.',
      topics: [
        {
          id: 'sql_antipatterns',
          title: 'SQL Anti-Patterns & Best Practices',
          level: 'Intermediate',
          badge: 'badge-amber',
          summary: `Writing SQL that "works" is easy; writing scalable SQL is hard. Recognizing Anti-Patterns is crucial for technical interviews.
1. The N+1 Query Problem: Often caused by ORMs (like Hibernate or Prisma). You fetch 1 list of objects, and then run an additional query for each object to fetch related data. Solution: Use JOINs or Eager Loading.
2. Using SELECT *: Pulling all columns wastes network bandwidth and memory, especially if text/blob columns exist. Always explicitly name the columns you need.
3. Missing Indexes on Foreign Keys: If you frequently join tables, the foreign key columns should almost always be indexed. Missing them causes massive full-table scans.
4. Over-Normalization: While 3NF is great for write-heavy systems, splitting data across too many tables requires complex, expensive JOINs for simple reads. Denormalization is a valid strategy for read-heavy analytics.
5. Implicit Casting: Comparing a VARCHAR column to an INT causes the database to convert the data type on the fly, rendering indexes completely useless (a phenomenon called 'Sargability' failure).`,
          native: {
            Hinglish: 'SELECT * use karna matlab thode se saman ke liye pura dukan kharidna. Aur N+1 query matlab har ek item ke liye baar baar dukan jana, ek hi baar me list leke kyu nahi jate?'
          },
          code: `-- ANTI-PATTERN 1: SELECT *
-- Bad: Wastes memory and bandwidth
SELECT * FROM employees;
-- Good: Only what's needed
SELECT emp_name, salary FROM employees;

-- ANTI-PATTERN 2: Function on indexed column (breaks Sargability)
-- Bad: The DB has to run YEAR() on EVERY row, ignoring the index
SELECT * FROM orders WHERE YEAR(order_date) = 2023;
-- Good: Use a range, so the index on order_date can be used efficiently
SELECT * FROM orders WHERE order_date >= '2023-01-01' AND order_date < '2024-01-01';

-- ANTI-PATTERN 3: Implicit casting
-- Bad: 'emp_id' is VARCHAR but compared to INT, breaking indexes
SELECT * FROM employees WHERE emp_id = 1001; 
-- Good: Match the exact type
SELECT * FROM employees WHERE emp_id = '1001';`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What is the primary danger of applying a function to an indexed column in a WHERE clause (e.g., WHERE UPPER(email) = "A@B.COM")?',
            options: [
              'It causes a syntax error in most SQL dialects.',
              'It forces the database to evaluate the function for every row, disabling the use of the index (Sargability failure).',
              'It automatically converts the entire table data to uppercase.',
              'It locks the table preventing concurrent reads.'
            ],
            correct: 1,
            explanation: 'When you apply a function to a column, the database can no longer use the standard B-Tree index structure. It must compute the function for every row (a full table scan), which destroys performance. This is known as making the query non-SARGable.'
          }
        },
        {
          id: 'sql_data_modeling',
          title: 'Data Modeling & Relationships',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `Data modeling is the process of mapping real-world entities into database tables and defining relationships between them using Primary Keys (PK) and Foreign Keys (FK).
1. One-to-One (1:1): Rare. Used to split a wide table into two (e.g., 'users' and 'user_sensitive_data'). The FK in table B is also its PK.
2. One-to-Many (1:N): The most common relationship. E.g., one Department has many Employees. The "Many" side (employees) holds the FK pointing to the "One" side (department).
3. Many-to-Many (M:N): Relational databases cannot handle M:N directly. E.g., Students and Courses (a student takes many courses, a course has many students). You must resolve this by creating a Junction Table (or associative entity) in the middle (e.g., 'student_courses') that holds FKs for both students and courses.
Understanding ER Diagrams (Entity-Relationship) and how to physically implement these conceptual relationships is a staple of system design interviews.`,
          native: {
            Hinglish: 'One-to-Many me bacche ke paas parent ka ID hota hai. Many-to-Many direct nahi hota, uske liye beech me ek "Junction Table" dalna padta hai jo dono ko jodta hai.'
          },
          code: `-- Implementing a Many-to-Many Relationship

-- Table 1: Students
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Table 2: Courses
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_title VARCHAR(100)
);

-- Table 3: Junction Table to resolve Many-to-Many
CREATE TABLE enrollments (
    student_id INT REFERENCES students(student_id),
    course_id INT REFERENCES courses(course_id),
    enrollment_date DATE,
    -- Composite Primary Key prevents duplicate enrollments
    PRIMARY KEY (student_id, course_id)
);

-- Query to get a student's courses
SELECT s.name, c.course_title
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id;`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'How do you resolve a Many-to-Many relationship in a relational database?',
            options: [
              'By putting a foreign key in both tables pointing to each other.',
              'By using a Junction Table (or mapping table) that contains foreign keys referencing the primary keys of both tables.',
              'By using a comma-separated list of IDs in one of the columns.',
              'Relational databases cannot handle Many-to-Many relationships.'
            ],
            correct: 1,
            explanation: 'Relational databases physically implement a Many-to-Many relationship by creating a third "junction" table. This table breaks down the M:N relationship into two One-to-Many relationships.'
          }
        },
        {
          id: 'sql_partitioning_sharding',
          title: 'Partitioning & Sharding',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `As databases grow to terabytes of data, single tables become unmanageable. Partitioning and Sharding are techniques to distribute data for performance and scale.
Partitioning (Vertical/Horizontal): This usually happens within the same database instance. 
- Vertical Partitioning splits columns (putting heavy blob/text data in a separate table).
- Horizontal Partitioning splits rows into different physical partitions based on a key (e.g., Range partitioning by year: 2021 data in partition A, 2022 in partition B). This speeds up queries via "Partition Pruning" (ignoring partitions that don't match the WHERE clause).
Sharding is a specific type of horizontal partitioning where the data is split across entirely different physical database servers. This enables true Horizontal Scaling (adding more cheap machines) rather than Vertical Scaling (buying a more expensive, massive server). 
However, Sharding introduces massive complexity: JOINs across different shards are almost impossible, and ensuring data consistency across multiple servers is extremely difficult.`,
          native: {
            Hinglish: 'Partitioning matlab ek badi almirah me alag alag racks banana date ke hisaab se. Sharding matlab jab ek almirah bhar jaye, toh dusre room me nayi almirah rakh dena.'
          },
          code: `-- PostgreSQL Example: Range Partitioning
-- Create the parent table and define the partition strategy
CREATE TABLE sales_log (
    sale_id INT,
    amount DECIMAL,
    sale_date DATE
) PARTITION BY RANGE (sale_date);

-- Create physical partitions for different years
CREATE TABLE sales_2022 PARTITION OF sales_log
    FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');

CREATE TABLE sales_2023 PARTITION OF sales_log
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

-- When you insert data into 'sales_log', the DB engine 
-- automatically routes the row to the correct physical partition.

-- When you run: SELECT * FROM sales_log WHERE sale_date = '2023-05-05';
-- The DB engine uses "Partition Pruning" and completely ignores the 2022 table.`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'What is the primary difference between Partitioning and Sharding?',
            options: [
              'Partitioning splits columns, while Sharding splits rows.',
              'Partitioning occurs within a single database instance, while Sharding distributes data across multiple independent physical servers.',
              'Partitioning is used for NoSQL, while Sharding is used for Relational databases.',
              'There is no difference; they are synonyms.'
            ],
            correct: 1,
            explanation: 'Partitioning logically divides a table within the same database engine, improving manageability and query speed via partition pruning. Sharding actually moves segments of the data onto entirely different database servers, enabling massive horizontal scalability.'
          }
        },
        {
          id: 'sql_nosql_vs_sql',
          title: 'NoSQL vs SQL',
          level: 'Advanced',
          badge: 'badge-violet',
          summary: `System design interviews often require choosing between SQL and NoSQL.
SQL (Relational): Best for structured data, complex querying (JOINs), and strict ACID compliance (financial transactions). Scales vertically. Examples: PostgreSQL, MySQL.
NoSQL (Non-Relational): Best for rapid development with unstructured/semi-structured data, massive volumes of data, and high velocity reads/writes. Scales horizontally very easily.
Types of NoSQL:
- Document (MongoDB): Stores JSON-like objects. Great for catalogs.
- Key-Value (Redis, DynamoDB): Extremely fast lookups. Great for caching or session storage.
- Column-Family (Cassandra): Great for massive write-heavy time-series data.
- Graph (Neo4j): Optimized for highly connected data (social networks).
The CAP Theorem states that in a distributed system, you can only guarantee 2 of 3 properties: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition Tolerance (system works despite network failures). 
Since network failures (Partitions) are inevitable, databases must choose between Consistency (SQL / CP systems) and Availability (NoSQL / AP systems like Cassandra using eventual consistency).`,
          native: {
            Hinglish: 'SQL ek strict excel sheet hai jahan format fix hai. NoSQL ek notebook hai jahan aap kahin bhi kuch bhi likh sakte ho (document). Bank me SQL chahiye, Twitter/Facebook me NoSQL.'
          },
          code: `-- SQL requires predefined schemas and JOINs
CREATE TABLE users (id INT, name VARCHAR, city_id INT);
CREATE TABLE cities (id INT, city_name VARCHAR);

SELECT u.name, c.city_name 
FROM users u JOIN cities c ON u.city_id = c.id;

-- ==========================================
-- NoSQL (MongoDB Document format) doesn't require fixed schemas.
-- Related data is often embedded directly inside the document 
-- to avoid JOINs, favoring fast read performance.

/*
{
  "_id": 1,
  "name": "Alice",
  "city": {
    "city_id": 101,
    "city_name": "Bangalore",
    "pincode": "560001"
  },
  "hobbies": ["reading", "gaming"] -- Arrays are allowed!
}
*/`,
          lang: 'sql',
          hasSandbox: true,
          quiz: {
            question: 'According to the CAP Theorem, when a network partition (communication failure between servers) occurs, what choice must a distributed database system make?',
            options: [
              'It must choose between Speed and Storage space.',
              'It must choose between Relational schemas and Document structures.',
              'It must choose between Data Consistency and System Availability.',
              'It must crash to prevent data corruption.'
            ],
            correct: 2,
            explanation: 'The CAP theorem dictates that in the presence of a network Partition (P), the system must sacrifice either Consistency (C - returning the absolute latest data) or Availability (A - returning a response at all). Traditional SQL favors CP, while many NoSQL databases favor AP (Eventual Consistency).'
          }
        }
      ]
    }
  ]
};
