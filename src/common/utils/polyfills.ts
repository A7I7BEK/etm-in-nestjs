// This file contains polyfills for Node.js and browser compatibility.
// It is used to ensure that the application can run in different environments
import * as crypto from 'crypto';
(globalThis as any).crypto = crypto;
