# TypeScript Compiler Check

Temporarily removed one status key from the countByStatus return object to verify TypeScript's type checking.

# Compiler error:
C:\Users\HP\Desktop\Shiphub-capstone\shiphub-web> npx tsc -b   
src/lib/countByStatus.ts:5:9 - error TS2741: Property 'Delivered' is missing in type '{ Pending: number;Processing: number; Shipped: number; Cancelled: number; }' but required in type 'StatusCounts'.

5   const counts: StatusCounts = {
          ~~~~~~
Found 1 error in src/lib/countByStatus.ts:5


# Reflection

* TypeScript caught a missing status key in the StatusCounts object.

* TypeScript helps identify type-related mistakes during development.

* TypeScript cannot guarantee that the API will always return valid runtime data.

* Order counts are derived from the orders array so they stay synchronized with the latest order data.

* Keeping counts derived avoids maintaining duplicate state and prevents inconsistencies between orders and their summary counts.