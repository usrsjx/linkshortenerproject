---
description: Read this file to understand the data fetching guidelines for the project.
---
# Data Fetching Guidelines
This document outlines the best practices and guidelines for fetching data within our Next.js project. Adhering to these guidelines ensures consistency, maintainability, and optimal performance across the codebase.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS fetch data within server components. This approach allows data to be fetched on the server side, reducing the amount of client-side JavaScript and improving performance. Avoid fetching data directly in client components unless absolutely necessary. NEVER use Client components for data fetching.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory for fetching data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions.
