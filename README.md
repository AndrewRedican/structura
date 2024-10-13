# Structura

**Structura** is a performance testing framework designed for tracking and logging the execution of JavaScript/TypeScript algorithms. It includes robust error handling, snapshot management, and detailed performance metrics, making it ideal for analyzing and improving the efficiency of your code over time.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Scripts](#scripts)
    - [Generate Data](#generate-data)
    - [Testing your algorithm](#testing-your-algorithm)
      - [Run stable code](#run-stable-code)
      - [Run experimental code](#run-experimental-code)
- [Performance Testing Framework](#performance-testing-framework)
  - [Snapshot Management](#snapshot-management)
  - [Error Logging](#error-logging)
  - [Terminal Output](#terminal-output)
- [Contributing](#contributing)
- [Author Notes](#author-notes)
- [License](#license)
- [Professional Collaboration And Advanced Features](#professional-collaboration-and-advanced-features)
- [Acknowledgements](#acknowledgements)

## Features

- **Performance Testing**:
  - Measure **execution time**, including min, max, total duration, and average time across multiple iterations.
  - Measure **peak memory usage**
- **Detailed Error Logging**: Log iteration-specific details, input data, stack traces, and algorithm information upon error occurrence.
- **Snapshot Management**: Keep snapshots of code being executed for historical reference, organized by version and unique content hash.
- **Terminal Feedback**: Provide feedback on test outcomes, including success details or error summaries, with links to the appropriate log files.

## Getting Started

### 1. Project Setup

To get started with Structura, clone the repository and install the dependencies:

```bash
  git clone https://github.com/AndrewRedican/structura.git
  cd structura
  npm install
```

### 2. Write an algorithm

### 3. Run CLI command



## Usage

### Scripts

Structura includes scripts for running various tasks. Below are some of the key commands:

#### Generate Data

There generate lists of records in json format under `'./data'` folder. By default, to keep respository lean this directory has been excluded, by including an entry in `.gitignore`. Remove said `data` entry if you would like to commit your sample data into your remote git repository.

> Generate small dataset (5,000 records).

```bash
  npm run gd:small
```

> Generate standard dataset (5,000 records).

```bash
  npm run gd:standard
```

> Generate complex dataset (5,000 records).

```bash
  npm run gd:complex
```

> Generate varied dataset (5,000 records).

```bash
  npm run gd:varied
```

> Generate custom dataset of _N_ amount of records.

You can run the following command. Where `[type]` should be replace with the either `small`, `standard`, `complex`, and `varied`, and `[number]` should be replace by any number greater than `0`. Additionally, you can modify [scripts/generateData.ts](scripts/generateData.ts) to fit your specific needs.


```bash
  npm run gd -- [type] [number]
```

### Testing your algorithm

This repository has a concept of "stable" and "experimental" version of algorithms.

"stable" could be whatever you'd like it to be. It could be whatever the is the latest algorithm version that is optimized for something specific (only you would know what that is). When you are happy, simply copy the code into [./src/stable.ts](./src/stable.ts).

"experimental" as the name implies, it is your work in progress code, that you have been modifying to achieve a certain goal, but you need to test it or refine it further.

Having a "stable" and "experimental" is basically following the scientific method to compare a control/current group (a.k.a code or situation) against the experiment group (a.k.a new code or new situation) ideally changing one specific thing at a time.

#### Run Stable Code

To execute performance tests against the _stable_ version of the algorithm, you can run the following command.

> Note: Notice the `-a` flag, this is references to the name of the target file that is going to be tested

```bash
  npm run measure -- -a stable -t -m -i 100 -p 4 -s 10 -d small
```

This will execute the code in [./src/stable.ts](./src/stable.ts).

#### Run Experimental Code

Execute the experimental version of the code [./src/experiment.ts](./src/experiment.ts).

To execute performance tests against the _stable_ version of the algorithm, you can run the following command.

> Note: Notice the `--algorithm` flag which is essentially the same as `-a` (shorthand version), this is references to the name of the target file that is going to be tested. You may supply a relative path from the `src` folder, or simply supply the name of the file directly under `src` that you want to test. Specificying the `.ts` file extension is entirely optional.

```bash
npm run measure -- --algorithm experiment -t -m -i 200 -p 4 -s 10 -d complex
```

The framework will output performance metrics to the terminal and generate logs in the appropriate directories (./performance, ./snapshots, and ./errors).

#### CLI Options

| Option                      | Description                                                                                                  | Required                                 | Type             | Example Value    |
|-----------------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------|------------------|------------------|
| `-t`, `--time`              | Measure execution time                                                                                       | At least one of `-t` or `-m` is required | Flag (Boolean)   | N/A              |
| `-m`, `--memory`            | Measure memory usage                                                                                         | At least one of `-t` or `-m` is required | Flag (Boolean)   | N/A              |
| `-a`, `--algorithm`         | Path to the algorithm under test, relative to the root directory                                             | Yes                                      | String           | `experiment`     |
| `-i`, `--iterations`        | Number of iterations to run the algorithm                                                                    | Yes                                      | Positive integer | `100`            |
| `-p`, `--precision`         | Number of significant digits                                                                                 | Yes                                      | Positive integer | `4`              |
| `-s`, `--sampling-interval` | Time between memory usage samples in milliseconds                                                            | Required if `-m` is specified            | Positive integer | `10`             |
| `-d`, `--data-type`         | Type of data used for performance tests. Supported values: `small`, `standard`, `complex`, `varied`          | Yes                                      | String           | `small`           |

### Performance Testing Framework

The framework provides detailed logging for performance tests and error handling.

### Snapshot Management

During execution, a snapshot of the code being tested is saved in the `./snapshots/{version}/{sha}` directory. The snapshot is identified by a unique hash (sha) and contains a copy of the code file being executed. This allows you to trace back to the exact version of the code that was run.

### Error Logging

If an error occurs, an error log is generated in the ./errors/{version}/{sha}.log file. The error log contains:

- Algorithm name
- Execution and error timestamps
- Iteration number where the error occurred
- Input data that led to the error
- Error message and stack trace
- Reference to the snapshot file
- Algorithm definition as a string for additional context

### Terminal Output

The terminal output will display the current specifications of the test being run:

![Screenshot of the Performance Test Specifications](misc/screenshots/test-specs.png)

The terminal output will also indicate whether the test completed successfully or encountered an error:

**Success:**

![Screenshot of Execution Duration Test that ran Successfully](misc/screenshots/time-success.png)

**Error:**

![Screenshot of Execution Duration Test that ran Successfully](misc/screenshots/time-error.png)

![Screenshot of Error Details](misc/screenshots/time-error-detail.png)

### Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with a descriptive message.
4. Open a pull request with a detailed description of your changes.

### Author Notes

Structura follows the philosophy of "Simple is best." The aim is to keep the framework lean and easy to understand. Here are some guiding principles:

- **Minimal Dependencies**: The use of third-party packages is kept to a minimum to avoid unnecessary complexity.
- **Node.js Version 22+**: The framework is designed to use the latest Node.js version (22+), which includes experimental TypeScript support.
- **Simplicity Over Convenience**: While convenience features are welcome, they must be weighed against the added complexity or potential dependencies.

### License

Structura is licensed under the Structura License 1.0.
TL;DR: Free for non-commercial use, with no warranty. Use at your own risk. See the [full license](/LICENSE).

### Professional Collaboration And Advanced Features

If you are interested in a more advanced version of Structura with full commercial licensing, algorithm versioning, or AI-integration for self-enhancement or automated unit tests, please reach out to the author.

- **Email**: [andrew.redican.mejia@gmail.com](mailto:andrew.redican.mejia@gmail.com)
- **LinkedIn**: [Andrew Redican](https://www.linkedin.com/in/andrewredican/)

We can discuss custom licensing options and how to extend the framework for your specific needs.

## Acknowledgements

This project makes use of the following third-party libraries:

- [Faker](https://github.com/faker-js/faker) - Licensed under the MIT License.
- [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped) - Licensed under the MIT License.
- [undici-types](https://github.com/nodejs/undici) - Licensed under the MIT License.
