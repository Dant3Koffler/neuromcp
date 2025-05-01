# Contributing to Neuro MCP Framework

We love your input! We want to make contributing to Neuro MCP Framework as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Development Process
We use GitHub to sync code to and from our internal repository. Pull requests trigger our CI/CD pipeline which runs tests and checks code quality.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows our style guidelines
6. Issue that pull request!

## Development Setup

1. Install Dependencies:
   ```bash
   # Install Rust toolchain
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install Node.js dependencies
   npm install
   ```

2. Build the Project:
   ```bash
   # Build Rust core
   cargo build
   
   # Build TypeScript packages
   npm run build
   ```

3. Run Tests:
   ```bash
   # Run Rust tests
   cargo test
   
   # Run TypeScript tests
   npm test
   ```

## Code Style Guidelines

### Rust
- Follow the official Rust style guide
- Use `cargo fmt` before committing
- Run `clippy` and address all warnings

### TypeScript
- Use ESLint with our provided configuration
- Follow TypeScript best practices
- Document all public APIs

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the version numbers following [Semantic Versioning](https://semver.org/)
3. The PR will be merged once you have the sign-off of at least one maintainer

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker](https://github.com/yourusername/neuro-mcp/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/neuro-mcp/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License. 