


// src/lib/appwrite.ts

// 1. Add 'Query' to the import from the 'appwrite' package
import { Client, Account, Databases, ID, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68504412003c21446068');

export const account = new Account(client);
export const databases = new Databases(client);

// 2. Add 'Query' to the list of re-exported utilities
export { ID, Query } from 'appwrite';