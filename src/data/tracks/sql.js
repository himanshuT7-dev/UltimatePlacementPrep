export const SQL_TRACK = {
  id: 'sql',
  label: 'SQL & Databases',
  icon: 'sql',
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
          summary: `SQL commands are divided into four main categories, each serving a distinct purpose in database management. Understanding these categories is the first step to mastering SQL, as they form the foundation of how we interact with any relational database system.\n\n• Data Definition Language (DDL): Used to define the database structure or schema. It includes commands like CREATE, ALTER, and DROP.\n• Data Manipulation Language (DML): Manages data within schema objects. This includes INSERT, UPDATE, and DELETE.\n• Data Control Language (DCL): Manages permissions, primarily using GRANT and REVOKE.\n• Transaction Control Language (TCL): Manages transactions to maintain consistency, using COMMIT and ROLLBACK.`,
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
          summary: `The SELECT statement is the heart of SQL, allowing you to fetch data from a database. Understanding how to efficiently query and filter data is crucial because fetching unnecessary data puts undue load on both the database and the network.\n\n• SELECT Statement: Fetches data from a database, allowing retrieval of all columns or specific ones for performance.\n• WHERE Clause: Filters results based on specific conditions to return only the rows you need.\n• Logical Operators: Combine multiple conditions using AND, OR, and NOT.\n• Filtering Operators: Use IN for lists, BETWEEN for ranges, and LIKE for pattern matching to narrow down results.`,
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
          summary: `Aggregation functions allow you to perform calculations on a set of values and return a single scalar result, essential for summarizing data. Always remember: WHERE filters raw data, HAVING filters grouped data.\n\n• Aggregation Functions: Include COUNT(), SUM(), AVG(), MAX(), and MIN() to calculate metrics across values.\n• GROUP BY: Works with aggregation functions to group the result set by one or more columns.\n• WHERE Clause: Filters individual rows before any grouping or aggregation occurs.\n• HAVING Clause: Filters the results after they have been grouped by aggregate functions.`,
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
          summary: `JOINs are used to combine rows from two or more tables based on a related column between them. Choosing the correct JOIN type is critical for ensuring data accuracy and avoiding bloated result sets.\n\n• INNER JOIN: Returns records that have matching values in both tables.\n• LEFT JOIN: Returns all records from the left table, and the matched records from the right table (NULL if no match). RIGHT JOIN is the exact opposite.\n• FULL JOIN: Returns all records when there is a match in either left or right table, filling missing matches with NULLs.\n• CROSS JOIN: Produces a Cartesian product, matching every row of the first table with every row of the second.\n• SELF JOIN: A regular join where the table is joined with itself, useful for hierarchical data.`,
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
          summary: `A Subquery is a query nested inside another query. While subqueries can solve complex row-by-row comparisons, some types can be extremely slow on large datasets and should often be rewritten using JOINs or Window Functions.\n\n• Subquery: A nested query used inside a SELECT, INSERT, UPDATE, or DELETE statement.\n• Scalar Subquery: Returns a single value (one row and one column) and can be used in SELECT or WHERE clauses.\n• Inline View: A subquery used in the FROM clause, acting as a temporary table that you can select from or join with.\n• Correlated Subquery: References columns from the outer query and evaluates once for every row processed by the outer query, which can cause performance issues.`,
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
          summary: `A Common Table Expression (CTE) is a temporary, named result set created using the WITH clause. Using CTEs improves code maintainability and allows developers to break down massive queries into logical, bite-sized blocks.\n\n• CTE Basics: Exist only during the execution of a single statement to make complex queries readable.\n• Multiple CTEs: Can be defined in a single WITH clause, separated by commas, and can reference each other sequentially.\n• Recursive CTEs: Used to query hierarchical data or graph traversal, consisting of an anchor member and a recursive member.\n• Anchor Member: The base case in a recursive CTE.\n• Recursive Member: The step in a recursive CTE that references the CTE itself.`,
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
          summary: `Window functions perform calculations across related table rows without collapsing them into a single output, retaining their separate identities. They are defined using the OVER() clause.\n\n• OVER() Clause: Defines the window, using PARTITION BY to divide sets and ORDER BY for logical row order.\n• ROW_NUMBER(): Assigns a unique sequential integer to rows.\n• RANK() & DENSE_RANK(): Rank rows, where RANK skips numbers on ties and DENSE_RANK does not.\n• LEAD() & LAG(): Access data from subsequent or previous rows without self-joining, useful for time-series analysis.\n• SUM() OVER(): Calculates running totals or moving averages across the defined window.`,
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
          summary: `An Index is a performance optimization data structure that improves data retrieval speed at the cost of slower writes and increased storage space.\n\n• B-Tree Index: The default index type that keeps data sorted and allows for fast searches, range queries, and sorting.\n• Hash Index: Extremely fast for exact match lookups but cannot be used for range queries or sorting.\n• Composite Index: Spans multiple columns where order matters based on the Leftmost Prefix Rule.\n• Covering Index: Includes all columns needed to satisfy the query, allowing an Index-Only Scan without reading the actual table data.`,
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
          summary: `EXPLAIN is a command that shows the execution plan of a statement, dictating how the database engine will retrieve data. Optimizing queries involves rewriting them, adding indexes, or updating statistics based on these plans.\n\n• EXPLAIN: Shows the estimated execution plan for a query without actually running it.\n• EXPLAIN ANALYZE: Executes the query and shows both estimated costs and actual runtime execution times for diagnosing issues.\n• Sequential Scan (Seq Scan): An operation where the database reads every single row because no suitable index exists.\n• Expensive Operations: Includes actions like Nested Loop Joins on unindexed columns or disk-based External Merge Sorts that slow down queries.`,
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
          summary: `A Transaction is a single logical unit of work consisting of one or more SQL statements. Properly managing transactions guarantees that either all statements succeed or none do, ensuring data integrity.\n\n• Transaction: A logical unit of work preventing partial updates that could corrupt business logic.\n• BEGIN / START TRANSACTION: Initiates a new transaction block.\n• COMMIT: Saves all changes made during the transaction permanently to the disk.\n• ROLLBACK: Undoes all changes made during the transaction, reverting the database state.\n• SAVEPOINT: Sets a marker within a transaction to allow rolling back to a specific point without canceling the entire block.`,
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
          summary: `ACID is an acronym defining key properties of database transactions, while Isolation Levels control how strictly transactions are separated from each other.\n\n• Atomicity: Ensures transactions are "all or nothing".\n• Consistency: Guarantees data remains valid before and after transactions.\n• Isolation: Ensures concurrent transactions do not interfere with each other.\n• Durability: Guarantees committed data survives system crashes.\n• Read Uncommitted: Lowest isolation level suffering from Dirty Reads.\n• Read Committed: Prevents dirty reads but allows Non-repeatable Reads.\n• Repeatable Read: Prevents non-repeatable reads by locking rows but allows Phantom Reads.\n• Serializable: Highest isolation level ensuring complete isolation at the cost of concurrency.`,
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
          summary: `Normalization is the process of organizing data to reduce redundancy and improve data integrity. While normalizing reduces write anomalies, denormalization is sometimes used for read performance in Data Warehouses.\n\n• 1NF (First Normal Form): Eliminates repeating groups to ensure each column contains atomic values.\n• 2NF (Second Normal Form): Requires 1NF and ensures every non-key column is fully dependent on the entire primary key, removing partial dependencies.\n• 3NF (Third Normal Form): Requires 2NF and ensures non-key columns depend only on the primary key, removing transitive dependencies.\n• BCNF (Boyce-Codd Normal Form): A stronger version of 3NF where every non-trivial functional dependency must have a superkey.\n• Denormalization: The process of adding redundancy back to a normalized schema to improve read performance.`,
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
          summary: `Views serve as virtual tables based on the result-set of an SQL query. Understanding when to use a standard view versus a materialized view is a frequent interview discussion point.\n\n• Standard View: A virtual table that saves a complex query for simplicity and security but re-runs the query upon every access.\n• Materialized View: Physically stores the query result on disk for extremely fast access, though the data can become stale.\n• Refresh: The process of updating a materialized view to reflect changes in the underlying base tables.\n• Security layer: Views can restrict access to underlying base tables, exposing only necessary data to users.`,
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
          summary: `Stored Procedures and Functions allow you to write procedural code directly inside the database. Using them encapsulates business logic and reduces network traffic, though overuse can lead to vendor lock-in.\n\n• Stored Function: Returns a single value and can be used directly inside queries, strictly for computation without modifying database state.\n• Stored Procedure: Performs complex operations and executes DML statements to modify data, but cannot be used within a SELECT statement.\n• Encapsulation: Storing business logic at the database level to reduce application-database network traffic.\n• Vendor Lock-in: The risk of tying an application too tightly to a specific database vendor's procedural SQL dialect.`,
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
          summary: `A Trigger is a special type of stored procedure that automatically executes when a specific DML event occurs. While they enforce rules automatically, triggers should be used sparingly to avoid hidden performance bottlenecks.\n\n• Trigger: Automatically executes in response to INSERT, UPDATE, or DELETE events on a table.\n• BEFORE Trigger: Runs before the event, often used for data validation or sanitization.\n• AFTER Trigger: Runs after the event, commonly used for maintaining audit trails or updating related tables.\n• Background Execution: Triggers run silently, which can lead to unintended cascading effects that are difficult to debug.`,
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
          summary: `While SQL prefers set-based operations, sometimes procedural processing is required. Cursors and Temporary Tables offer different approaches for handling complex sequential or massively joined data logic.\n\n• Cursor: Allows iterating through a result set one row at a time, but is notoriously slow and resource-heavy.\n• Temporary Table: A short-lived table that exists only for the session duration, useful for breaking down complex queries.\n• Row-by-Row Processing: The procedural approach used by cursors that contradicts SQL's native set-based nature.\n• Query Simplification: Using temp tables to store intermediate results, providing the query planner a better execution path.`,
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
          summary: `Writing scalable SQL requires recognizing and avoiding common Anti-Patterns that degrade performance and system efficiency.\n\n• N+1 Query Problem: Fetching a list of objects and running additional queries for each, solved by using JOINs or Eager Loading.\n• SELECT *: Pulling all columns wastes network bandwidth and memory; columns should be explicitly named.\n• Missing Foreign Key Indexes: Failing to index frequently joined foreign keys causes massive full-table scans.\n• Over-Normalization: Splitting data across too many tables, leading to complex and expensive JOINs for simple reads.\n• Implicit Casting: Comparing mismatched data types forces on-the-fly conversion, disabling indexes and causing Sargability failure.`,
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
          summary: `Data modeling maps real-world entities into database tables, defining their interactions through Primary Keys and Foreign Keys. Understanding these relationships is a staple of system design interviews.\n\n• One-to-One (1:1): A rare relationship used to split a wide table, where the foreign key is also the primary key.\n• One-to-Many (1:N): The most common relationship where the "many" side holds a foreign key pointing to the "one" side.\n• Many-to-Many (M:N): A relationship that requires a Junction Table to resolve, as relational databases cannot handle it directly.\n• Junction Table: An associative entity holding foreign keys for both sides of a Many-to-Many relationship.`,
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
          summary: `As databases grow, single tables become unmanageable, requiring data distribution techniques for performance and scale. Sharding introduces massive complexity for joins and consistency.\n\n• Vertical Partitioning: Splits columns to separate heavy data like text or blobs into a different table within the same instance.\n• Horizontal Partitioning: Splits rows into physical partitions based on a key, speeding up queries via Partition Pruning.\n• Sharding: A form of horizontal partitioning where data is split across entirely different physical database servers.\n• Horizontal Scaling: Adding more physical machines to handle load, facilitated by sharding.\n• Vertical Scaling: Upgrading an existing server's hardware capacity instead of adding more machines.`,
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
          summary: `Choosing between SQL and NoSQL is crucial in system design, depending on the need for structured relationships versus horizontal scalability and flexibility. The choice is often dictated by the CAP Theorem trade-offs.\n\n• SQL (Relational): Best for structured data, complex queries, and strict ACID compliance; scales vertically.\n• NoSQL (Non-Relational): Best for unstructured data and high-velocity operations; scales horizontally easily.\n• Document Database: Stores JSON-like objects, ideal for catalogs (e.g., MongoDB).\n• Key-Value Store: Extremely fast lookups, perfect for caching or sessions (e.g., Redis, DynamoDB).\n• Column-Family Store: Designed for massive write-heavy time-series data (e.g., Cassandra).\n• Graph Database: Optimized for highly connected relationship data (e.g., Neo4j).\n• CAP Theorem: States a distributed system can only guarantee two of Consistency, Availability, and Partition Tolerance.`,
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
