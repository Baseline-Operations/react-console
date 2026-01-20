# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in React Console, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue
2. Email security details to: [security@yourdomain.com] (replace with your email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- We will acknowledge receipt within 48 hours
- We will provide an initial assessment within 7 days
- We will keep you informed of our progress
- We will coordinate disclosure after a fix is available

### Disclosure Policy

- We will credit you for the discovery (if desired)
- We will work with you to understand and resolve the issue
- We will publish a security advisory after the fix is released

## Security Best Practices

When using React Console:

1. **Keep dependencies updated**: Regularly update `react-console` and its dependencies
2. **Review code**: Review generated code when using `create-react-console-app`
3. **Validate input**: Always validate user input in CLI applications
4. **Use HTTPS**: When fetching resources, use secure connections
5. **Sanitize output**: Be careful with user-provided content in terminal output

## Known Security Considerations

- Terminal applications may be vulnerable to injection attacks if user input is not properly sanitized
- File system operations should validate paths to prevent directory traversal
- Environment variables should be treated as potentially sensitive

Thank you for helping keep React Console secure!
